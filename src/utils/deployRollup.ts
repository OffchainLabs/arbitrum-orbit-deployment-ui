import { PublicClient, WalletClient, decodeEventLog, parseGwei, Address, Log } from 'viem';
import { DecodeEventLogReturnType, encodeEventTopics } from 'viem/utils';

import { rollupCreatorABI, rollupCreatorAddress } from '@/generated';
import { ChainType } from '@/types/ChainType';
import { Wallet, RollupContracts, WalletSchema } from '@/types/RollupContracts';
import { RollupConfig, RollupConfigPayloadSchema } from '@/types/rollupConfigDataType';
import {
  buildAnyTrustNodeConfig,
  buildChainConfig,
  buildL3Config,
  buildRollupConfigData,
  buildRollupConfigPayload,
} from './configBuilders';
import { updateLocalStorage } from './localStorageHandler';
import { assertIsAddress, assertIsAddressArray } from './validators';
import { ChainId } from '@/types/ChainId';
import { z } from 'zod';
import { deterministicFactoriesDeploymentEnabled } from './constants';
import { maxDataSize } from './defaults';

type DeployRollupProps = {
  rollupConfig: RollupConfig;
  validators: Wallet[];
  batchPoster: Wallet;
  publicClient: PublicClient;
  walletClient: WalletClient;
  chainType?: ChainType;
  account: Address;
};

const RollupCreateSchema = z.object({
  rollupConfigPayload: RollupConfigPayloadSchema,
  batchPoster: WalletSchema,
  validators: z.array(WalletSchema),
});
const assertIsValidRollupCreatePayload = RollupCreateSchema.parse;

type RollupCreatorAbiType = typeof rollupCreatorABI;

type RollupCreatorEvent = Extract<RollupCreatorAbiType[number], { type: 'event' }>;
type RollupCreatorEventName = RollupCreatorEvent['name'];

type RollupCreatorDecodedEventLog<
  TEventName extends RollupCreatorEventName | undefined = undefined,
> = DecodeEventLogReturnType<RollupCreatorAbiType, TEventName>;

function getEventSignature(eventName: RollupCreatorEventName): string {
  const [eventSignature] = encodeEventTopics({
    abi: rollupCreatorABI,
    eventName,
  });

  return eventSignature;
}

function decodeRollupCreatedEventLog(
  log: Log<bigint, number>,
): RollupCreatorDecodedEventLog<'RollupCreated'> {
  const decodedEventLog = decodeEventLog({ ...log, abi: rollupCreatorABI });

  if (decodedEventLog.eventName !== 'RollupCreated') {
    throw new Error(`[decodeRollupCreatedEventLog] unexpected event: ${decodedEventLog.eventName}`);
  }

  return decodedEventLog;
}

export async function deployRollup({
  rollupConfig,
  validators,
  batchPoster,
  publicClient,
  walletClient,
  account,
  chainType = ChainType.Rollup,
}: DeployRollupProps): Promise<RollupContracts> {
  try {
    const chainConfig = buildChainConfig(rollupConfig, chainType);
    const rollupConfigPayload = buildRollupConfigPayload({ rollupConfig, chainConfig });

    const validatorAddresses = validators.map((v) => v.address);
    const batchPosterAddress = batchPoster.address;
    const nativeToken = rollupConfig.nativeToken;

    console.log(chainConfig);
    console.log('Going for deployment');

    assertIsValidRollupCreatePayload({
      rollupConfigPayload,
      batchPoster,
      validators,
    });

    const parentChainId: ChainId = await publicClient.getChainId();

    assertIsAddress(batchPosterAddress);
    assertIsAddress(nativeToken);
    assertIsAddressArray(validatorAddresses);

    const { request } = await publicClient.simulateContract({
      address: rollupCreatorAddress[parentChainId],
      abi: rollupCreatorABI,
      functionName: 'createRollup',
      args: [
        {
          config: rollupConfigPayload,
          batchPoster: batchPosterAddress,
          validators: validatorAddresses,
          maxDataSize,
          nativeToken,
          deployFactoriesToL2: deterministicFactoriesDeploymentEnabled,
          // this will be ignored because the above is currently set to false
          maxFeePerGasForRetryables: parseGwei('0.1'),
        },
      ],
      value: BigInt(0),
      account,
    });

    const hash = await walletClient.writeContract(request);
    const createRollupTxReceipt = await publicClient.waitForTransactionReceipt({
      hash: hash,
    });

    const log = createRollupTxReceipt.logs
      // find the event log that matches the RollupCreated event signature
      .find((log) => log.topics[0] === getEventSignature('RollupCreated'));

    if (typeof log === 'undefined') {
      throw new Error('RollupCreated event log not found');
    }

    const rollupCreatedEvent = decodeRollupCreatedEventLog(log);

    const rollupContracts: RollupContracts = {
      rollup: rollupCreatedEvent.args.rollupAddress,
      inbox: rollupCreatedEvent.args.inboxAddress,
      outbox: rollupCreatedEvent.args.outbox,
      adminProxy: rollupCreatedEvent.args.adminProxy,
      sequencerInbox: rollupCreatedEvent.args.sequencerInbox,
      bridge: rollupCreatedEvent.args.bridge,
      utils: rollupCreatedEvent.args.validatorUtils,
      validatorWalletCreator: rollupCreatedEvent.args.validatorWalletCreator,
      deployedAtBlockNumber: Number(createRollupTxReceipt.blockNumber),
      nativeToken: rollupCreatedEvent.args.nativeToken,
      upgradeExecutor: rollupCreatedEvent.args.upgradeExecutor,
    };

    let rollupConfigData = buildRollupConfigData({
      rollupConfig,
      rollupContracts,
      validators,
      batchPoster,
      parentChainId,
      chainConfig,
    });

    if (chainType === ChainType.AnyTrust) {
      rollupConfigData = buildAnyTrustNodeConfig(
        rollupConfigData,
        rollupCreatedEvent.args.sequencerInbox,
        parentChainId,
      );
    }

    // Defining L3 config
    const l3Config = await buildL3Config({
      address: account,
      rollupConfig,
      rollupContracts,
      validators,
      batchPoster,
      parentChainId,
    });

    updateLocalStorage(rollupConfigData, l3Config);

    return rollupContracts;
  } catch (e) {
    throw new Error(`Failed to deploy rollup: ${e}`);
  }
}

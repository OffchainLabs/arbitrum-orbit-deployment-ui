import { PublicClient, WalletClient, decodeEventLog, parseGwei, Address, Log } from 'viem';
import { DecodeEventLogReturnType, encodeEventTopics } from 'viem/utils';

import { RollupCreatorAbi, RollupCreatorAbiType } from '@/abis/RollupCreatorAbi';
import { ChainType } from '@/types/ChainType';
import { Wallet, RollupContracts } from '@/types/RollupContracts';
import { RollupConfig } from '@/types/rollupConfigDataType';
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
import { deterministicFactoriesDeploymentEnabled } from './constants';
import { maxDataSize } from './defaults';

export const ARB_GOERLI_CREATOR_ADDRESS = '0xB3f62C1c92D5224d0EC3A8d1efc8a44495B12BEc';
export const ARB_SEPOLIA_CREATOR_ADDRESS = '0x8f6C1B4d75fA3a0D43ca750F308b1F3DDA8d92F7';

type DeployRollupProps = {
  rollupConfig: RollupConfig;
  validators: Wallet[];
  batchPoster: Wallet;
  publicClient: PublicClient;
  walletClient: WalletClient;
  chainType?: ChainType;
  account: Address;
};

type RollupCreatorEvent = Extract<RollupCreatorAbiType[number], { type: 'event' }>;
type RollupCreatorEventName = RollupCreatorEvent['name'];

type RollupCreatorDecodedEventLog<
  TEventName extends RollupCreatorEventName | undefined = undefined,
> = DecodeEventLogReturnType<RollupCreatorAbiType, TEventName>;

function getEventSignature(eventName: RollupCreatorEventName): string {
  const [eventSignature] = encodeEventTopics({
    abi: RollupCreatorAbi,
    eventName,
  });

  return eventSignature;
}

function decodeRollupCreatedEventLog(
  log: Log<bigint, number>,
): RollupCreatorDecodedEventLog<'RollupCreated'> {
  const decodedEventLog = decodeEventLog({ ...log, abi: RollupCreatorAbi });

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
    const chainConfig: string = JSON.stringify(buildChainConfig(rollupConfig));

    const rollupConfigPayload = buildRollupConfigPayload({ rollupConfig, chainConfig });
    const validatorAddresses = validators.map((v) => v.address);
    const batchPosterAddress = batchPoster.address;
    const nativeToken = rollupConfig.nativeToken;

    console.log(chainConfig);
    console.log('Going for deployment');

    const parentChainId = await publicClient.getChainId();

    const rollupCreatorContractAddress =
      parentChainId === ChainId.ArbitrumGoerli
        ? ARB_GOERLI_CREATOR_ADDRESS
        : ARB_SEPOLIA_CREATOR_ADDRESS;

    assertIsAddress(batchPosterAddress);
    assertIsAddress(nativeToken);
    assertIsAddressArray(validatorAddresses);

    const { request } = await publicClient.simulateContract({
      address: rollupCreatorContractAddress,
      abi: RollupCreatorAbi,
      functionName: 'createRollup',
      args: [
        rollupConfigPayload,
        batchPosterAddress,
        validatorAddresses,
        maxDataSize,
        nativeToken,
        deterministicFactoriesDeploymentEnabled,
        parseGwei('0.1'), // this will be ignored because the above is currently set to false
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

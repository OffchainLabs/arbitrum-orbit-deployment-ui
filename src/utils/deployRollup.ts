import { PublicClient, WalletClient, decodeEventLog } from 'viem';
import RollupCore from '@/ethereum/RollupCore.json';
import RollupCreator from '@/ethereum/RollupCreator.json';
import { ChainType } from '@/types/ChainType';
import { Wallet, RollupContracts, RollupCreatedEvent } from '@/types/RollupContracts';
import { RollupConfig } from '@/types/rollupConfigDataType';
import {
  buildAnyTrustNodeConfig,
  buildChainConfig,
  buildL3Config,
  buildRollupConfigData,
  buildRollupConfigPayload,
} from './configBuilders';
import { updateLocalStorage } from './localStorageHandler';
import { assertIsHexString } from './validators';

// On Arbitrum Goerli, so need to change it for other networks
const ARB_GOERLI_CREATOR_ADDRESS = '0x04024711BaD29b6C543b41A8e95fe75cA1c6cB59';

type DeployRollupProps = {
  rollupConfig: RollupConfig;
  validators: Wallet[];
  batchPoster: Wallet;
  publicClient: PublicClient;
  walletClient: WalletClient;
  chainType?: ChainType;
  account: `0x${string}`;
};

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
    console.log(chainConfig);
    console.log('Going for deployment');

    const { request } = await publicClient.simulateContract({
      address: ARB_GOERLI_CREATOR_ADDRESS,
      abi: RollupCreator.abi,
      functionName: 'createRollup',
      args: [rollupConfigPayload, batchPosterAddress, validatorAddresses],
      account,
    });

    const hash = await walletClient.writeContract(request);
    const createRollupTxReceipt = await publicClient.waitForTransactionReceipt({
      hash: hash,
    });

    const rollupCreatedEvent = createRollupTxReceipt.logs
      .map((log) => {
        try {
          return decodeEventLog({
            ...log,
            abi: RollupCreator.abi as any,
          });
        } catch (e) {}
      })
      .filter((event) => !!event)
      .find((event) => event && event.eventName === 'RollupCreated') as
      | RollupCreatedEvent
      | undefined;

    if (!rollupCreatedEvent || !('args' in rollupCreatedEvent)) {
      throw new Error('RollupCreated event not found');
    }

    const outbox = await publicClient.readContract({
      address: rollupCreatedEvent.args.rollupAddress,
      abi: RollupCore.abi,
      functionName: 'outbox',
    });
    assertIsHexString(outbox);

    const validatorUtils = await publicClient.readContract({
      address: rollupCreatedEvent.args.rollupAddress,
      abi: RollupCore.abi,
      functionName: 'validatorUtils',
    });
    assertIsHexString(validatorUtils);

    const validatorWalletCreator = await publicClient.readContract({
      address: rollupCreatedEvent.args.rollupAddress,
      abi: RollupCore.abi,
      functionName: 'validatorWalletCreator',
    });
    assertIsHexString(validatorWalletCreator);

    const rollupContracts: RollupContracts = {
      rollup: rollupCreatedEvent.args.rollupAddress,
      inbox: rollupCreatedEvent.args.inboxAddress,
      outbox: outbox,
      adminProxy: rollupCreatedEvent.args.adminProxy,
      sequencerInbox: rollupCreatedEvent.args.sequencerInbox,
      bridge: rollupCreatedEvent.args.bridge,
      utils: validatorUtils,
      validatorWalletCreator: validatorWalletCreator,
      deployedAtBlockNumber: Number(createRollupTxReceipt.blockNumber),
    };

    let rollupConfigData = buildRollupConfigData({
      rollupConfig,
      rollupContracts,
      validators,
      batchPoster,
    });

    if (chainType === ChainType.AnyTrust) {
      rollupConfigData = buildAnyTrustNodeConfig(
        rollupConfigData,
        rollupCreatedEvent.args.sequencerInbox,
      );
    }

    // Defining L3 config
    const l3Config = await buildL3Config({
      address: account,
      rollupConfig,
      rollupContracts,
      validators,
      batchPoster,
    });

    updateLocalStorage(rollupConfigData, l3Config);

    return rollupContracts;
  } catch (e) {
    throw new Error(`Failed to deploy rollup: ${e}`);
  }
}

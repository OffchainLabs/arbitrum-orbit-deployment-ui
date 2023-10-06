import { PublicClient, WalletClient, decodeEventLog, parseGwei } from 'viem';
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
import { assertIsAddress } from './validators';
import { ChainId } from '@/types/ChainId';
import { deterministicFactoriesDeploymentEnabled } from './constants';

export const ARB_GOERLI_CREATOR_ADDRESS = '0x5Bbc71b2C7E5B01dc4D8b337059f0F6dEF0FDF3F';
// todo: update arb sepolia address to latest version
export const ARB_SEPOLIA_CREATOR_ADDRESS = '0x5e136cdb8d442EB3BB61f04Cb64ab5D3CE01c564';

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
    const nativeToken = rollupConfig.nativeToken;

    console.log(chainConfig);
    console.log('Going for deployment');

    const parentChainId = await publicClient.getChainId();

    const rollupCreatorContractAddress =
      parentChainId === ChainId.ArbitrumGoerli
        ? ARB_GOERLI_CREATOR_ADDRESS
        : ARB_SEPOLIA_CREATOR_ADDRESS;

    const { request } = await publicClient.simulateContract({
      address: rollupCreatorContractAddress,
      abi: RollupCreator.abi,
      functionName: 'createRollup',
      args: [
        rollupConfigPayload,
        batchPosterAddress,
        validatorAddresses,
        nativeToken,
        deterministicFactoriesDeploymentEnabled,
        parseGwei('0.1'), // this will be ignored because the above is currently set to false
      ],
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
    assertIsAddress(outbox);

    const validatorUtils = await publicClient.readContract({
      address: rollupCreatedEvent.args.rollupAddress,
      abi: RollupCore.abi,
      functionName: 'validatorUtils',
    });
    assertIsAddress(validatorUtils);

    const validatorWalletCreator = await publicClient.readContract({
      address: rollupCreatedEvent.args.rollupAddress,
      abi: RollupCore.abi,
      functionName: 'validatorWalletCreator',
    });
    assertIsAddress(validatorWalletCreator);

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

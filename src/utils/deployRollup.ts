import { PublicClient, WalletClient, Address } from 'viem';
import {
  createRollup,
  prepareChainConfig,
  prepareNodeConfig,
  CoreContracts,
} from '@arbitrum/orbit-sdk';

import { ChainType } from '@/types/ChainType';
import { Wallet } from '@/types/RollupContracts';
import { RollupConfig } from '@/types/rollupConfigDataType';
import { buildL3Config, buildRollupConfigPayload } from './configBuilders';
import { updateLocalStorage } from './localStorageHandler';
import { assertIsAddress, assertIsAddressArray } from './validators';
import { ChainId } from '@/types/ChainId';
import { getRpcUrl } from './getRpcUrl';

type DeployRollupProps = {
  rollupConfig: RollupConfig;
  validators: Wallet[];
  batchPoster: Wallet;
  publicClient: PublicClient;
  walletClient: WalletClient;
  chainType?: ChainType;
  account: Address;
};

export async function deployRollup({
  rollupConfig,
  validators,
  batchPoster,
  publicClient,
  walletClient,
  account,
  chainType = ChainType.Rollup,
}: DeployRollupProps): Promise<CoreContracts> {
  try {
    assertIsAddress(rollupConfig.owner);

    const chainConfig = prepareChainConfig({
      chainId: rollupConfig.chainId,
      arbitrum: {
        InitialChainOwner: rollupConfig.owner,
        DataAvailabilityCommittee: chainType === ChainType.AnyTrust,
      },
    });
    const rollupConfigPayload = buildRollupConfigPayload({ rollupConfig, chainConfig });

    const validatorAddresses = validators.map((v) => v.address);
    const batchPosterAddress = batchPoster.address;
    const nativeToken = rollupConfig.nativeToken;

    console.log(chainConfig);
    console.log('Going for deployment');

    const parentChainId: ChainId = await publicClient.getChainId();

    assertIsAddress(batchPosterAddress);
    assertIsAddress(nativeToken);
    assertIsAddressArray(validatorAddresses);

    const txReceipt = await createRollup({
      params: {
        config: rollupConfigPayload,
        batchPoster: batchPosterAddress,
        validators: validatorAddresses,
        nativeToken,
      },
      walletClient,
      publicClient,
    });

    const coreContracts = txReceipt.getCoreContracts();

    const nodeConfig = prepareNodeConfig({
      chainName: rollupConfig.chainName,
      chainConfig,
      coreContracts,
      batchPosterPrivateKey: batchPoster.privateKey || '',
      validatorPrivateKey: validators[0].privateKey || '',
      parentChainId,
      parentChainRpcUrl: getRpcUrl(parentChainId),
    });

    // Defining L3 config
    const l3Config = await buildL3Config({
      address: account,
      rollupConfig,
      coreContracts,
      validators,
      batchPoster,
      parentChainId,
    });

    updateLocalStorage(nodeConfig, l3Config);

    return coreContracts;
  } catch (e) {
    throw new Error(`Failed to deploy rollup: ${e}`);
  }
}

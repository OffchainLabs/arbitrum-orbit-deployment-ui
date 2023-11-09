import { PublicClient, WalletClient, Address } from 'viem';
import { createRollup, createRollupPrepareChainConfig } from '@arbitrum/orbit-sdk';

import { ChainType } from '@/types/ChainType';
import { Wallet, RollupContracts } from '@/types/RollupContracts';
import { RollupConfig } from '@/types/rollupConfigDataType';
import {
  buildAnyTrustNodeConfig,
  buildL3Config,
  buildRollupConfigData,
  buildRollupConfigPayload,
} from './configBuilders';
import { updateLocalStorage } from './localStorageHandler';
import { assertIsAddress, assertIsAddressArray } from './validators';
import { ChainId } from '@/types/ChainId';
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
    assertIsAddress(rollupConfig.owner);

    const chainConfig = createRollupPrepareChainConfig({
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

    const { receipt, result } = await createRollup({
      params: {
        config: rollupConfigPayload,
        batchPoster: batchPosterAddress,
        validators: validatorAddresses,
        maxDataSize,
        nativeToken,
      },
      walletClient,
      publicClient,
    });

    const rollupContracts: RollupContracts = {
      rollup: result.rollupAddress,
      inbox: result.inboxAddress,
      outbox: result.outbox,
      adminProxy: result.adminProxy,
      sequencerInbox: result.sequencerInbox,
      bridge: result.bridge,
      utils: result.validatorUtils,
      validatorWalletCreator: result.validatorWalletCreator,
      deployedAtBlockNumber: Number(receipt.blockNumber),
      nativeToken: result.nativeToken,
      upgradeExecutor: result.upgradeExecutor,
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
        result.sequencerInbox,
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

import { parseEther, GetFunctionArgs } from 'viem';
import { ChainConfig, CoreContracts } from '@arbitrum/orbit-sdk';
import { rollupCreator } from '@arbitrum/orbit-sdk/contracts';

import { Wallet } from '@/types/RollupContracts';
import { L3Config } from '@/types/L3Config';
import { RollupConfig } from '@/types/rollupConfigDataType';
import { getRpcUrl } from '@/utils/getRpcUrl';
import { assertIsAddress } from './validators';

export type RollupConfigPayload = Omit<
  GetFunctionArgs<typeof rollupCreator.abi, 'createRollup'>['args'][0]['config'],
  'wasmModuleRoot'
>;

export const buildRollupConfigPayload = ({
  rollupConfig,
  chainConfig,
}: {
  rollupConfig: RollupConfig;
  chainConfig: ChainConfig;
}): RollupConfigPayload => {
  try {
    assertIsAddress(rollupConfig.owner);
    assertIsAddress(rollupConfig.stakeToken);

    return {
      confirmPeriodBlocks: BigInt(rollupConfig.confirmPeriodBlocks),
      extraChallengeTimeBlocks: BigInt(rollupConfig.extraChallengeTimeBlocks),
      stakeToken: rollupConfig.stakeToken,
      baseStake: parseEther(String(rollupConfig.baseStake)),
      owner: rollupConfig.owner,
      loserStakeEscrow: rollupConfig.loserStakeEscrow,
      chainId: BigInt(rollupConfig.chainId),
      chainConfig: JSON.stringify(chainConfig),
      genesisBlockNum: BigInt(rollupConfig.genesisBlockNum),
      sequencerInboxMaxTimeVariation: {
        delayBlocks: BigInt(rollupConfig.sequencerInboxMaxTimeVariation.delayBlocks),
        futureBlocks: BigInt(rollupConfig.sequencerInboxMaxTimeVariation.futureBlocks),
        delaySeconds: BigInt(rollupConfig.sequencerInboxMaxTimeVariation.delaySeconds),
        futureSeconds: BigInt(rollupConfig.sequencerInboxMaxTimeVariation.futureSeconds),
      },
    };
  } catch (e) {
    throw new Error(`Error building rollup config payload: ${e}`);
  }
};

export type BuildL3ConfigParams = {
  address: string;
  rollupConfig: RollupConfig;
  validators: Wallet[];
  batchPoster: Wallet;
  coreContracts: CoreContracts;
  parentChainId: number;
};

export const buildL3Config = async ({
  address,
  rollupConfig,
  validators,
  batchPoster,
  coreContracts,
  parentChainId,
}: BuildL3ConfigParams): Promise<L3Config> => {
  const parentChainRpcUrl = getRpcUrl(parentChainId);

  try {
    const l3Config: L3Config = {
      'networkFeeReceiver': address,
      'infrastructureFeeCollector': address,
      'staker': validators[0].address,
      'batchPoster': batchPoster.address,
      'chainOwner': rollupConfig.owner,
      'chainId': Number(rollupConfig.chainId),
      'chainName': rollupConfig.chainName,
      'minL2BaseFee': 100000000,
      'parentChainId': parentChainId,
      'parent-chain-node-url': parentChainRpcUrl,
      'utils': coreContracts.validatorUtils,
      ...coreContracts,
    };
    return l3Config;
  } catch (e) {
    throw new Error(`Failed to build L3 Config: ${e}`);
  }
};

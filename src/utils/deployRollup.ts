import { Signer } from '@ethersproject/abstract-signer';
import { BigNumber, ethers } from 'ethers';

import { RollupConfig } from '@/types/rollupConfigDataType';

import RollupCore from '@/ethereum/RollupCore.json';
import RollupCreator from '@/ethereum/RollupCreator.json';
import { ChainType } from '@/pages/deployment/DeploymentPageContext';
import { BatchPoster, RollupContracts, Validator } from '@/types/RollupContracts';
import {
  buildAnyTrustNodeConfig,
  buildChainConfig,
  buildL3Config,
  buildRollupConfigData,
} from './configBuilders';
import { updateLocalStorage } from './localStorageHandler';

export type RollupConfigPayload = Omit<RollupConfig, 'baseStake'> & { baseStake: BigNumber };
// On Arbitrum Goerli, so need to change it for other networks
const ARB_GOERLI_CREATOR_ADDRESS = '0x04024711BaD29b6C543b41A8e95fe75cA1c6cB59';

type DeployRollupProps = {
  rollupConfig: RollupConfig;
  validators: Validator[];
  batchPoster: BatchPoster;
  signer: Signer;
  chainType?: ChainType;
};

export async function deployRollup({
  rollupConfig,
  validators,
  batchPoster,
  signer,
  chainType = ChainType.Rollup,
}: DeployRollupProps): Promise<RollupContracts> {
  try {
    const chainConfig: string = JSON.stringify(buildChainConfig(rollupConfig));

    const rollupConfigPayload: RollupConfigPayload = {
      ...rollupConfig,
      chainConfig: chainConfig,
      baseStake: ethers.utils.parseEther(rollupConfig.baseStake),
    };
    const validatorAddresses = validators.map((v) => v.address);
    const batchPosterAddress = batchPoster.address;
    console.log(chainConfig);
    console.log('Going for deployment');

    const rollupCreator = new ethers.Contract(
      ARB_GOERLI_CREATOR_ADDRESS,
      RollupCreator.abi,
      signer,
    );
    const createRollupTx = await rollupCreator.createRollup(
      rollupConfigPayload,
      batchPosterAddress,
      validatorAddresses,
    );
    const createRollupTxReceipt = await createRollupTx.wait();
    const createRollupTxReceiptEvents = createRollupTxReceipt.events ?? [];

    const rollupCreatedEvent = createRollupTxReceiptEvents.find(
      (event: { event: string }) => event.event === 'RollupCreated',
    );

    if (!rollupCreatedEvent) {
      throw new Error('RollupCreated event not found');
    }

    const rollupCore = new ethers.Contract(
      rollupCreatedEvent.args.rollupAddress,
      RollupCore.abi,
      signer,
    );

    const rollupContracts: RollupContracts = {
      rollup: rollupCreatedEvent.args.rollupAddress,
      inbox: rollupCreatedEvent.args.inboxAddress,
      outbox: await rollupCore.outbox(),
      adminProxy: rollupCreatedEvent.args.adminProxy,
      sequencerInbox: rollupCreatedEvent.args.sequencerInbox,
      bridge: rollupCreatedEvent.args.bridge,
      utils: await rollupCore.validatorUtils(),
      validatorWalletCreator: await rollupCore.validatorWalletCreator(),
      deployedAtBlockNumber: createRollupTxReceipt.blockNumber,
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
      rollupCore,
      rollupCreatedEvent,
      rollupConfig,
      createRollupTxReceipt,
      validators,
      batchPoster,
      signer,
    });

    updateLocalStorage(rollupConfigData, l3Config);

    return rollupContracts;
  } catch (e) {
    throw new Error(`Failed to deploy rollup: ${e}`);
  }
}

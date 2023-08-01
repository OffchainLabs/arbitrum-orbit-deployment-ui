import { BatchPoster, RollupContracts, Validator } from '@/types/RollupContracts';
import { L3Config } from '@/types/l3ConfigType';
import { AnyTrustConfigData, RollupConfig, RollupConfigData } from '@/types/rollupConfigDataType';
import { ethers } from 'ethers';

export const buildChainConfig = (chainConfig: { chainId: number; owner: string }) => ({
  chainId: Number(chainConfig.chainId),
  homesteadBlock: 0,
  daoForkBlock: null,
  daoForkSupport: true,
  eip150Block: 0,
  eip150Hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  eip155Block: 0,
  eip158Block: 0,
  byzantiumBlock: 0,
  constantinopleBlock: 0,
  petersburgBlock: 0,
  istanbulBlock: 0,
  muirGlacierBlock: 0,
  berlinBlock: 0,
  londonBlock: 0,
  clique: {
    period: 0,
    epoch: 0,
  },
  arbitrum: {
    EnableArbOS: true,
    AllowDebugPrecompiles: false,
    DataAvailabilityCommittee: false,
    InitialArbOSVersion: 10,
    InitialChainOwner: chainConfig.owner,
    GenesisBlockNum: 0,
  },
});

export function buildRollupConfigData({
  rollupConfig,
  rollupContracts,
  validators,
  batchPoster,
}: {
  rollupConfig: RollupConfig;
  rollupContracts: RollupContracts;
  validators: Validator[];
  batchPoster: BatchPoster;
}): RollupConfigData {
  return {
    'chain': {
      'info-json': [
        {
          'chain-id': Number(rollupConfig.chainId),
          'parent-chain-id': 421613,
          'chain-name': rollupConfig.chainName,
          'chain-config': {
            chainId: Number(rollupConfig.chainId),
            homesteadBlock: 0,
            daoForkBlock: null,
            daoForkSupport: true,
            eip150Block: 0,
            eip150Hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            eip155Block: 0,
            eip158Block: 0,
            byzantiumBlock: 0,
            constantinopleBlock: 0,
            petersburgBlock: 0,
            istanbulBlock: 0,
            muirGlacierBlock: 0,
            berlinBlock: 0,
            londonBlock: 0,
            clique: {
              period: 0,
              epoch: 0,
            },
            arbitrum: {
              EnableArbOS: true,
              AllowDebugPrecompiles: false,
              DataAvailabilityCommittee: false,
              InitialArbOSVersion: 10,
              InitialChainOwner: rollupConfig.owner,
              GenesisBlockNum: 0,
            },
          },
          'rollup': {
            'bridge': rollupContracts.bridge,
            'inbox': rollupContracts.inbox,
            'sequencer-inbox': rollupContracts.sequencerInbox,
            'rollup': rollupContracts.rollup,
            'validator-utils': rollupContracts.utils,
            'validator-wallet-creator': rollupContracts.validatorWalletCreator,
            'deployed-at': rollupContracts.deployedAtBlockNumber,
          },
        },
      ],
      'name': rollupConfig.chainName,
    },
    'parent-chain': {
      connection: {
        url: 'https://goerli-rollup.arbitrum.io/rpc',
      },
    },
    'http': {
      addr: '0.0.0.0',
      port: 8449,
      vhosts: '*',
      corsdomain: '*',
      api: ['eth', 'net', 'web3', 'arb', 'debug'],
    },
    'node': {
      'forwarding-target': '',
      'sequencer': {
        'max-tx-data-size': 85000,
        'enable': true,
        'dangerous': {
          'no-coordinator': true,
        },
        'max-block-speed': '250ms',
      },
      'delayed-sequencer': {
        enable: true,
      },
      'batch-poster': {
        'max-size': 90000,
        'enable': true,
        'parent-chain-wallet': {
          'private-key': batchPoster.privateKey || '',
        },
      },
      'staker': {
        'enable': true,
        'strategy': 'MakeNodes',
        'parent-chain-wallet': {
          'private-key': validators[0].privateKey || '',
        },
      },
      'caching': {
        archive: true,
      },
    },
  };
}

export function buildAnyTrustNodeConfig(
  rollupConfig: RollupConfigData,
  sequencerInboxAddress: string,
): AnyTrustConfigData {
  return {
    ...rollupConfig,
    node: {
      ...rollupConfig.node,
      'data-availability': {
        'enable': true,
        'sequencer-inbox-address': sequencerInboxAddress,
        'parent-chain-node-url': 'https://goerli-rollup.arbitrum.io/rpc',
        'rest-aggregator': {
          enable: true,
          urls: 'http://localhost:9876',
        },
        'rpc-aggregator': {
          'enable': true,
          'assumed-honest': 1,
          'backends':
            '[{"url":"http://localhost:9876","pubkey":"YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==","signermask":1}]',
        },
      },
    },
  };
}

export type BuildL3ConfigParams = {
  rollupCore: ethers.Contract;
  rollupCreatedEvent: ethers.Event;
  rollupConfig: RollupConfig;
  createRollupTxReceipt: ethers.providers.TransactionReceipt;
  validators: Validator[];
  batchPoster: BatchPoster;
  signer: ethers.Signer;
};

export const buildL3Config = async ({
  rollupCore,
  rollupCreatedEvent,
  rollupConfig,
  createRollupTxReceipt,
  validators,
  batchPoster,
  signer,
}: BuildL3ConfigParams): Promise<L3Config> => {
  try {
    const l3Config: L3Config = {
      networkFeeReceiver: await signer.getAddress(),
      infrastructureFeeCollector: await signer.getAddress(),
      rollup: rollupCreatedEvent.args?.rollupAddress,
      staker: validators[0].address,
      batchPoster: batchPoster.address,
      inbox: rollupCreatedEvent.args?.inboxAddress,
      outbox: await rollupCore.outbox(),
      adminProxy: rollupCreatedEvent.args?.adminProxy,
      sequencerInbox: rollupCreatedEvent.args?.sequencerInbox,
      bridge: rollupCreatedEvent.args?.bridge,
      utils: await rollupCore.validatorUtils(),
      validatorWalletCreator: await rollupCore.validatorWalletCreator(),
      deployedAtBlockNumber: createRollupTxReceipt.blockNumber,
      chainOwner: rollupConfig.owner,
      chainId: Number(rollupConfig.chainId),
      chainName: rollupConfig.chainName,
      minL2BaseFee: 100000000,
    };
    return l3Config;
  } catch (e) {
    throw new Error(`Failed to build L3 Config: ${e}`);
  }
};

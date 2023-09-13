import { parseEther } from 'viem';
import { Wallet, RollupContracts } from '@/types/RollupContracts';
import { L3Config } from '@/types/l3ConfigType';
import {
  AnyTrustConfigData,
  RollupConfig,
  RollupConfigData,
  RollupConfigPayload,
} from '@/types/rollupConfigDataType';
import { getRpcUrl } from '@/utils/getRpcUrl';
import { assertIsHexString } from './validators';

export const buildChainConfig = (chainConfig: { chainId: number; owner: `0x${string}` }) => ({
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
  parentChainId,
}: {
  rollupConfig: RollupConfig;
  rollupContracts: RollupContracts;
  validators: Wallet[];
  batchPoster: Wallet;
  parentChainId: number;
}): RollupConfigData {
  const parentChainRpcUrl = getRpcUrl(parentChainId);

  return {
    'chain': {
      'info-json': [
        {
          'chain-id': Number(rollupConfig.chainId),
          'parent-chain-id': parentChainId,
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
        url: parentChainRpcUrl,
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

export const buildRollupConfigPayload = ({
  rollupConfig,
  chainConfig,
}: {
  rollupConfig: RollupConfig;
  chainConfig: string;
}): RollupConfigPayload => {
  try {
    const rollupConfigPayload: RollupConfigPayload = {
      ...rollupConfig,
      chainConfig,
      baseStake: parseEther(String(rollupConfig.baseStake)),
    };
    return rollupConfigPayload;
  } catch (e) {
    throw new Error(`Error building rollup config payload: ${e}`);
  }
};

export function buildAnyTrustNodeConfig(
  rollupConfig: RollupConfigData,
  sequencerInboxAddress: string,
  parentChainId: number,
): AnyTrustConfigData {
  assertIsHexString(sequencerInboxAddress);

  const parentChainRpcUrl = getRpcUrl(parentChainId);

  return {
    ...rollupConfig,
    node: {
      ...rollupConfig.node,
      'data-availability': {
        'enable': true,
        'sequencer-inbox-address': sequencerInboxAddress,
        'parent-chain-node-url': parentChainRpcUrl,
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
  address: string;
  rollupConfig: RollupConfig;
  validators: Wallet[];
  batchPoster: Wallet;
  rollupContracts: RollupContracts;
  parentChainId: number;
};

export const buildL3Config = async ({
  address,
  rollupConfig,
  validators,
  batchPoster,
  rollupContracts,
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
      ...rollupContracts,
    };
    return l3Config;
  } catch (e) {
    throw new Error(`Failed to build L3 Config: ${e}`);
  }
};

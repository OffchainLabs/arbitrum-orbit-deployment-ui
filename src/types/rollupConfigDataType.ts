import { z } from 'zod';
import { AddressSchema, HexStringSchema } from '@/utils/schemas';

export const ChainConfigSchema = z.object({
  chainId: z.number(),
  homesteadBlock: z.number(),
  daoForkBlock: z.null(),
  daoForkSupport: z.boolean(),
  eip150Block: z.number(),
  eip150Hash: z.string(),
  eip155Block: z.number(),
  eip158Block: z.number(),
  byzantiumBlock: z.number(),
  constantinopleBlock: z.number(),
  petersburgBlock: z.number(),
  istanbulBlock: z.number(),
  muirGlacierBlock: z.number(),
  berlinBlock: z.number(),
  londonBlock: z.number(),
  clique: z.object({
    period: z.number(),
    epoch: z.number(),
  }),
  arbitrum: z.object({
    EnableArbOS: z.boolean(),
    AllowDebugPrecompiles: z.boolean(),
    DataAvailabilityCommittee: z.boolean(),
    InitialArbOSVersion: z.number(),
    InitialChainOwner: z.string(),
    GenesisBlockNum: z.number(),
  }),
});

export type ChainConfig = z.infer<typeof ChainConfigSchema>;

export type RollupConfigData = {
  'chain': {
    'info-json': Array<{
      'chain-id': number;
      'parent-chain-id': number;
      'chain-name': string;
      'chain-config': ChainConfig;
      'rollup': {
        'bridge': string;
        'inbox': string;
        'sequencer-inbox': string;
        'rollup': string;
        'validator-utils': string;
        'validator-wallet-creator': string;
        'deployed-at': number;
      };
    }>;
    'name': string;
  };
  'parent-chain': {
    connection: {
      url: string;
    };
  };
  'http': {
    addr: string;
    port: number;
    vhosts: string;
    corsdomain: string;
    api: string[];
  };
  'node': {
    'forwarding-target': string;
    'sequencer': {
      'max-tx-data-size': number;
      'enable': boolean;
      'dangerous': {
        'no-coordinator': boolean;
      };
      'max-block-speed': string;
    };
    'delayed-sequencer': {
      enable: boolean;
    };
    'batch-poster': {
      'max-size': number;
      'enable': boolean;
      'parent-chain-wallet': {
        'private-key': string;
      };
    };
    'staker': {
      'enable': boolean;
      'strategy': string;
      'parent-chain-wallet': {
        'private-key': string;
      };
    };
    'caching': {
      archive: boolean;
    };
  };
};

export type AnyTrustConfigData = RollupConfigData & {
  node: {
    'data-availability': {
      'enable': boolean;
      'sequencer-inbox-address': string;
      'parent-chain-node-url': string;
      'rest-aggregator': {
        enable: boolean;
        urls: string;
      };
      'rpc-aggregator': {
        'enable': boolean;
        'assumed-honest': number;
        'backends': string;
      };
    };
  };
};

const RollupConfigSchema = z.object({
  confirmPeriodBlocks: z.number(),
  stakeToken: AddressSchema,
  baseStake: z.number(),
  owner: AddressSchema,
  extraChallengeTimeBlocks: z.number(),
  wasmModuleRoot: HexStringSchema,
  loserStakeEscrow: AddressSchema,
  chainId: z.number(),
  chainName: z.string(),
  genesisBlockNum: z.number(),
  nativeToken: AddressSchema,
  sequencerInboxMaxTimeVariation: z.object({
    delayBlocks: z.number(),
    futureBlocks: z.number(),
    delaySeconds: z.number(),
    futureSeconds: z.number(),
  }),
});

export type RollupConfig = z.infer<typeof RollupConfigSchema>;

export const RollupConfigPayloadSchema = RollupConfigSchema.omit({
  nativeToken: true,
  chainName: true,
}).extend({
  confirmPeriodBlocks: z.bigint(),
  baseStake: z.bigint(),
  chainId: z.bigint(),
  chainConfig: z.string(),
  extraChallengeTimeBlocks: z.bigint(),
  genesisBlockNum: z.bigint(),
  sequencerInboxMaxTimeVariation: z.object({
    delayBlocks: z.bigint(),
    futureBlocks: z.bigint(),
    delaySeconds: z.bigint(),
    futureSeconds: z.bigint(),
  }),
});
export type AnyTrustConfig = RollupConfig & {
  sequencerInboxAddress: string;
};

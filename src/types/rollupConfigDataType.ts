import { z } from 'zod';

import { AddressSchema } from '@/utils/schemas';

export type RollupConfigData = {
  'chain': {
    'info-json': Array<{
      'chain-id': number;
      'parent-chain-id': number;
      'chain-name': string;
      'chain-config': object;
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
  wasmModuleRoot: AddressSchema,
  loserStakeEscrow: AddressSchema,
  chainId: z.number(),
  chainName: z.string(),
  genesisBlockNum: z.number(),
  nativeToken: z.string(),
  sequencerInboxMaxTimeVariation: z.object({
    delayBlocks: z.number(),
    futureBlocks: z.number(),
    delaySeconds: z.number(),
    futureSeconds: z.number(),
  }),
});

export type RollupConfig = z.infer<typeof RollupConfigSchema>;

export const RollupConfigPayloadSchema = RollupConfigSchema.omit({ baseStake: true }).extend({
  baseStake: z.bigint(),
  chainConfig: z.string(),
});

export type AnyTrustConfig = RollupConfig & {
  sequencerInboxAddress: string;
};

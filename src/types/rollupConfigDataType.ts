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

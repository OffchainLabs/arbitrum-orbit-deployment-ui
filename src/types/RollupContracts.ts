import { Address } from 'viem';

export type RollupContracts = {
  rollup: string;
  inbox: string;
  outbox: string;
  adminProxy: string;
  sequencerInbox: string;
  bridge: string;
  utils: string;
  validatorWalletCreator: string;
  deployedAtBlockNumber: number;
  nativeToken: string;
  upgradeExecutor: string;
};

export type Wallet = {
  address: string;
  privateKey?: string;
};

export type RollupCreatedEvent = {
  args: {
    rollupAddress: Address;
    inboxAddress: Address;
    adminProxy: Address;
    sequencerInbox: Address;
    bridge: Address;
    nativeToken: Address;
    upgradeExecutor: Address;
  };
};

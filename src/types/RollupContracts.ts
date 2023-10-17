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

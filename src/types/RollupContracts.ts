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
};

export type Validator = {
  address: string;
  privateKey?: string;
};

export type BatchPoster = {
  address: string;
  privateKey?: string;
};

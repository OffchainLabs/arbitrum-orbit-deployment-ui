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
};

export type Wallet = {
  address: string;
  privateKey?: string;
};

export type RollupCreatedEvent = {
  args: {
    rollupAddress: `0x${string}`;
    inboxAddress: `0x${string}`;
    adminProxy: `0x${string}`;
    sequencerInbox: `0x${string}`;
    bridge: `0x${string}`;
    nativeToken: `0x${string}`;
  };
};

export const rollupConfig = {
  confirmPeriodBlocks: 150,
  stakeToken: '0x0000000000000000000000000000000000000000',
  baseStake: 0.1,
  owner: '0xF27c2fEfe6a39aa08763e504b44133CD992dd0f3',
  extraChallengeTimeBlocks: 0,
  wasmModuleRoot: '0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21',
  loserStakeEscrow: '0x0000000000000000000000000000000000000000',
  chainId: 12286328813,
  chainName: 'My Arbitrum L3 Chain',
  chainConfig: '0x0000000000000000000000000000000000000000000000000000000000000000',
  genesisBlockNum: 0,
  sequencerInboxMaxTimeVariation: {
    delayBlocks: 5760,
    futureBlocks: 48,
    delaySeconds: 86400,
    futureSeconds: 3600,
  },
};

export const rollupContracts = {
  rollup: '0x389a3eA93AcF8D3d9cE09008Db3b19b15D3698f0',
  inbox: '0xe770844D0e343c5bcac19f16FD9559C6bA425c2F',
  outbox: '0x5B8674639103E827d124a70CD1d48d3E59F41188',
  adminProxy: '0xAaa60c3c0f3Fb37C57B2BF0E3e7533Cb6Ba79552',
  sequencerInbox: '0x3d8d87d6280cA15f54dBF18151582E67F421576A',
  bridge: '0x4816d0Bd98AF5635AEbAc468A9849C2A13Ed2ad0',
  utils: '0x6efDC46924fc38763c5366a39BE4Ee1A14f22EA6',
  validatorWalletCreator: '0x6601D1Fdc1db54b4AfA47E0876eE6575b0B3Cb60',
  deployedAtBlockNumber: 36360310,
};

export const batchPoster = {
  address: '0x3697A6Fd9682b905Cd81aB634BBc0d3bDe042059',
};

export const validators = [
  {
    privateKey: '0x3c5e657d99fcc95720df192aeca2be2c8ba743badbea6fcde2c086c16c8c2eb0',
    address: '0xF27c2fEfe6a39aa08763e504b44133CD992dd0f3',
  },
];

export type RollupConfig = {
  confirmPeriodBlocks: number;
  stakeToken: string;
  baseStake: number;
  owner: string;
  extraChallengeTimeBlocks: number;
  wasmModuleRoot: `0x${string}`;
  loserStakeEscrow: `0x${string}`;
  chainId: number;
  chainName: string;
  chainConfig: string;
  genesisBlockNum: number;
  nativeToken: string;
  sequencerInboxMaxTimeVariation: {
    delayBlocks: number;
    futureBlocks: number;
    delaySeconds: number;
    futureSeconds: number;
  };
};

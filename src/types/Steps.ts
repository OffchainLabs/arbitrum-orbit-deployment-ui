export const ChooseChainType = {
  id: 1,
  next: 2,
  previous: null,
  label: 'Chain Type',
} as const;

export const ConfigureChain = {
  id: 2,
  next: 3,
  previous: 1,
  label: 'Configure Chain',
} as const;

export const ConfigureValidators = {
  id: 3,
  next: 4,
  previous: 2,
  label: 'Validators',
} as const;

export const ConfigureBatchPoster = {
  id: 4,
  next: 5,
  previous: 3,
  label: 'Batch Poster',
} as const;

export const ReviewAndDeployRollup = {
  id: 5,
  next: 7,
  previous: 4,
  label: 'Review & Deploy',
} as const;

export const DownloadConfig = {
  id: 7,
  next: 8,
  previous: 5,
  label: 'Download',
} as const;

export const ReviewAndDeployAnyTrust = {
  ...ReviewAndDeployRollup,
  next: 6,
  label: 'Review & Deploy',
} as const;

export const ConfigureKeyset = {
  id: 6,
  next: 7,
  previous: 5,
  label: 'Keyset',
} as const;

export const DeployLocally = {
  id: 8,
  next: null,
  previous: 7,
  label: 'Deploy Locally',
} as const;

export const RollupStepMap = {
  ChooseChainType,
  ConfigureChain,
  ConfigureValidators,
  ConfigureBatchPoster,
  ReviewAndDeploy: ReviewAndDeployRollup,
  DownloadConfig,
  DeployLocally,
} as const;

export const AnyTrustStepMap = {
  ...RollupStepMap,
  ReviewAndDeploy: ReviewAndDeployAnyTrust,
  ConfigureKeyset,
} as const;

export type RollupStep = (typeof RollupStepMap)[keyof typeof RollupStepMap];
export type AnyTrustStep = (typeof AnyTrustStepMap)[keyof typeof AnyTrustStepMap];
export type Step = RollupStep | AnyTrustStep;
export type StepId = Step['id'];
export type StepMap = typeof RollupStepMap | typeof AnyTrustStepMap;

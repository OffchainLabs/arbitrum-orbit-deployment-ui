enum StepIds {
  ChooseChainType = 'chain-type',
  ConfigureChain = 'configure',
  ReviewAndDeploy = 'review',
  DownloadConfig = 'download',
  ConfigureKeyset = 'keyset',
  DeployLocally = 'deploy',
}

export const ChooseChainType = {
  id: StepIds.ChooseChainType,
  next: StepIds.ConfigureChain,
  previous: null,
  label: 'Chain Type',
} as const;

export const ConfigureChain = {
  id: StepIds.ConfigureChain,
  next: StepIds.ReviewAndDeploy,
  previous: StepIds.ChooseChainType,
  label: 'Configure Chain',
} as const;

export const ReviewAndDeployRollup = {
  id: StepIds.ReviewAndDeploy,
  next: StepIds.DownloadConfig,
  previous: StepIds.ConfigureChain,
  label: 'Review & Deploy',
} as const;

export const DownloadConfig = {
  id: StepIds.DownloadConfig,
  next: StepIds.DeployLocally,
  previous: null,
  label: 'Download',
} as const;

export const ReviewAndDeployAnyTrust = {
  ...ReviewAndDeployRollup,
  next: StepIds.ConfigureKeyset,
  label: 'Review & Deploy',
} as const;

export const ConfigureKeyset = {
  id: StepIds.ConfigureKeyset,
  next: StepIds.DownloadConfig,
  previous: null,
  label: 'Keyset',
} as const;

export const DownloadAnyTrustConfig = {
  id: StepIds.DownloadConfig,
  next: StepIds.DeployLocally,
  previous: StepIds.ConfigureKeyset,
  label: 'Download',
} as const;

export const DeployLocally = {
  id: StepIds.DeployLocally,
  next: null,
  previous: StepIds.DownloadConfig,
  label: 'Deploy Locally',
} as const;

export const RollupStepMap = {
  ChooseChainType,
  ConfigureChain,
  ReviewAndDeploy: ReviewAndDeployRollup,
  DownloadConfig,
  DeployLocally,
} as const;

export const AnyTrustStepMap = {
  ...RollupStepMap,
  ReviewAndDeploy: ReviewAndDeployAnyTrust,
  ConfigureKeyset,
  DownloadConfig: DownloadAnyTrustConfig,
} as const;

export type RollupStep = (typeof RollupStepMap)[keyof typeof RollupStepMap];
export type AnyTrustStep = (typeof AnyTrustStepMap)[keyof typeof AnyTrustStepMap];
export type Step = RollupStep | AnyTrustStep;
export type StepId = Step['id'];
export type StepMap = typeof RollupStepMap | typeof AnyTrustStepMap;

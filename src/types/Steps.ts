enum StepIds {
  ChooseChainType = 'chain-type',
  ConfigureChain = 'configure',
  DownloadConfig = 'download',
  ConfigureKeyset = 'keyset',
  DeployLocally = 'deploy-local',
}

export const ChooseChainType = {
  id: StepIds.ChooseChainType,
  next: StepIds.ConfigureChain,
  previous: null,
  label: 'Chain Type',
} as const;

export const ConfigureRollup = {
  id: StepIds.ConfigureChain,
  next: StepIds.DownloadConfig,
  previous: StepIds.ChooseChainType,
  label: 'Configure Chain',
} as const;

export const ConfigureAnyTrust = {
  id: StepIds.ConfigureChain,
  next: StepIds.ConfigureKeyset,
  previous: StepIds.ChooseChainType,
  label: 'Configure Chain',
} as const;

export const ConfigureKeyset = {
  id: StepIds.ConfigureKeyset,
  next: StepIds.DownloadConfig,
  previous: null,
  label: 'Keyset',
} as const;

export const DownloadConfig = {
  id: StepIds.DownloadConfig,
  next: StepIds.DeployLocally,
  previous: null,
  label: 'Download',
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
  ConfigureRollup,
  DownloadConfig,
  DeployLocally,
} as const;

export const AnyTrustStepMap = {
  ChooseChainType,
  ConfigureAnyTrust,
  ConfigureKeyset,
  DownloadConfig: DownloadAnyTrustConfig,
  DeployLocally,
} as const;

export type RollupStep = (typeof RollupStepMap)[keyof typeof RollupStepMap];
export type AnyTrustStep = (typeof AnyTrustStepMap)[keyof typeof AnyTrustStepMap];
export type Step = RollupStep | AnyTrustStep;
export type StepId = Step['id'];
export type StepMap = typeof RollupStepMap | typeof AnyTrustStepMap;

'use client';
import {
  ChooseChainType,
  ConfigureBatchPoster,
  ConfigureChain,
  ConfigureKeyset,
  ConfigureValidators,
  DeployLocally,
  DownloadAnyTrustConfig,
  DownloadConfig,
  ReviewAndDeployAnyTrust,
  ReviewAndDeployRollup,
} from '@/types/Steps';
import { ChainTypeForm } from '@/components/ChainTypeForm';
import { DeployLocallyComponent } from '@/components/DeployLocally';
import { Download } from '@/components/Download';
import { KeysetForm } from '@/components/KeysetForm';
import { ReviewAndDeploy } from '@/components/ReviewAndDeploy';
import { RollupConfigInput } from '@/components/RollupConfigInput';
import { SetBatchPoster } from '@/components/SetBatchPoster';
import { SetValidators } from '@/components/SetValidators';
import { useStep } from '@/hooks/useStep';

export default function StepPage() {
  const { currentStep } = useStep();

  const StepContent = () => {
    switch (currentStep) {
      case ChooseChainType:
        return <ChainTypeForm />;
      case ConfigureChain:
        return <RollupConfigInput />;
      case ConfigureValidators:
        return <SetValidators />;
      case ConfigureBatchPoster:
        return <SetBatchPoster />;
      case ReviewAndDeployRollup:
      case ReviewAndDeployAnyTrust:
        return <ReviewAndDeploy />;
      case ConfigureKeyset:
        return <KeysetForm />;
      case DownloadConfig:
      case DownloadAnyTrustConfig:
        return <Download />;
      case DeployLocally:
        return <DeployLocallyComponent />;
      default:
        return <div>Invalid step</div>;
    }
  };

  return <StepContent />;
}

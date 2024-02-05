import { useStep } from '@/hooks/useStep';
import {
  ConfigureKeyset,
  DownloadAnyTrustConfig,
  DownloadConfig,
  ReviewAndDeployAnyTrust,
  ReviewAndDeployRollup,
} from '@/types/Steps';
import { ButtonHTMLAttributes, FC, MouseEvent, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { useDeploymentPageContext } from './DeploymentPageContext';

interface NextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
}

export const NextButton: FC<NextButtonProps> = ({ className, onClick, isLoading }) => {
  const { currentStep } = useStep();
  const [{ isDownloadCompleted }] = useDeploymentPageContext();
  const isLastStep = currentStep?.next === null;

  const isDeploymentStep =
    currentStep === ReviewAndDeployRollup || currentStep === ReviewAndDeployAnyTrust;
  const isDownloadRequired = useMemo(() => {
    return (
      !isDownloadCompleted &&
      (currentStep === DownloadConfig || currentStep === DownloadAnyTrustConfig)
    );
  }, [isDownloadCompleted, currentStep]);
  const isTransactionStep = currentStep === ConfigureKeyset;

  const getLabel = () => {
    if (isDeploymentStep) {
      if (isLoading) return 'Deploying';
      return 'Deploy';
    }
    if (isTransactionStep) {
      if (isLoading) return 'Setting Keyset';
      return 'Set Keyset';
    }
    return 'Next';
  };

  const getIcon = () => {
    if (isLoading) return <i className="pi pi-spin pi-spinner mx-2"></i>;
    return;
  };
  return (
    <button
      className={twMerge(
        `w-full rounded-lg bg-[#243145] px-3 py-2 text-white`,
        (isLoading || isLastStep) && 'cursor-not-allowed bg-gray-400',
        isLastStep && 'invisible',
        'hover:bg-[#283C55]',
        isDownloadRequired && 'cursor-not-allowed bg-gray-300 text-gray-600 hover:bg-gray-300',
        className,
      )}
      onClick={onClick}
      disabled={isLoading || isLastStep || isDownloadRequired}
    >
      {getLabel()}
      {getIcon()}
    </button>
  );
};

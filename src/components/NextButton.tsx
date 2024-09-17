import { useStep } from '@/hooks/useStep';
import {
  ConfigureAnyTrust,
  ConfigureKeyset,
  ConfigureRollup,
  DownloadAnyTrustConfig,
  DownloadConfig,
} from '@/types/Steps';
import { ButtonHTMLAttributes, FC, MouseEvent, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { useDeploymentPageContext } from './DeploymentPageContext';

interface NextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
}

export const NextButton: FC<NextButtonProps> = ({ className, onClick, isLoading }) => {
  const { currentStep } = useStep();
  const [{ isDownloadCompleted }] = useDeploymentPageContext();

  const isDeploymentStep = currentStep === ConfigureAnyTrust || currentStep === ConfigureRollup;
  const isDownloadRequired =
    !isDownloadCompleted &&
    (currentStep === DownloadConfig || currentStep === DownloadAnyTrustConfig);
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
        `h-9 rounded-sm bg-white px-5 text-lg text-black`,
        isLoading && 'cursor-not-allowed',
        isDownloadRequired && 'cursor-not-allowed bg-gray-300 text-gray-600',
        className,
      )}
      onClick={onClick}
      disabled={isLoading || isDownloadRequired}
    >
      {getLabel()}
      {getIcon()}
    </button>
  );
};

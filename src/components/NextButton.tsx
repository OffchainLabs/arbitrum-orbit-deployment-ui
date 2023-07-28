import { useStep } from '@/hooks/useStep';
import { ConfigureKeyset, ReviewAndDeployAnyTrust, ReviewAndDeployRollup } from '@/types/Steps';
import { MouseEvent, FC, ButtonHTMLAttributes } from 'react';

interface NextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
  isLastStep: boolean;
}

export const NextButton: FC<NextButtonProps> = ({ className, onClick, isLoading, isLastStep }) => {
  const { currentStep } = useStep();

  const isDeploymentStep =
    currentStep === ReviewAndDeployRollup ||
    currentStep === ReviewAndDeployAnyTrust ||
    currentStep === ConfigureKeyset;

  const getLabel = () => {
    if (isDeploymentStep) {
      if (isLoading) return 'Deploying';
      return 'Deploy';
    }
    return 'Next';
  };

  const getIcon = () => {
    if (isDeploymentStep) {
      if (isLoading) return <i className="pi pi-spin pi-spinner mx-2"></i>;
      return <i className="pi pi-sign-in mx-2"></i>;
    }
    return <i className="pi pi-arrow-right mx-2"></i>;
  };
  return (
    <button
      className={`rounded-lg bg-[#243145] px-3 py-2 text-white ${
        (isLoading || isLastStep) && 'cursor-not-allowed bg-gray-400'
      } ${className}`}
      onClick={onClick}
      disabled={isLoading || isLastStep}
    >
      {getLabel()}
      {getIcon()}
    </button>
  );
};

import { useStep } from '@/hooks/useStep';
import { ConfigureKeyset, ReviewAndDeployAnyTrust, ReviewAndDeployRollup } from '@/types/Steps';
import { MouseEvent, FC, ButtonHTMLAttributes } from 'react';

interface NextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
}

export const NextButton: FC<NextButtonProps> = ({ className, onClick, isLoading }) => {
  const { currentStep } = useStep();
  const isLastStep = currentStep?.next === null;

  const isDeploymentStep =
    currentStep === ReviewAndDeployRollup || currentStep === ReviewAndDeployAnyTrust;

  const isTransactionStep = currentStep === ConfigureKeyset;

  const getLabel = () => {
    if (isDeploymentStep) {
      if (isLoading) return 'Deploying';
      return 'Deploy';
    }
    if (isTransactionStep) {
      if (isLoading) return 'Set Keyset';
      return 'Setting Keyset';
    }
    return 'Next';
  };

  const getIcon = () => {
    if (isLoading) return <i className="pi pi-spin pi-spinner mx-2"></i>;
    return;
  };
  return (
    <button
      className={`w-full rounded-lg bg-[#243145] px-3 py-2 text-white ${
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

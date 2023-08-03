import { useStep } from '@/hooks/useStep';
import { ButtonHTMLAttributes, FC } from 'react';

interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
}

export const BackButton: FC<BackButtonProps> = ({ isLoading }) => {
  const { currentStep, previousStep } = useStep();
  const isFirstStep = currentStep?.previous === null;
  const isDisabled = isFirstStep || isLoading;
  return (
    <button
      className={`w-full rounded-lg border bg-white px-3 py-2 text-[#243145] hover:border-[#243145]
            ${isDisabled && 'cursor-not-allowed bg-gray-100 text-gray-300 hover:border-gray-300'}
            ${isFirstStep && 'hidden'}
            `}
      onClick={previousStep}
      disabled={isDisabled}
    >
      Back
    </button>
  );
};

import { useStep } from '@/hooks/useStep';
import { ButtonHTMLAttributes, FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const BackButton: FC<BackButtonProps> = ({ isLoading }) => {
  const { currentStep, previousStep } = useStep();
  const isFirstStep = currentStep?.previous === null;
  const isDisabled = isFirstStep || isLoading;
  return (
    <button
      className={twMerge(
        'h-9 rounded-sm border border-[#5F6061] bg-[#1A1C1D] px-5 text-lg text-white',
        isDisabled && 'cursor-not-allowed bg-gray-100 text-gray-300 hover:border-gray-300',
        isFirstStep && 'hidden',
      )}
      onClick={previousStep}
      disabled={isDisabled}
    >
      Back
    </button>
  );
};

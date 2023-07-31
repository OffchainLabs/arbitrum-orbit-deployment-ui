import { useStep } from '@/hooks/useStep';

export const BackButton = () => {
  const { currentStep, previousStep } = useStep();
  const isFirstStep = currentStep?.previous === null;
  return (
    <button
      className={` rounded-lg border px-3 py-2 text-[#243145] hover:border-[#243145]
            ${isFirstStep && 'cursor-not-allowed bg-gray-100 text-gray-300 hover:border-gray-300'}
            `}
      onClick={previousStep}
      disabled={isFirstStep}
    >
      <i className="pi pi-arrow-left mx-2"></i>
      Back
    </button>
  );
};

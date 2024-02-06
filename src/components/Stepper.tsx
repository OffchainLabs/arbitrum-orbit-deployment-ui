import { useIsMounted } from '@/hooks/useIsMounted';
import { useStep } from '@/hooks/useStep';
import { twMerge } from 'tailwind-merge';
import { useAccount } from 'wagmi';

export const Stepper = () => {
  const { currentStep, chainStepMap, createSortedStepMapArray } = useStep();
  const { isConnected } = useAccount();

  const steps = createSortedStepMapArray(chainStepMap);

  const Step = (step: any, index: number) => {
    const isActiveStep = step.id === currentStep?.id && isConnected;

    return (
      <div className="flex w-full flex-col items-center" key={step.id}>
        <div className={twMerge('flex w-full items-center')}>
          <div className="h-px w-full bg-[#A5A5A5]"></div>
          <div
            className={twMerge(
              'mx-[-1px] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#A5A5A5] bg-[#191919] p-1.5 ',
              !isActiveStep && 'h-6 w-6 md:h-8 md:w-8',
              isActiveStep && 'bg-black',
            )}
          >
            <span
              className={twMerge(
                'hidden text-sm text-[#A5A5A5] md:inline',
                isActiveStep && 'text-md inline font-bold text-white',
              )}
            >
              {index + 1}
            </span>
          </div>
          <div className="h-px w-full bg-[#A5A5A5]"></div>
        </div>
        <span
          className={twMerge(
            'invisible h-10 text-center text-xs text-[#A5A5A5] md:visible md:block md:text-sm',
            isActiveStep && 'visible text-white',
          )}
        >
          {step.label}
        </span>
      </div>
    );
  };

  return <div className="flex items-center">{steps.map(Step)}</div>;
};

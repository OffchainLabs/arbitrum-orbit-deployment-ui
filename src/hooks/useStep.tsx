import { useRouter } from 'next/router';
import { NumberParam, useQueryParams, withDefault } from 'use-query-params';

export const StepMap = {
  RollupDeploymentConfiguration: {
    id: 1,
    next: 2,
    previous: null,
  },
  ValidatorConfiguration: {
    id: 2,
    next: 3,
    previous: 1,
  },
  BatchPosterConfiguration: { id: 3, next: 4, previous: 2 },
  Deploy: { id: 4, next: 5, previous: 3 },
  Download: { id: 5, next: null, previous: 4 },
} as const;

type Step = (typeof StepMap)[keyof typeof StepMap];
type StepId = Step['id'];

const FIRST_STEP_ID = 1;

export const useStep = () => {
  const router = useRouter();

  const pushToStepId = (id?: StepId | null) => {
    if (!id) {
      router.push(`/deployment?step=${FIRST_STEP_ID}`);
    } else {
      router.push(`/deployment?step=${id}`);
    }
  };

  const [{ step: currentStepId }] = useQueryParams({
    step: withDefault(NumberParam, StepMap.RollupDeploymentConfiguration.id),
  });

  const findStepById = (id: number): Step | undefined => {
    const keys = Object.keys(StepMap) as Array<keyof typeof StepMap>;
    const key = keys.find((key) => StepMap[key].id === id);
    return key ? StepMap[key] : undefined;
  };

  const currentStep = findStepById(currentStepId);

  const isValidStep = currentStep !== undefined;

  return {
    nextStep: () => pushToStepId(currentStep?.next),
    previousStep: () => pushToStepId(currentStep?.previous),
    goToStep: (step: Step) => pushToStepId(step.id),
    currentStep,
    isValidStep,
  };
};

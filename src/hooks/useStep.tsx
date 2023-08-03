import { ChainType, useDeploymentPageContext } from '@/pages/deployment/DeploymentPageContext';
import { ChooseChainType, RollupStepMap, AnyTrustStepMap, Step, StepId } from '@/types/Steps';
import { useRouter } from 'next/router';
import { NumberParam, useQueryParams, withDefault } from 'use-query-params';

const FIRST_STEP = ChooseChainType;

export const useStep = () => {
  const router = useRouter();
  const [{ chainType }] = useDeploymentPageContext();

  const pushToStepId = (id?: StepId | null) => {
    if (!id) {
      router.push(`/deployment?step=${FIRST_STEP.id}`);
    } else {
      router.push(`/deployment?step=${id}`);
    }
  };

  const [{ step: currentStepId }] = useQueryParams({
    step: withDefault(NumberParam, FIRST_STEP.id),
  });

  const chainStepMap: Record<string, Step> =
    chainType === ChainType.Rollup ? RollupStepMap : AnyTrustStepMap;

  const findStepById = (id: number): Step | undefined => {
    const keys = Object.keys(chainStepMap);
    const key = keys.find((key) => chainStepMap[key].id === id);
    return key ? chainStepMap[key] : undefined;
  };

  const createSortedStepMapArray = (stepMap: Record<string, Step>): Step[] => {
    const steps: Step[] = Object.values(stepMap);
    const sortedSteps: Step[] = [];
    let currentStep = steps.find((step) => step.previous === null);

    while (currentStep) {
      sortedSteps.push(currentStep);
      currentStep = steps.find((step) => step.id === currentStep?.next);
    }

    return sortedSteps;
  };

  const currentStep = findStepById(currentStepId);

  const isValidStep = currentStep !== undefined;

  return {
    nextStep: () => pushToStepId(currentStep?.next),
    previousStep: () => pushToStepId(currentStep?.previous),
    goToStep: (step: Step) => pushToStepId(step.id),
    currentStep,
    isValidStep,
    chainStepMap,
    createSortedStepMapArray,
  };
};

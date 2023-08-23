import { useDeploymentPageContext } from '@/components/DeploymentPageContext';
import { ChainType } from '@/types/ChainType';
import {
  ChooseChainType,
  RollupStepMap,
  AnyTrustStepMap,
  Step,
  StepId,
  ConfigureBatchPoster,
  ConfigureChain,
  ConfigureKeyset,
  ConfigureValidators,
  ReviewAndDeployAnyTrust,
  ReviewAndDeployRollup,
} from '@/types/Steps';
import { usePathname, useRouter } from 'next/navigation';

const FIRST_STEP = ChooseChainType;

function getLastPartOfPath(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1];
}

export const useStep = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [
    { chainType },
    ,
    {
      pickChainFormRef,
      rollupConfigFormRef,
      validatorFormRef,
      batchPosterFormRef,
      reviewAndDeployFormRef,
      keysetFormRef,
    },
  ] = useDeploymentPageContext();

  const submitForm = () => {
    switch (currentStep) {
      case ChooseChainType:
        if (pickChainFormRef?.current) {
          pickChainFormRef.current.requestSubmit();
        }
        break;
      case ConfigureValidators:
        if (validatorFormRef?.current) {
          validatorFormRef.current.requestSubmit();
        }
        break;
      case ConfigureChain:
        if (rollupConfigFormRef?.current) {
          rollupConfigFormRef.current.requestSubmit();
        }
        break;
      case ConfigureBatchPoster:
        if (batchPosterFormRef?.current) {
          batchPosterFormRef.current.requestSubmit();
        }
        break;
      case ReviewAndDeployRollup:
      case ReviewAndDeployAnyTrust:
        if (reviewAndDeployFormRef?.current) {
          reviewAndDeployFormRef.current.requestSubmit();
        }
        break;
      case ConfigureKeyset:
        if (keysetFormRef?.current) {
          keysetFormRef.current.requestSubmit();
        }
        break;
      default:
        nextStep();
    }
  };

  const pushToStepId = (id?: StepId | null) => {
    if (!id) {
      router.push(`/deployment/step/${FIRST_STEP.id}`);
    } else {
      router.push(`/deployment/step/${id}`);
    }
  };

  const currentStepId = pathname ? parseInt(getLastPartOfPath(pathname)) : FIRST_STEP.id;

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

  const nextStep = () => pushToStepId(currentStep?.next);

  return {
    nextStep,
    submitForm,
    previousStep: () => pushToStepId(currentStep?.previous),
    goToStep: (step: Step) => pushToStepId(step.id),
    currentStep,
    isValidStep,
    chainStepMap,
    createSortedStepMapArray,
    ChooseChainType,
    ConfigureChain,
    ConfigureValidators,
    ConfigureBatchPoster,
    ReviewAndDeployRollup,
    ReviewAndDeployAnyTrust,
    ConfigureKeyset,
    pickChainFormRef,
    rollupConfigFormRef,
    validatorFormRef,
    batchPosterFormRef,
    reviewAndDeployFormRef,
    keysetFormRef,
  };
};

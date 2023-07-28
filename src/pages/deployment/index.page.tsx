import React, { useRef, useState } from 'react';
import { Steps } from 'primereact/steps';
import { useAccount } from 'wagmi';

import { RollupConfigInput } from '@/components/RollupConfigInput';
import { SetValidators } from '@/components/SetValidators';
import { SetBatchPoster } from '@/components/SetBatchPoster';
import { ReviewAndDeploy } from '@/components/ReviewAndDeploy';
import { ResetButton } from '@/components/ResetButton';

import { spaceGrotesk } from '@/fonts';

import {
  ChainType,
  DeploymentPageContextProvider,
  useDeploymentPageContext,
} from './DeploymentPageContext';
import { DeploymentSummary } from './DeploymentSummary';
import { Download } from '@/components/Download';
import { useStep } from '@/hooks/useStep';
import { ChainTypeForm } from '@/components/ChainTypeForm';
import { KeysetForm } from '@/components/KeysetForm';
import {
  ChooseChainType,
  ConfigureValidators,
  ConfigureChain,
  ConfigureBatchPoster,
  ReviewAndDeployRollup,
  ConfigureKeyset,
  ReviewAndDeployAnyTrust,
  DownloadConfig,
  DeployLocally,
} from '@/types/Steps';
import { DeployLocallyComponent } from '@/components/DeployLocally';
import { OpenDocsLink } from '@/components/OpenDocsLink';
import { NextButton } from '@/components/NextButton';

const stepsStyleProps = {
  pt: {
    root: {
      style: spaceGrotesk.style,
      className: 'text-sm',
    },
  },
};

// This hook prevents next.js from throwing an error on SSR
// due to wagmi not being available on the server
export const useIsMounted = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
};

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-left text-3xl">{children}</h3>;
}

function DeploymentPage() {
  const { currentStep, previousStep, nextStep, chainStepMap, createSortedStepMapArray } = useStep();

  const pickChainFormRef = useRef<HTMLFormElement>(null);
  const rollupConfigFormRef = useRef<HTMLFormElement>(null);
  const validatorFormRef = useRef<HTMLFormElement>(null);
  const batchPosterFormRef = useRef<HTMLFormElement>(null);
  const reviewAndDeployFormRef = useRef<HTMLFormElement>(null);
  const keysetFormRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isFirstStep = currentStep?.previous === null;
  const isLastStep = currentStep?.next === null;
  const steps = createSortedStepMapArray(chainStepMap);
  const stepLabels = steps.map((step) => ({ label: step.label }));

  const shouldDisplayDeploymentSummary =
    currentStep === DownloadConfig ||
    currentStep === ConfigureKeyset ||
    currentStep === DeployLocally;

  if (!currentStep) {
    return null;
  }

  const handleNext = () => {
    switch (currentStep) {
      case ChooseChainType:
        if (pickChainFormRef.current) {
          pickChainFormRef.current.requestSubmit();
        }
        break;
      case ConfigureValidators:
        if (validatorFormRef.current) {
          validatorFormRef.current.requestSubmit();
        }
        break;
      case ConfigureChain:
        if (rollupConfigFormRef.current) {
          rollupConfigFormRef.current.requestSubmit();
        }
        break;
      case ConfigureBatchPoster:
        if (batchPosterFormRef.current) {
          batchPosterFormRef.current.requestSubmit();
        }
        break;
      case ReviewAndDeployRollup:
      case ReviewAndDeployAnyTrust:
        if (reviewAndDeployFormRef.current) {
          reviewAndDeployFormRef.current.requestSubmit();
        }
        break;
      case ConfigureKeyset:
        if (keysetFormRef.current) {
          keysetFormRef.current.requestSubmit();
        }
        break;
      default:
        nextStep();
    }
  };

  return (
    <main className="flex w-full justify-center">
      <div className="flex w-[1024px] flex-col items-center">
        <span className="w-full rounded-lg bg-[#FFEED3] px-3 py-2 text-left text-sm text-[#60461F]">
          All parameters shown are defaults (including some randomly generated addresses), which we
          recommend using for testing purposes.
          <br />
          More information around parameter customization and guidance can be found in the{' '}
          <a
            href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            documentation
          </a>
          .
          <br />
          <br />
          Please ensure you have at least 1.5 Goerli ETH before getting started.
        </span>
        <div className="flex w-full items-baseline justify-end">
          <ResetButton className="" />
        </div>
        <div className="h-8" />
        <Steps
          model={stepLabels}
          activeIndex={steps.findIndex((step) => step === currentStep)}
          className="w-full"
          {...stepsStyleProps}
        />
        <div className="my-5 flex w-full justify-between gap-5">
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
          <NextButton onClick={handleNext} isLoading={isLoading} isLastStep={isLastStep} />
        </div>

        <div className="grid w-full grid-cols-2 gap-4 pb-8">
          <div>
            {currentStep === ChooseChainType && (
              <>
                <StepTitle>Choose Chain Type</StepTitle>
                <div className="h-4" />
                <ChainTypeForm ref={pickChainFormRef} />
              </>
            )}

            {currentStep === ConfigureChain && (
              <>
                <StepTitle>Configure Rollup</StepTitle>
                <div className="h-4" />
                <RollupConfigInput ref={rollupConfigFormRef} />
              </>
            )}

            {currentStep === ConfigureValidators && (
              <>
                <StepTitle>Configure Validators</StepTitle>
                <div className="h-4" />
                <SetValidators ref={validatorFormRef} />
              </>
            )}

            {currentStep === ConfigureBatchPoster && (
              <>
                <StepTitle>Configure Batch Poster</StepTitle>
                <div className="h-4" />
                <SetBatchPoster ref={batchPosterFormRef} />
              </>
            )}

            {(currentStep === ReviewAndDeployRollup || currentStep === ReviewAndDeployAnyTrust) && (
              <>
                <StepTitle>Review & Deploy Config</StepTitle>
                <div className="h-4" />
                <ReviewAndDeploy
                  ref={reviewAndDeployFormRef}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </>
            )}
            {currentStep === ConfigureKeyset && (
              <>
                <StepTitle>Configure Keyset</StepTitle>
                <div className="h-4" />
                <KeysetForm ref={keysetFormRef} isLoading={isLoading} setIsLoading={setIsLoading} />
              </>
            )}
            {currentStep === DownloadConfig && (
              <>
                <StepTitle>Download Config</StepTitle>
                <div className="h-4" />
                <Download />
              </>
            )}
            {currentStep === DeployLocally && (
              <>
                <StepTitle>Configure Keyset</StepTitle>
                <div className="h-4" />
                <DeployLocallyComponent />
              </>
            )}
          </div>
          <div>
            <StepTitle>Deployment Summary</StepTitle>
            <div className="h-4" />

            {shouldDisplayDeploymentSummary ? (
              <DeploymentSummary />
            ) : (
              <div>Deployment summary will appear after the rollup is deployed.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export function getServerSideProps() {
  return {
    props: {
      //
    },
  };
}

export default function DeploymentPageWithContext() {
  const { address } = useAccount();
  const { isConnected } = useAccount();
  const isMounted = useIsMounted();

  if ((isMounted && !isConnected) || !address) {
    return (
      <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl font-medium">Please connect your wallet to continue.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DeploymentPageContextProvider>
      <DeploymentPage />
    </DeploymentPageContextProvider>
  );
}

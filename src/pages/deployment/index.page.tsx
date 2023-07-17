import React, { useRef, useState } from 'react';
import { Steps } from 'primereact/steps';
import { NumberParam, useQueryParams, withDefault } from 'use-query-params';
import { useAccount } from 'wagmi';

import { RollupConfigInput } from '@/components/RollupConfigInput';
import { SetValidators } from '@/components/SetValidators';
import { SetBatchPoster } from '@/components/SetBatchPoster';
import { ReviewAndDeploy } from '@/components/ReviewAndDeploy';
import { ResetButton } from '@/components/ResetButton';

import { spaceGrotesk } from '@/fonts';

import { DeploymentPageContextProvider, useDeploymentPageContext } from './DeploymentPageContext';
import { DeploymentSummary } from './DeploymentSummary';
import { Download } from '@/components/Download';

const steps = [
  {
    label: 'Configure Rollup',
  },
  {
    label: 'Configure Validators',
  },
  {
    label: 'Configure Batch Poster',
  },
  {
    label: 'Review & Deploy',
  },
  {
    label: 'Download Config',
  },
];

const stepsStyleProps = {
  pt: {
    root: {
      style: spaceGrotesk.style,
      className: 'text-sm',
    },
  },
};

enum Step {
  RollupDeploymentConfiguration = 1,
  ValidatorConfiguration = 2,
  BatchPosterConfiguration = 3,
  Deploy = 4,
  Download = 5,
}

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
  const { isConnected } = useAccount();
  const isMounted = useIsMounted();
  const [{ step }] = useQueryParams({
    step: withDefault(NumberParam, Step.RollupDeploymentConfiguration),
  });

  const [, dispatch] = useDeploymentPageContext();
  const rollupConfigFormRef = useRef<HTMLFormElement>(null);
  const validatorFormRef = useRef<HTMLFormElement>(null);
  const batchPosterFormRef = useRef<HTMLFormElement>(null);
  const reviewAndDeployFormRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isFirstStep = step === Step.RollupDeploymentConfiguration;
  const isLastStep = step === Step.Download;

  const handlePrevious = () => {
    dispatch({ type: 'previous_step' });
  };

  const handleNext = () => {
    switch (step) {
      case Step.ValidatorConfiguration:
        if (validatorFormRef.current) {
          validatorFormRef.current.requestSubmit();
        }
        break;
      case Step.RollupDeploymentConfiguration:
        if (rollupConfigFormRef.current) {
          rollupConfigFormRef.current.requestSubmit();
        }
        break;
      case Step.BatchPosterConfiguration:
        if (batchPosterFormRef.current) {
          batchPosterFormRef.current.requestSubmit();
        }
        break;
      case Step.Deploy:
        if (reviewAndDeployFormRef.current) {
          reviewAndDeployFormRef.current.requestSubmit();
        }
        break;
      default:
        dispatch({ type: 'next_step' });
    }
  };

  if (isMounted && !isConnected) {
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
        <div className="h-8" />
        <Steps model={steps} activeIndex={step - 1} className="w-full" {...stepsStyleProps} />
        <div className="my-5 flex w-full justify-between gap-5">
          <button
            className={` rounded-lg border px-3 py-2 text-[#243145] hover:border-[#243145]
            ${isFirstStep && 'cursor-not-allowed bg-gray-100 text-gray-300 hover:border-gray-300'}
            `}
            onClick={handlePrevious}
            disabled={isFirstStep}
          >
            <i className="pi pi-arrow-left mx-2"></i>
            Back
          </button>
          <ResetButton />
          <button
            className={`rounded-lg bg-[#243145] px-3 py-2 text-white ${
              (isLoading || isLastStep) && 'cursor-not-allowed bg-gray-400'
            }`}
            onClick={handleNext}
            disabled={isLoading || isLastStep}
          >
            Next
            <i className="pi pi-arrow-right mx-2"></i>
          </button>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 pb-8">
          <div>
            {step === Step.RollupDeploymentConfiguration && (
              <>
                <StepTitle>Configure Rollup</StepTitle>
                <div className="h-4" />
                <RollupConfigInput ref={rollupConfigFormRef} />
              </>
            )}

            {step === Step.ValidatorConfiguration && (
              <>
                <StepTitle>Configure Validators</StepTitle>
                <div className="h-4" />
                <SetValidators ref={validatorFormRef} />
              </>
            )}

            {step === Step.BatchPosterConfiguration && (
              <>
                <StepTitle>Configure Batch Poster</StepTitle>
                <div className="h-4" />
                <SetBatchPoster ref={batchPosterFormRef} />
              </>
            )}

            {step === Step.Deploy && (
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
            {step === Step.Download && (
              <>
                <StepTitle>Configure Batch Poster</StepTitle>
                <div className="h-4" />
                <Download />
              </>
            )}
          </div>
          <div>
            <StepTitle>Deployment Summary</StepTitle>
            <div className="h-4" />

            {step < Step.Download ? (
              <div>Deployment summary will appear after the rollup is deployed.</div>
            ) : (
              <DeploymentSummary />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DeploymentPageWithContext() {
  return (
    <DeploymentPageContextProvider>
      <DeploymentPage />
    </DeploymentPageContextProvider>
  );
}

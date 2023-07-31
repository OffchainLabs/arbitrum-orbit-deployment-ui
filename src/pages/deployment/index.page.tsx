import { Steps } from 'primereact/steps';
import React, { useRef, useState } from 'react';
import { useAccount } from 'wagmi';

import { ResetButton } from '@/components/ResetButton';
import { ReviewAndDeploy } from '@/components/ReviewAndDeploy';
import { RollupConfigInput } from '@/components/RollupConfigInput';
import { SetBatchPoster } from '@/components/SetBatchPoster';
import { SetValidators } from '@/components/SetValidators';

import { spaceGrotesk } from '@/fonts';

import { ChainTypeForm } from '@/components/ChainTypeForm';
import { DeployLocallyComponent } from '@/components/DeployLocally';
import { Download } from '@/components/Download';
import { KeysetForm } from '@/components/KeysetForm';
import { NextButton } from '@/components/NextButton';
import { useStep } from '@/hooks/useStep';
import {
  ChooseChainType,
  ConfigureBatchPoster,
  ConfigureChain,
  ConfigureKeyset,
  ConfigureValidators,
  DeployLocally,
  DownloadAnyTrustConfig,
  DownloadConfig,
  ReviewAndDeployAnyTrust,
  ReviewAndDeployRollup,
} from '@/types/Steps';
import { DeploymentPageContextProvider } from './DeploymentPageContext';
import { BackButton } from '@/components/BackButton';
import { ExternalLink } from '@/components/ExternalLink';

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

function DeploymentPage() {
  const { currentStep, nextStep, chainStepMap, createSortedStepMapArray } = useStep();

  const pickChainFormRef = useRef<HTMLFormElement>(null);
  const rollupConfigFormRef = useRef<HTMLFormElement>(null);
  const validatorFormRef = useRef<HTMLFormElement>(null);
  const batchPosterFormRef = useRef<HTMLFormElement>(null);
  const reviewAndDeployFormRef = useRef<HTMLFormElement>(null);
  const keysetFormRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const steps = createSortedStepMapArray(chainStepMap);
  const stepLabels = steps.map((step) => ({ label: step.label }));

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

  const StepContent = () => {
    switch (currentStep) {
      case ChooseChainType:
        return <ChainTypeForm ref={pickChainFormRef} />;
      case ConfigureChain:
        return <RollupConfigInput ref={rollupConfigFormRef} />;
      case ConfigureValidators:
        return <SetValidators ref={validatorFormRef} />;
      case ConfigureBatchPoster:
        return <SetBatchPoster ref={batchPosterFormRef} />;
      case ReviewAndDeployRollup:
      case ReviewAndDeployAnyTrust:
        return (
          <ReviewAndDeploy
            ref={reviewAndDeployFormRef}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case ConfigureKeyset:
        return <KeysetForm ref={keysetFormRef} isLoading={isLoading} setIsLoading={setIsLoading} />;
      case DownloadConfig:
      case DownloadAnyTrustConfig:
        return <Download />;
      case DeployLocally:
        return <DeployLocallyComponent />;
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <main className="flex w-full justify-center">
      <div className="flex w-[1024px] flex-col ">
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
        <div className="my-2 flex w-full items-baseline justify-between">
          <ExternalLink
            href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart`}
            className="text-lg  text-[#1366C1] underline"
          >
            Open Supporting Documentation For This Flow
            <i className="pi pi-external-link mx-2"></i>
          </ExternalLink>{' '}
          <ResetButton className="" />
        </div>
        <div className=" flex w-full justify-between gap-5">
          <Steps
            model={stepLabels}
            activeIndex={steps.findIndex((step) => step === currentStep)}
            className="mb-3 w-full"
            {...stepsStyleProps}
          />
        </div>
        <div className="mb-3 flex w-full justify-between ">
          <BackButton />
          <NextButton onClick={handleNext} isLoading={isLoading} />
        </div>
        <StepContent />
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

  if (!isMounted || !isConnected || !address) {
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

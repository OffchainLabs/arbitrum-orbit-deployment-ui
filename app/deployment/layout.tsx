'use client';
import { useState, useEffect } from 'react';
import { Steps } from 'primereact/steps';
import { useAccount, useNetwork } from 'wagmi';
import { BackButton } from '@/components/BackButton';
import {
  useDeploymentPageContext,
  DeploymentPageContextProvider,
} from '@/components/DeploymentPageContext';
import { ExternalLink } from '@/components/ExternalLink';
import { NextButton } from '@/components/NextButton';
import { ResetButton } from '@/components/ResetButton';
import { useStep } from '@/hooks/useStep';
import { spaceGrotesk } from '@/fonts';
import { ChainId } from '@/types/ChainId';
import { WrongChainAlert } from '@/components/WrongChainAlert';
import { useMediaQuery } from 'react-responsive';
import { PopupModal } from '@/components/PopupModal';

const stepsStyleProps = {
  pt: {
    root: {
      style: spaceGrotesk.style,
      className: 'text-sm',
    },
  },
};

function DeploymentLayout({ children }: any) {
  const { currentStep, submitForm, chainStepMap, createSortedStepMapArray } = useStep();
  const [{ isLoading }] = useDeploymentPageContext();

  const steps = createSortedStepMapArray(chainStepMap);
  const stepLabels = steps.map((step) => ({ label: step.label }));

  if (!currentStep) {
    return null;
  }

  const handleNext = () => {
    submitForm();
  };

  return (
    <div className="flex w-[1024px] flex-col gap-2">
      <p className="text-left text-sm">
        All parameters shown are defaults (including some randomly generated addresses), which we
        recommend using for testing purposes. More information around parameter customization and
        guidance can be found in the{' '}
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
      </p>
      <p className="text-left text-sm">
        Please ensure you have at least 1.5 testnet ETH before getting started.
      </p>
      <div className="flex w-full items-baseline justify-between">
        <ExternalLink
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart`}
          className="text-sm text-[#1366C1]"
        >
          Open Supporting Documentation For This Flow
        </ExternalLink>
      </div>
      <div className="mb-1 mt-4">
        <Steps
          model={stepLabels}
          activeIndex={steps.findIndex((step) => step === currentStep)}
          className="mb-4 w-full "
          {...stepsStyleProps}
        />
      </div>

      <div className="pb-32">{children}</div>
      <div className="fixed bottom-0 left-0 z-50 flex w-full flex-col items-center justify-between bg-transparent">
        <div className="flex w-[1024px] flex-col justify-between">
          <div className="flex w-full gap-32">
            <BackButton isLoading={isLoading} />
            <NextButton onClick={handleNext} isLoading={isLoading} />
          </div>
          <ResetButton />
        </div>
      </div>
    </div>
  );
}

// This hook prevents next.js from throwing an error on SSR
// due to wagmi not being available on the server
const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

export default function DeploymentPageWithContext({ children }: { children: any }) {
  const { address } = useAccount();
  const { isConnected } = useAccount();
  const isMounted = useIsMounted();
  const { chain } = useNetwork();

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  const isWrongChain =
    chain?.id !== ChainId.ArbitrumGoerli && chain?.id !== ChainId.ArbitrumSepolia;

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

  if (isWrongChain) return <WrongChainAlert />;

  return (
    <DeploymentPageContextProvider>
      {isTabletOrMobile ? <PopupModal /> : <DeploymentLayout children={children} />}
    </DeploymentPageContextProvider>
  );
}

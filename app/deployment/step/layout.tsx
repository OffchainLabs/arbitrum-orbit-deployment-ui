'use client';
import { BackButton } from '@/components/BackButton';
import { useDeploymentPageContext } from '@/components/DeploymentPageContext';
import { ExternalLink } from '@/components/ExternalLink';
import { NextButton } from '@/components/NextButton';
import { ResetButton } from '@/components/ResetButton';
import { Stepper } from '@/components/Stepper';
import { WrongChainAlert } from '@/components/WrongChainAlert';
import { useStep } from '@/hooks/useStep';
import { ChainId } from '@/types/ChainId';
import { DownloadAnyTrustConfig, DownloadConfig, RaasProviders } from '@/types/Steps';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { PropsWithChildren } from 'react';
import { useAccount, useNetwork } from 'wagmi';

export default function StepLayout({ children }: PropsWithChildren) {
  const { submitForm, currentStep, isLastStep } = useStep();
  const [{ isLoading, isDownloadCompleted }] = useDeploymentPageContext();
  const isDownloadRequired =
    !isDownloadCompleted &&
    (currentStep === DownloadConfig || currentStep === DownloadAnyTrustConfig);
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();

  const isWrongChain = chain?.id !== ChainId.ArbitrumSepolia;

  const shouldShowStepper = currentStep !== RaasProviders;

  return (
    <>
      <div className="mt-4 w-full">{shouldShowStepper && <Stepper />}</div>
      {(!isConnected || !address) && (
        <div className="border-px flex w-full items-center justify-center border border-[#5D5D5D]">
          <div className="my-10 flex flex-col items-center gap-4">
            <p className="text-lg font-light">Please connect your wallet to continue.</p>
            <ConnectButton />
          </div>
        </div>
      )}
      {isConnected && isWrongChain && <WrongChainAlert />}
      {isConnected && !isWrongChain && (
        <>
          <ExternalLink
            href="https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction"
            className="text-xs underline"
          >
            Open supporting documentation for this flow
          </ExternalLink>
          {children}
          {isDownloadRequired && (
            <p className="text-right">Please download zip file before continuing</p>
          )}
          <div className="flex w-full items-center justify-between bg-transparent">
            <ResetButton />
            <div className="flex gap-5">
              <BackButton isLoading={isLoading} />
              <div className={isLastStep ? 'hidden' : 'block'}>
                <NextButton onClick={submitForm} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

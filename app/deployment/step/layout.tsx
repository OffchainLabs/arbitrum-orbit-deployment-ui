'use client';
import { BackButton } from '@/components/BackButton';
import { useDeploymentPageContext } from '@/components/DeploymentPageContext';
import { ExternalLink } from '@/components/ExternalLink';
import { NextButton } from '@/components/NextButton';
import { ResetButton } from '@/components/ResetButton';
import { useStep } from '@/hooks/useStep';
import { DownloadAnyTrustConfig, DownloadConfig } from '@/types/Steps';
import { PropsWithChildren } from 'react';

export default function StepLayout({ children }: PropsWithChildren) {
  const { submitForm, currentStep, isLastStep } = useStep();
  const [{ isLoading, isDownloadCompleted }] = useDeploymentPageContext();
  const isDownloadRequired =
    !isDownloadCompleted &&
    (currentStep === DownloadConfig || currentStep === DownloadAnyTrustConfig);

  return (
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
  );
}

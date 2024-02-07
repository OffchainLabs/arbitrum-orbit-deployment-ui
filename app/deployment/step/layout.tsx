'use client';
import { BackButton } from '@/components/BackButton';
import { useDeploymentPageContext } from '@/components/DeploymentPageContext';
import { ExternalLink } from '@/components/ExternalLink';
import { NextButton } from '@/components/NextButton';
import { ResetButton } from '@/components/ResetButton';
import { useStep } from '@/hooks/useStep';
import { DownloadAnyTrustConfig, DownloadConfig, RaasProviders } from '@/types/Steps';

export default function StepLayout({ children }: { children: any }) {
  const { submitForm, currentStep, isLastStep } = useStep();
  const [{ isLoading, isDownloadCompleted }] = useDeploymentPageContext();
  const shouldShowDocsLink = currentStep !== RaasProviders;

  return (
    <>
      {shouldShowDocsLink && (
        <ExternalLink
          href="https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction"
          className="text-xs underline"
        >
          Open supporting documentation for this flow
        </ExternalLink>
      )}
      {children}
      <div className="flex w-full items-center justify-between bg-transparent">
        <ResetButton />
        <div className="flex gap-5">
          <BackButton isLoading={isLoading} />
          {!isLastStep && <NextButton onClick={submitForm} isLoading={isLoading} />}
        </div>
      </div>
      {(currentStep === DownloadConfig || currentStep === DownloadAnyTrustConfig) &&
        !isDownloadCompleted && (
          <div className="text-right">
            <p>Please download zip file before continuing</p>
          </div>
        )}
    </>
  );
}

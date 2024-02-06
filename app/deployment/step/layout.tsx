'use client';
import { BackButton } from '@/components/BackButton';
import { useDeploymentPageContext } from '@/components/DeploymentPageContext';
import { ExternalLink } from '@/components/ExternalLink';
import { NextButton } from '@/components/NextButton';
import { ResetButton } from '@/components/ResetButton';
import { useStep } from '@/hooks/useStep';
import { DownloadConfig } from '@/types/Steps';

export default function StepLayout({ children }: { children: any }) {
  const { submitForm, currentStep } = useStep();
  const [{ isLoading, isDownloadCompleted }] = useDeploymentPageContext();

  return (
    <>
      <ExternalLink
        href="https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction"
        className="text-xs underline"
      >
        Open supporting documentation for this flow
      </ExternalLink>
      {children}
      <div className="flex w-full items-center justify-between bg-transparent">
        <ResetButton />
        <div className="flex gap-5">
          <BackButton isLoading={isLoading} />
          <div className="text-right">
            <NextButton onClick={submitForm} isLoading={isLoading} />
            {currentStep === DownloadConfig && !isDownloadCompleted && (
              <p>Please download zip file before continuing</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

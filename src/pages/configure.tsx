import React, { useState } from 'react';
import { Steps } from 'primereact/steps';

import { spaceGrotesk } from '@/fonts';
import { RollupConfig, RollupConfigInput } from './rollupConfigInput';
import { DeployRollup } from './rollup';
import { SetValidator } from './setValidators';
import SetBatchPoster from './batchPoster';
import ViewRollupData from './ViewRollupData';

const steps = [
  {
    label: 'Configure & Deploy Rollup',
  },
  {
    label: 'Configure Validators',
  },
  {
    label: 'Configure Batch Poster',
  },
  {
    label: 'Review & Download Config',
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
  ConfigureRollupDeployment = 0,
  ConfigureValidators = 1,
  ConfigureBatchPoster = 2,
  Review = 3,
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-left text-3xl">{children}</h1>;
}

export default function Configure() {
  const [step, setStep] = useState<Step>(Step.ConfigureRollupDeployment);
  const [rollupConfig, setRollupConfig] = useState<RollupConfig | undefined>(undefined);

  return (
    <div className="flex w-full justify-center py-8">
      <div className="flex w-[768px] flex-col">
        <Steps model={steps} activeIndex={step} className="w-full" {...stepsStyleProps} />
        <div className="h-16" />

        {step === Step.ConfigureRollupDeployment && (
          <>
            <StepTitle>Configure & Deploy Rollup</StepTitle>
            <div className="h-4" />
            <RollupConfigInput
              onChange={(_rollupConfig) => {
                setRollupConfig(_rollupConfig);
              }}
            />
            <div className="h-8" />
          </>
        )}

        {step === Step.ConfigureRollupDeployment && (
          <DeployRollup
            rollupConfig={rollupConfig!}
            onNext={() => setStep(Step.ConfigureValidators)}
          />
        )}

        {step === Step.ConfigureValidators && (
          <>
            <StepTitle>Configure Validators</StepTitle>
            <div className="h-4" />
            <SetValidator onDone={() => setStep(Step.ConfigureBatchPoster)} />
          </>
        )}

        {step === Step.ConfigureBatchPoster && (
          <>
            <StepTitle>Configure & Deploy Rollup</StepTitle>
            <div className="h-4" />
            <SetBatchPoster onDone={() => setStep(Step.Review)} />
          </>
        )}

        {step === Step.Review && (
          <>
            <StepTitle>Review & Download Config</StepTitle>
            <div className="h-4" />
            <ViewRollupData />
          </>
        )}
      </div>
    </div>
  );
}

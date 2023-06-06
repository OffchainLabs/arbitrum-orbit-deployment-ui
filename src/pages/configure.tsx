import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Steps } from 'primereact/steps';

import { spaceGrotesk } from '@/fonts';
import { RollupConfig, RollupConfigInput } from '@/components/RollupConfigInput';
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

const defaultRollupConfig: RollupConfig = {
  confirmPeriodBlocks: 20,
  stakeToken: ethers.constants.AddressZero,
  baseStake: 10000000,
  owner: '',
  extraChallengeTimeBlocks: 0,
  // Needs to be changed after PR by Lee about new Wasm root
  wasmModuleRoot: '0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21',
  loserStakeEscrow: ethers.constants.AddressZero,
  chainId: 1337,
  chainConfig: ethers.constants.HashZero,
  genesisBlockNum: 0,
  sequencerInboxMaxTimeVariation: {
    delayBlocks: 16,
    futureBlocks: 192,
    delaySeconds: 86400,
    futureSeconds: 7200,
  },
};

export default function Configure() {
  const [step, setStep] = useState<Step>(Step.ConfigureRollupDeployment);
  const [rollupConfig, setRollupConfig] = useState<RollupConfig>(defaultRollupConfig);

  return (
    <div className="flex w-full justify-center py-8">
      <div className="flex w-[768px] flex-col">
        <Steps model={steps} activeIndex={step} className="w-full" {...stepsStyleProps} />
        <div className="h-16" />

        {step === Step.ConfigureRollupDeployment && (
          <>
            <StepTitle>Configure & Deploy Rollup</StepTitle>
            <div className="h-4" />
            <RollupConfigInput value={rollupConfig} onChange={(value) => setRollupConfig(value)} />
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

'use client';

import { ChainTypePicker } from '@/components/ChainTypePicker';
import { useDeploymentPageContext } from '@/components/DeploymentPageContext';
import { StepTitle } from '@/components/StepTitle';
import { ChainTypeInfoPanel } from '@/components/ChainTypeInfoPanel';
import { useStep } from '@/hooks/useStep';
import { ChainType } from '@/types/ChainType';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';

export default function ChainTypePage() {
  const [{ chainType }, dispatch] = useDeploymentPageContext();
  const { nextStep, pickChainFormRef } = useStep();
  const [selectedChainType, setSelectedChainType] = useState<ChainType | undefined>(chainType);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleChainTypeChange = (newChainType: ChainType) => {
    setError('');
    setSelectedChainType(newChainType);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChainType) {
      setError('Please select a chain type');
      return;
    }
    setError('');
    dispatch({
      type: 'set_chain_type',
      payload: selectedChainType,
    });
    nextStep();
  };

  return (
    <div className="border-px flex min-h-[60vh] w-full flex-wrap border border-grey">
      <div className="w-full overflow-y-auto rounded-md p-8  md:w-1/2">
        <form onSubmit={handleSubmit} ref={pickChainFormRef}>
          <div className="flex flex-col gap-5">
            <StepTitle>Choose Chain Type</StepTitle>
            <ChainTypePicker
              selectedChainType={selectedChainType}
              onClick={handleChainTypeChange}
              chainType={ChainType.Rollup}
              label={'Rollup'}
              description="Arbitrum’s market-leading optimistic rollup protocol. Rollup chains are EVM-equivalent and inherit security from Layer-1. They are permissionless to validate and secured by battle-tested Arbitrum fraud proofs."
            />
            <ChainTypePicker
              selectedChainType={selectedChainType}
              onClick={handleChainTypeChange}
              chainType={ChainType.AnyTrust}
              label={'AnyTrust'}
              description="Arbitrum’s high scale and low fee protocol. AnyTrust chains are EVM-equivalent, powered by Arbitrum Nitro and secured by a trust-minimized Data Availability Committee (DAC) which stores and verifies transaction data offchain."
            />
          </div>
          <p className="text-red-500">{error}</p>
        </form>
      </div>
      <div
        className={twMerge(
          'w-full overflow-y-auto border-t border-solid border-grey bg-[#343434] p-8 md:w-1/2 md:border-l md:border-t-0',
          !selectedChainType && 'bg-transparent',
        )}
      >
        {selectedChainType === ChainType.AnyTrust && <AnyTrustInfoPanel />}
        {selectedChainType === ChainType.Rollup && <RollupInfoPanel />}
      </div>
    </div>
  );
}

const AnyTrustInfoPanel = () => (
  <ChainTypeInfoPanel
    header="AnyTrust"
    description="Arbitrum AnyTrust introduces a minor trust assumption in exchange for much lower fees. Data availability is managed by a Data Availability Committee; a fixed and permissioned set of nodes with a 2-of-N trust model. AnyTrust chains are permissionless to validate and secured by Arbitrum fraud proofs."
    dataAvailabilityLayer={
      <a
        className="hover:underline"
        href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/node-running/how-tos/data-availability-committee/introduction`}
      >
        AnyTrust Data Availability Committee <i className="pi pi-external-link ml-1 text-sm" />
      </a>
    }
    gasFee="Typically less than $0.01"
    exampleChain="Arbitrum Nova"
    logo={<Image src="/NovaLogo.svg" alt="Logo" width={20} height={20} />}
  />
);

const RollupInfoPanel = () => (
  <ChainTypeInfoPanel
    header="Rollup"
    description="Arbitrum Rollups post data to their base chain (e.g. Ethereum or Arbitrum One), achieving the security properties of Ethereum itself. Rollups built on Arbitrum One benefit from 10x lower onboarding and maintenance fees and access to Arbitrum’s vibrant ecosystem of users, liquidity, and infrastructure. Any party can participate in validating the chain to ensure its safety."
    dataAvailabilityLayer="Ethereum"
    gasFee="Typically $0.10-$0.30"
    exampleChain="Arbitrum One"
    logo={<Image src="/ArbOneLogo.svg" alt="Logo" width={20} height={18} />}
  />
);

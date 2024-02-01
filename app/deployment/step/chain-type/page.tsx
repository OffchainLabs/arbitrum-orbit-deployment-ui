'use client';

import { ChainTypePicker } from '@/components/ChainTypePicker';
import { useDeploymentPageContext } from '@/components/DeploymentPageContext';
import { ExternalLink } from '@/components/ExternalLink';
import { StepTitle } from '@/components/StepTitle';
import { useStep } from '@/hooks/useStep';
import { ChainType } from '@/types/ChainType';
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
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4" ref={pickChainFormRef}>
      <StepTitle>Choose Chain Type</StepTitle>
      <ExternalLink
        href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/faqs/protocol-faqs#q-rollup-vs-anytrust`}
        className="text-sm text-[#1366C1] "
      >
        Learn more about AnyTrust vs. Rollup
      </ExternalLink>
      <ChainTypePicker
        selectedChainType={selectedChainType}
        onClick={handleChainTypeChange}
        chainType={ChainType.Rollup}
        label={'Rollup'}
        description="Arbitrum Rollup is an Optimistic Rollup protocol; it is trustless and permissionless.
              Part of how these properties are achieved is by requiring all chain data to be posted
              on layer 1. This means the availability of this data follows directly from the
              security properties of Ethereum itself, and, in turn, that any party can participate
              in validating the chain and ensuring its safety."
      />
      <ChainTypePicker
        selectedChainType={selectedChainType}
        onClick={handleChainTypeChange}
        chainType={ChainType.AnyTrust}
        label={'AnyTrust'}
        description="Arbitrum AnyTrust introduces a trust assumption in exchange for lower fees; data
          availability is managed by a Data Availability Committee (DAC), a fixed, permissioned
          set of entities. We introduce some threshold, K, with the assumption that at least K
          members of the committee are honest."
      />
      <p className="text-red-500">{error}</p>
    </form>
  );
}

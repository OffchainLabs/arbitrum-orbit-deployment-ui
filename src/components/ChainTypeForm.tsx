import { useStep } from '@/hooks/useStep';
import { ChainType, useDeploymentPageContext } from '@/pages/deployment/DeploymentPageContext';
import { ForwardedRef, forwardRef, useState } from 'react';
import { ChainTypePicker } from './ChainTypePicker';
import { ExternalLink } from './ExternalLink';
import { StepTitle } from './StepTitle';

export const ChainTypeForm = forwardRef(({}, ref: ForwardedRef<HTMLFormElement>) => {
  const [, dispatch] = useDeploymentPageContext();
  const { nextStep } = useStep();
  const [{ chainType }] = useDeploymentPageContext();
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
    <form onSubmit={handleSubmit} className="flex w-2/3 flex-col gap-4" ref={ref}>
      <StepTitle>Choose Chain Type</StepTitle>
      <ExternalLink
        href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/faqs/protocol-faqs#q-rollup-vs-anytrust`}
        className="text-lg  text-[#1366C1] underline"
      >
        Learn more about AnyTrust vs. Rollup
        <i className="pi pi-external-link mx-2"></i>
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
});

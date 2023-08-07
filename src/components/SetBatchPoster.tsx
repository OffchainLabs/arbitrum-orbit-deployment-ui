import { useStep } from '@/hooks/useStep';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { BatchPoster } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { useState } from 'react';
import { TextInputWithInfoLink } from './TextInputWithInfoLink';
import { StepTitle } from './StepTitle';

export const SetBatchPoster = () => {
  const [{ batchPoster: currentBatchPoster }, dispatch] = useDeploymentPageContext();
  const { nextStep, batchPosterFormRef } = useStep();
  const [batchPoster, setBatchPoster] = useState<BatchPoster>(
    currentBatchPoster || getRandomWallet(),
  );

  const handleAddressChange = (value: string) => {
    setBatchPoster((prev: BatchPoster) => ({ ...prev, address: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch({
      type: 'set_batch_poster',
      payload: batchPoster,
    });

    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-1/2 flex-col gap-4" ref={batchPosterFormRef}>
      <StepTitle>Configure Batch Poster</StepTitle>
      <TextInputWithInfoLink
        label="Batch Poster Address"
        href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart#step-5-configure-your-chains-batch-poster`}
        name="batchPoster"
        placeholder="Enter address"
        infoText="Read about Batch Poster in the docs"
        value={batchPoster.address}
        onChange={(e) => handleAddressChange(e.target.value)}
      />
    </form>
  );
};

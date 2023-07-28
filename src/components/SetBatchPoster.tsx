import { useStep } from '@/hooks/useStep';
import { useDeploymentPageContext } from '@/pages/deployment/DeploymentPageContext';
import { BatchPoster } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { forwardRef, ForwardedRef, useState, useEffect } from 'react';
import { OpenDocsLink } from './OpenDocsLink';

export const SetBatchPoster = forwardRef(({}, ref: ForwardedRef<HTMLFormElement>) => {
  const [{ batchPoster: currentBatchPoster }, dispatch] = useDeploymentPageContext();
  const { nextStep } = useStep();
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
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={ref}>
        <OpenDocsLink />

        <label htmlFor="batchPoster" className="font-bold">
          Batch Poster Address
        </label>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart#step-5-configure-your-chains-batch-poster`}
          className="font-light text-[#6D6D6D] underline"
        >
          Read about Batch Poster in the docs
        </a>
        <input
          name="batchPoster"
          type="text"
          placeholder="Enter address"
          value={batchPoster.address}
          onChange={(e) => handleAddressChange(e.target.value)}
          className="w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
        />
      </form>
    </div>
  );
});

import React, { ForwardedRef, forwardRef } from 'react';
import { useSigner } from 'wagmi';
import { useDeploymentPageContext } from '@/pages/deployment/DeploymentPageContext';
import { deployRollup } from '@/utils/deployRollup';

type ReviewAndDeployProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ReviewAndDeploy = forwardRef(
  ({ isLoading, setIsLoading }: ReviewAndDeployProps, ref: ForwardedRef<HTMLFormElement>) => {
    const [{ rollupConfig, validators, batchPoster }, dispatch] = useDeploymentPageContext();
    const { data: signer } = useSigner();

    if (!rollupConfig) return <div>No rollup config found</div>;
    if (!validators) return <div>No validators found</div>;
    if (!batchPoster) return <div>No batch poster found</div>;
    if (!signer) return <div>No signer found</div>;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const rollupContracts = await deployRollup({
          rollupConfig,
          validators,
          batchPoster,
          signer,
        });
        dispatch({ type: 'set_rollup_contracts', payload: rollupContracts });
        dispatch({ type: 'next_step' });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="flex flex-col gap-4">
        <h3 className="font-bold">Rollup Config</h3>
        <div className="ml-4 flex flex-col gap-2">
          <div>
            <span className="font-bold">Chain ID</span>
            <pre className="whitespace-pre-wrap break-all rounded bg-[#f6f6f6] p-2 text-[#6D6D6D]">
              {rollupConfig.chainId}
            </pre>
          </div>
          <div>
            <span className="font-bold">Chain Name</span>
            <pre className="whitespace-pre-wrap break-all rounded bg-[#f6f6f6] p-2 text-[#6D6D6D]">
              {rollupConfig.chainName}
            </pre>
          </div>
          <div>
            <span className="font-bold">Challenge Period Blocks</span>
            <pre className="whitespace-pre-wrap break-all rounded bg-[#f6f6f6] p-2 text-[#6D6D6D]">
              {rollupConfig.confirmPeriodBlocks}
            </pre>
          </div>
          <div>
            <span className="font-bold">Stake Token</span>
            <pre className="whitespace-pre-wrap break-all rounded bg-[#f6f6f6] p-2 text-[#6D6D6D]">
              {rollupConfig.stakeToken}
            </pre>
          </div>
          <div>
            <span className="font-bold">Base Stake (in Ether)</span>
            <pre className="whitespace-pre-wrap break-all rounded bg-[#f6f6f6] p-2 text-[#6D6D6D]">
              {rollupConfig.baseStake}
            </pre>
          </div>
          <div>
            <span className="font-bold">Owner</span>
            <pre className="whitespace-pre-wrap break-all rounded bg-[#f6f6f6] p-2 text-[#6D6D6D]">
              {rollupConfig.owner}
            </pre>
          </div>
        </div>
        <h3 className="font-bold">Validators</h3>
        <div className="ml-4 flex flex-col gap-2">
          {validators.map((validator, index) => (
            <div key={index}>
              <span className="font-bold">Validator {index + 1}</span>
              <pre className="whitespace-pre-wrap break-all rounded bg-[#f6f6f6] p-2 text-[#6D6D6D]">
                {validator.address}
              </pre>
            </div>
          ))}
        </div>
        <div>
          <span className="font-bold">Batch Poster</span>
          <pre className="whitespace-pre-wrap break-all rounded bg-[#f6f6f6] p-2 text-[#6D6D6D]">
            {batchPoster.address}
          </pre>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={ref}>
          <button
            type="submit"
            className={`w-full rounded-lg bg-[#243145] px-3 py-2 text-2xl text-white ${
              isLoading && 'cursor-not-allowed bg-gray-400'
            }`}
            disabled={isLoading}
          >
            Deploy
          </button>
        </form>
      </div>
    );
  },
);

import { useStep } from '@/hooks/useStep';
import { useDeploymentPageContext } from '@/pages/deployment/DeploymentPageContext';
import { ChainId } from '@/types/ChainId';
import { deployRollup } from '@/utils/deployRollup';
import React, { ForwardedRef, forwardRef } from 'react';
import { useNetwork, useSigner } from 'wagmi';
import { StepTitle } from './StepTitle';

type ReviewAndDeployProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ReviewAndDeploy = forwardRef(
  ({ isLoading, setIsLoading }: ReviewAndDeployProps, ref: ForwardedRef<HTMLFormElement>) => {
    const [{ rollupConfig, validators, batchPoster, chainType }, dispatch] =
      useDeploymentPageContext();
    const { data: signer } = useSigner();
    const { chain } = useNetwork();
    const { nextStep } = useStep();

    if (!rollupConfig) return <div>No rollup config found</div>;
    if (!validators) return <div>No validators found</div>;
    if (!batchPoster) return <div>No batch poster found</div>;
    if (!signer) return <div>No signer found</div>;
    if (chain?.id !== ChainId.ArbitrumGoerli) {
      return (
        <div>
          <p>You are connected to the wrong network.</p>
          <p>Please make sure you are connected to Arbitrum Goerli.</p>
        </div>
      );
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        setIsLoading(true);
        const rollupContracts = await deployRollup({
          rollupConfig,
          validators,
          batchPoster,
          signer,
          chainType,
        });
        dispatch({ type: 'set_rollup_contracts', payload: rollupContracts });
        nextStep();
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <>
        <StepTitle>Review & Deploy Config</StepTitle>
        <div className="mx-0 my-2 grid grid-cols-2 gap-4">
          <div>
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
          </div>
          <div>
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
            <div className="mt-2">
              <h3 className="font-bold">Batch Poster</h3>
              <pre className="whitespace-pre-wrap break-all rounded bg-[#f6f6f6] p-2 text-[#6D6D6D]">
                {batchPoster.address}
              </pre>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={ref}></form>
        </div>
      </>
    );
  },
);

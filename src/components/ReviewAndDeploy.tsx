import { useStep } from '@/hooks/useStep';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { deployRollup } from '@/utils/deployRollup';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { StepTitle } from './StepTitle';
import { ChainType } from '@/types/ChainType';

export const ReviewAndDeploy = () => {
  const [{ rollupConfig, validators, batchPoster, chainType }, dispatch] =
    useDeploymentPageContext();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { nextStep, reviewAndDeployFormRef } = useStep();

  if (!rollupConfig) return <div>No rollup config found</div>;
  if (!validators) return <div>No validators found</div>;
  if (!batchPoster) return <div>No batch poster found</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      dispatch({ type: 'set_is_loading', payload: true });
      if (!walletClient || !address) return;
      const rollupContracts = await deployRollup({
        rollupConfig,
        validators,
        batchPoster,
        chainType,
        account: address,
        publicClient,
        walletClient,
      });
      dispatch({ type: 'set_rollup_contracts', payload: rollupContracts });
      nextStep();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ type: 'set_is_loading', payload: false });
    }
  };

  return (
    <>
      <StepTitle>Review & Deploy Config</StepTitle>
      <div className="mx-0 my-2 grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold">
            {chainType === ChainType.Rollup ? 'Rollup' : 'AnyTrust'} Config
          </h3>
          <div className="ml-4 flex flex-col gap-2">
            <div>
              <span className="font-bold">Chain ID</span>
              <pre className="whitespace-pre-wrap break-all rounded bg-[#eff5f9] p-2 text-[#243045]">
                {rollupConfig.chainId}
              </pre>
            </div>
            <div>
              <span className="font-bold">Chain Name</span>
              <pre className="whitespace-pre-wrap break-all rounded bg-[#eff5f9] p-2 text-[#243045]">
                {rollupConfig.chainName}
              </pre>
            </div>
            <div>
              <span className="font-bold">Challenge Period Blocks</span>
              <pre className="whitespace-pre-wrap break-all rounded bg-[#eff5f9] p-2 text-[#243045]">
                {rollupConfig.confirmPeriodBlocks}
              </pre>
            </div>
            <div>
              <span className="font-bold">Stake Token</span>
              <pre className="whitespace-pre-wrap break-all rounded bg-[#eff5f9] p-2 text-[#243045]">
                {rollupConfig.stakeToken}
              </pre>
            </div>
            <div>
              <span className="font-bold">Base Stake (in Ether)</span>
              <pre className="whitespace-pre-wrap break-all rounded bg-[#eff5f9] p-2 text-[#243045]">
                {rollupConfig.baseStake}
              </pre>
            </div>
            <div>
              <span className="font-bold">Owner</span>
              <pre className="whitespace-pre-wrap break-all rounded bg-[#eff5f9] p-2 text-[#243045]">
                {rollupConfig.owner}
              </pre>
            </div>
            <div>
              <span className="font-bold">Native Token</span>
              <pre className="whitespace-pre-wrap break-all rounded bg-[#f6f6f6] p-2 text-[#6D6D6D]">
                {rollupConfig.nativeToken}
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
                <pre className="whitespace-pre-wrap break-all rounded bg-[#eff5f9] p-2 text-[#243045]">
                  {validator.address}
                </pre>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <h3 className="font-bold">Batch Poster</h3>
            <pre className="whitespace-pre-wrap break-all rounded bg-[#eff5f9] p-2 text-[#243045]">
              {batchPoster.address}
            </pre>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          ref={reviewAndDeployFormRef}
        ></form>
      </div>
    </>
  );
};

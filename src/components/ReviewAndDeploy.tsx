import { useStep } from '@/hooks/useStep';
import { useDeploymentPageContext } from './DeploymentPageContext';
import {
  deployRollup,
  ARB_GOERLI_CREATOR_ADDRESS,
  ARB_SEPOLIA_CREATOR_ADDRESS,
} from '@/utils/deployRollup';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { StepTitle } from './StepTitle';
import { ChainType } from '@/types/ChainType';
import { approve, fetchAllowance } from '@/utils/erc20';
import { maxInt32, zeroAddress } from 'viem';
import { ChainId } from '@/types/ChainId';

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

      const parentChainId = await publicClient.getChainId();

      const rollupCreatorContractAddress =
        parentChainId === ChainId.ArbitrumGoerli
          ? ARB_GOERLI_CREATOR_ADDRESS
          : ARB_SEPOLIA_CREATOR_ADDRESS;

      if (rollupConfig.nativeToken !== zeroAddress) {
        const customFeeTokenContractAddress = rollupConfig.nativeToken as `0x${string}`;

        const allowance = await fetchAllowance({
          erc20ContractAddress: customFeeTokenContractAddress,
          owner: address,
          spender: rollupCreatorContractAddress,
          publicClient,
        });

        // todo: set proper cap for threshold
        // todo: set proper allowance instead of maxInt32
        if (allowance < maxInt32) {
          await approve({
            erc20ContractAddress: customFeeTokenContractAddress,
            spender: rollupCreatorContractAddress,
            publicClient,
            walletClient,
          });
        }
      }

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
              <pre className="whitespace-pre-wrap break-all rounded bg-[#eff5f9] p-2 text-[#243045]">
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

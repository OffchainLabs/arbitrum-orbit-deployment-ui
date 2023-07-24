import { useStep } from '@/hooks/useStep';
import { useDeploymentPageContext } from '@/pages/deployment/DeploymentPageContext';
import { ForwardedRef, forwardRef, useState } from 'react';

export type RollupConfig = {
  confirmPeriodBlocks: number;
  stakeToken: string;
  baseStake: string;
  owner: string;
  extraChallengeTimeBlocks: number;
  wasmModuleRoot: string;
  loserStakeEscrow: string;
  chainId: number;
  chainName: string;
  chainConfig: string;
  genesisBlockNum: number;
  sequencerInboxMaxTimeVariation: {
    delayBlocks: number;
    futureBlocks: number;
    delaySeconds: number;
    futureSeconds: number;
  };
};

type StakeTokenType = 'ETH' | 'Custom';

export const RollupConfigInput = forwardRef(({}, ref: ForwardedRef<HTMLFormElement>) => {
  const [stakeTokenType, setStakeTokenType] = useState<StakeTokenType>('ETH');
  const [{ rollupConfig }, dispatch] = useDeploymentPageContext();
  const { nextStep } = useStep();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const updatedRollupConfig: Partial<RollupConfig> = {};
    for (const [key, value] of formData.entries()) {
      //@ts-expect-error - key is a string
      updatedRollupConfig[key] = value;
    }

    if (rollupConfig !== undefined) {
      dispatch({
        type: 'set_rollup_config',
        payload: { ...rollupConfig, ...updatedRollupConfig },
      });

      nextStep();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart`}
        className="text-lg font-bold uppercase text-[#1366C1] underline"
      >
        Open supporting documentation for this flow
      </a>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={ref}>
        <div className="flex flex-col gap-2">
          <label htmlFor="chainId" className="font-bold">
            Chain ID
          </label>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/how-tos/customize-deployment-configuration#chain-id`}
            className="font-light text-[#6D6D6D] underline"
          >
            Read about Chain ID in the docs
          </a>
          <input
            className="rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
            type="number"
            name="chainId"
            placeholder="12345678"
            defaultValue={rollupConfig?.chainId}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="chainName" className="font-bold">
            Chain Name
          </label>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/how-tos/customize-deployment-configuration#chain-name`}
            className="font-light text-[#6D6D6D] underline"
          >
            Read about Chain Name in the docs
          </a>
          <input
            className="rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
            type="text"
            name="chainName"
            defaultValue={rollupConfig?.chainName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPeriodBlocks" className="font-bold">
            Challenge Period Blocks
          </label>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/how-tos/customize-deployment-configuration#challenge-period-blocks`}
            className="font-light text-[#6D6D6D] underline"
          >
            Read about Challenge Period Blocks in the docs
          </a>
          <input
            className="rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
            type="number"
            name="confirmPeriodBlocks"
            defaultValue={rollupConfig?.confirmPeriodBlocks}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="stakeToken" className="font-bold">
            Stake Token
          </label>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/how-tos/customize-deployment-configuration#stake-token`}
            className="font-light text-[#6D6D6D] underline"
          >
            Read about Stake Token in the docs
          </a>
          <select
            disabled
            defaultValue={stakeTokenType}
            className="cursor-not-allowed rounded-lg border border-[#6D6D6D] bg-white px-3 py-2 shadow-input"
          >
            <option>ETH</option>
            <option>Custom</option>
          </select>
          {stakeTokenType === 'Custom' && (
            <input
              className="rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
              type="text"
              name="stakeToken"
              defaultValue={rollupConfig?.stakeToken}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="baseStake" className="font-bold">
            Base Stake (in Ether)
          </label>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/how-tos/customize-deployment-configuration#base-stake`}
            className="font-light text-[#6D6D6D] underline"
          >
            Read about Base Stake in the docs
          </a>
          <input
            className="rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
            type="number"
            name="baseStake"
            step={0.1}
            defaultValue={rollupConfig?.baseStake}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="owner" className="font-bold">
            Owner
          </label>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/how-tos/customize-deployment-configuration#owner`}
            className="font-light text-[#6D6D6D] underline"
          >
            Read about Owner in the docs
          </a>
          <input
            className="rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
            type="text"
            name="owner"
            defaultValue={rollupConfig?.owner}
          />
          <p className="text-sm text-[#60461F]">
            Please set the owner address to one which you are comfortable exposing private keys for
            (on your local device).
          </p>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#243145] px-3 py-2 text-2xl text-white"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
});

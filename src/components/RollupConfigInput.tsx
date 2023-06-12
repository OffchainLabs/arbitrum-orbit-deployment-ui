import { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

export type RollupConfig = {
  confirmPeriodBlocks: number;
  stakeToken: string;
  baseStake: BigNumber;
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

export type RollupConfigInputProps = {
  value: RollupConfig;
  onChange: (config: RollupConfig) => void;
};

export function RollupConfigInput({ value, onChange }: RollupConfigInputProps) {
  const { address } = useAccount();
  const [stakeTokenType, setStakeTokenType] = useState<StakeTokenType>('ETH');

  useEffect(() => {
    async function updateOwner() {
      if (typeof address !== 'undefined') {
        onChange({ ...value, owner: address });
      }
    }

    updateOwner();
  }, [address]);

  useEffect(() => {
    // If change backed to ETH, reset to 0x0
    if (stakeTokenType === 'ETH') {
      onChange({ ...value, stakeToken: ethers.constants.AddressZero });
    }
  }, [stakeTokenType]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name: inputName, value: inputValue } = event.target;
    onChange({ ...value, [inputName]: inputValue });
  }

  return (
    <div className="flex flex-col gap-4">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-l3-chain/orbit-quickstart`}
        className="text-lg font-bold uppercase text-[#1366C1] underline"
      >
        Open supporting documentation for this flow
      </a>
      <div className="flex flex-col gap-2">
        <label htmlFor="chainId" className="font-bold">
          Chain ID
        </label>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-l3-chain/orbit-quickstart#chain-id`}
          className="font-light text-[#6D6D6D] underline"
        >
          Read about Chain ID in the docs
        </a>
        <input
          className="rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
          type="number"
          name="chainId"
          placeholder="12345678"
          value={value.chainId}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="chainName" className="font-bold">
          Chain Name
        </label>
        <input
          className="rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
          type="text"
          name="chainName"
          value={value.chainName}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPeriodBlocks" className="font-bold">
          Challenge Period Blocks
        </label>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-l3-chain/orbit-quickstart#challenge-period-blocks`}
          className="font-light text-[#6D6D6D] underline"
        >
          Read about Challenge Period Blocks in the docs
        </a>
        <input
          className="rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
          type="number"
          name="confirmPeriodBlocks"
          value={value.confirmPeriodBlocks}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="stakeToken" className="font-bold">
          Stake Token
        </label>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-l3-chain/orbit-quickstart#stake-token`}
          className="font-light text-[#6D6D6D] underline"
        >
          Read about Stake Token in the docs
        </a>
        <select
          value={stakeTokenType}
          onChange={(event) => setStakeTokenType(event.target.value as StakeTokenType)}
          className="rounded-lg border border-[#6D6D6D] bg-white px-3 py-2 shadow-input"
        >
          <option>ETH</option>
          <option>Custom</option>
        </select>
        {stakeTokenType === 'Custom' && (
          <input
            className="rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
            type="text"
            name="stakeToken"
            value={value.stakeToken}
            onChange={handleChange}
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="baseStake" className="font-bold">
          Base Stake
        </label>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-l3-chain/orbit-quickstart#base-stake`}
          className="font-light text-[#6D6D6D] underline"
        >
          Read about Base Stake in the docs
        </a>
        <input
          className="rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
          type="number"
          name="baseStake"
          value={value.baseStake.toString()}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="owner" className="font-bold">
          Owner
        </label>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-l3-chain/orbit-quickstart#owner`}
          className="font-light text-[#6D6D6D] underline"
        >
          Read about Owner in the docs
        </a>
        <input
          className="rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
          type="text"
          name="owner"
          value={value.owner}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

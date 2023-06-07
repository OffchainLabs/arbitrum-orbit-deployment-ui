import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

declare let window: Window & { ethereum: any };

export type RollupConfig = {
  confirmPeriodBlocks: number;
  stakeToken: string;
  baseStake: number;
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

export type RollupConfigInputProps = {
  value: RollupConfig;
  onChange: (config: RollupConfig) => void;
};

export function RollupConfigInput({ value, onChange }: RollupConfigInputProps) {
  useEffect(() => {
    async function updateOwner() {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      onChange({ ...value, owner: address });
    }

    updateOwner();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name: inputName, value: inputValue } = event.target;
    onChange({ ...value, [inputName]: inputValue });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label htmlFor="chainId" className="font-bold">
          Chain ID
        </label>
        <input
          className="rounded-lg border border-[#6D6D6D] px-3 py-2"
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
          className="rounded-lg border border-[#6D6D6D] px-3 py-2"
          type="text"
          name="chainName"
          value={value.chainName}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="confirmPeriodBlocks" className="font-bold">
          Confirm Period Blocks
        </label>
        <input
          className="rounded-lg border border-[#6D6D6D] px-3 py-2"
          type="number"
          name="confirmPeriodBlocks"
          value={value.confirmPeriodBlocks}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="stakeToken" className="font-bold">
          Stake Token
        </label>
        <input
          className="rounded-lg border border-[#6D6D6D] px-3 py-2"
          type="text"
          name="stakeToken"
          value={value.stakeToken}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="baseStake" className="font-bold">
          Base Stake
        </label>
        <input
          className="rounded-lg border border-[#6D6D6D] px-3 py-2"
          type="number"
          name="baseStake"
          value={value.baseStake}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="owner" className="font-bold">
          Owner
        </label>
        <input
          className="rounded-lg border border-[#6D6D6D] px-3 py-2"
          type="text"
          name="owner"
          value={value.owner}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

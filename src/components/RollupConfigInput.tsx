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
  chainConfig: string;
  genesisBlockNum: number;
  sequencerInboxMaxTimeVariation: {
    delayBlocks: number;
    futureBlocks: number;
    delaySeconds: number;
    futureSeconds: number;
  };
};

const defaultRollupConfig: RollupConfig = {
  confirmPeriodBlocks: 20,
  stakeToken: ethers.constants.AddressZero,
  baseStake: 10000000,
  owner: '',
  extraChallengeTimeBlocks: 0,
  wasmModuleRoot: '0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21', // Need to be changed after PR by Lee about new Wasm root
  loserStakeEscrow: ethers.constants.AddressZero,
  chainId: 1337,
  chainConfig: ethers.constants.HashZero,
  genesisBlockNum: 0,
  sequencerInboxMaxTimeVariation: {
    delayBlocks: 16,
    futureBlocks: 192,
    delaySeconds: 86400,
    futureSeconds: 7200,
  },
};

export type RollupConfigInputProps = {
  onChange: (config: RollupConfig) => void;
};

export function RollupConfigInput({ onChange }: RollupConfigInputProps) {
  const [config, setConfig] = useState<RollupConfig>(defaultRollupConfig);

  useEffect(() => {
    async function updateOwner() {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setConfig((prevConfig) => ({
        ...prevConfig,
        owner: address,
      }));
    }

    updateOwner();
  }, []);

  useEffect(() => {
    onChange(config);
  }, [config]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setConfig((prevConfig) => ({ ...prevConfig, [name]: value }));
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
          value={config.chainId}
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
          value={config.confirmPeriodBlocks}
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
          value={config.stakeToken}
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
          value={config.baseStake}
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
          value={config.owner}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

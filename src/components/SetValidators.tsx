import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNetwork, useSigner } from 'wagmi';

import RollupAdminLogicABIJSON from '@/ethereum/RollupAdminLogic.json';
import { isUserRejectedError } from '@/utils/isUserRejectedError';
import { useDeploymentPageContext } from '@/pages/deployment/DeploymentPageContext';

const RollupAdminLogicABI = RollupAdminLogicABIJSON.abi;

interface AddressInput {
  address: string;
}

const staker = ethers.Wallet.createRandom();
const stakerPrivateKey = staker.privateKey;
const stakerAddress = staker.address;

export function SetValidators({ onNext }: { onNext: () => void }) {
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const [, dispatch] = useDeploymentPageContext();

  const [rollupAddress, setRollupAddress] = useState('');
  const [addressInputs, setAddressInputs] = useState<AddressInput[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  useEffect(() => {
    let rollupData = null;
    const rollupDataString = localStorage.getItem('rollupData');
    const l3ConfigString = localStorage.getItem('l3Config');

    if (rollupDataString) {
      rollupData = JSON.parse(rollupDataString);
      if (rollupData && rollupData.chain['info-json'][0].rollup) {
        setRollupAddress(rollupData.chain['info-json'][0].rollup.rollup);
      }

      // Update the private key of staker in the rollupData and store it back in local storage
      rollupData.node.staker['parent-chain-wallet']['private-key'] = stakerPrivateKey;
      localStorage.setItem('rollupData', JSON.stringify(rollupData));
    }

    if (l3ConfigString) {
      const l3Config = JSON.parse(l3ConfigString);
      l3Config.staker = stakerAddress;
      localStorage.setItem('l3Config', JSON.stringify(l3Config));
    }

    if (rollupData) {
      setAddressInputs([{ address: stakerAddress }]);
    }
  }, []);

  const handleAddressCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    // Limit to 16 max
    const safeCount = count > 16 ? 16 : count;

    if (safeCount >= 1) {
      const additionalInputs =
        safeCount > 1 ? Array.from({ length: safeCount - 1 }, () => ({ address: '' })) : [];

      // Update the first address only if it's not already set
      const firstAddress = addressInputs[0]?.address || '';
      setAddressInputs([{ address: firstAddress }, ...additionalInputs]);
    }
  };

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newInputs = [...addressInputs];
    newInputs[index].address = e.target.value;
    setAddressInputs(newInputs);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (chain?.unsupported) {
      return alert(
        'You are connected to the wrong network.\nPlease make sure you are connected to Arbitrum Goerli.',
      );
    }

    if (!signer) {
      return alert("Error! Couldn't find a signer.");
    }

    setStatus('loading');

    try {
      const rollupAdminLogic = new ethers.Contract(rollupAddress, RollupAdminLogicABI, signer);

      const validators = addressInputs.map((input) => input.address);
      const bools = Array(addressInputs.length).fill(true);

      const tx = await rollupAdminLogic.setValidator(validators, bools);
      await tx.wait();

      dispatch({ type: 'set_validators', payload: validators });
      setStatus('done');
    } catch (error) {
      setStatus('idle');

      if (!isUserRejectedError(error)) {
        console.error(error);
        alert(error);
      }
    }
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
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label htmlFor="numberOfValidators" className="font-bold">
          Number of Validators
        </label>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-l3-chain/orbit-quickstart#step-3-configure-your-appchains-validators`}
          className="font-light text-[#6D6D6D] underline"
        >
          Read about Validators in the docs
        </a>
        <input
          name="numberOfValidators"
          type="number"
          placeholder="Number of addresses"
          min={1}
          max={16}
          defaultValue={1}
          onChange={handleAddressCount}
          className="w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
        />
        {addressInputs.map((input, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder={`Address ${index + 1}`}
              value={input.address}
              onChange={(e) => (index !== 0 ? handleAddressInput(e, index) : null)}
              disabled={index === 0}
              className="w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
            />
          </div>
        ))}

        {status === 'done' ? (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onNext}
              className="w-full rounded-lg bg-[#243145] px-3 py-2 text-2xl text-white"
            >
              Next
            </button>
            <p className="text-lg font-bold text-[#31572A]">Validator set changed!</p>
          </div>
        ) : (
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-lg bg-[#243145] px-3 py-2 text-2xl text-white"
          >
            {status === 'loading' ? 'Waiting...' : 'Submit'}
          </button>
        )}
      </form>
    </div>
  );
}

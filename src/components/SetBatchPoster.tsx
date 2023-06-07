// Import necessary libraries and JSON files
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import SequencerInboxJSON from '@/ethereum/SequencerInbox.json';
import { isUserRejectedError } from '@/utils/isUserRejectedError';

// Define the ABI for the SequencerInbox contract
const SequencerInboxABI = SequencerInboxJSON.abi;

// Extend Window object to include the ethereum property for MetaMask
declare let window: Window & { ethereum: any };

// Define the SetBatchPoster component
export function SetBatchPoster({ onNext }: { onNext: () => void }) {
  // State variables for Ethereum address and status message
  const [ethAddress, setEthAddress] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [sequencerInboxAddress, setSequencerInboxAddress] = useState<string | null>(null);

  // Define a state variable for the private key
  const [privateKey, setPrivateKey] = useState('');

  useEffect(() => {
    const batchPoster = ethers.Wallet.createRandom();
    setEthAddress(batchPoster.address);
    setPrivateKey(batchPoster.privateKey);

    const rollupDataJSON = localStorage.getItem('rollupData');
    const rollupData = rollupDataJSON && JSON.parse(rollupDataJSON);

    if (rollupData && rollupData.chain['info-json'][0].rollup) {
      setSequencerInboxAddress(rollupData.chain['info-json'][0].rollup['sequencer-inbox']);
    }

    const l3ConfigString = localStorage.getItem('l3Config');
    if (l3ConfigString) {
      const l3Config = JSON.parse(l3ConfigString);
      l3Config.batchPoster = batchPoster.address;
      localStorage.setItem('l3Config', JSON.stringify(l3Config));
    }
  }, []);

  // Function to handle Ethereum transaction signing and sending
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus('loading');

    try {
      // Connect to Ethereum network via MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Make sure the sequencerInboxAddress is not null
      if (sequencerInboxAddress === null) {
        alert('Error: Sequencer Inbox Address not found');
        return;
      }

      // Create an instance of the contract
      const sequencerInboxContract = new ethers.Contract(
        sequencerInboxAddress,
        SequencerInboxABI,
        signer,
      );

      // Call the setIsBatchPoster function on the contract and sign the transaction
      const isBatchPoster = true;
      const tx = await sequencerInboxContract.setIsBatchPoster(ethAddress, isBatchPoster);
      // Send the transaction to the network and wait for the receipt
      await tx.wait();

      setStatus('done'); // Set the transaction as successful

      // If the transaction is successful, save the private key to rollupData
      const rollupDataJSON = localStorage.getItem('rollupData');
      const rollupData = rollupDataJSON && JSON.parse(rollupDataJSON);

      if (rollupData) {
        rollupData.node['batch-poster']['parent-chain-wallet']['private-key'] = privateKey;
        localStorage.setItem('rollupData', JSON.stringify(rollupData)); // Save the updated data back to local storage
      }
    } catch (error) {
      setStatus('idle');

      if (!isUserRejectedError(error)) {
        console.error(error);
        alert(error);
      }
    }
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <label htmlFor="batchPoster" className="font-bold">
        Batch Poster Address
      </label>
      <input
        name="batchPoster"
        type="text"
        placeholder="Enter address"
        value={ethAddress}
        readOnly
        className="w-full rounded-lg border border-[#6D6D6D] px-3 py-2"
      />

      {status === 'done' ? (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onNext}
            className="w-full rounded-lg bg-[#243145] px-3 py-2 text-2xl text-white"
          >
            Next
          </button>
          <p className="text-lg font-bold text-[#31572A]">Batch poster changed!</p>
        </div>
      ) : (
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-lg bg-[#243145] px-3 py-2 text-2xl text-white"
        >
          {status === 'loading' ? 'Loading...' : 'Submit'}
        </button>
      )}
    </form>
  );
}

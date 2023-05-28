// Import necessary libraries and JSON files
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SequencerInboxJSON from '../ethereum/SequencerInbox.json';
import styles from '../styles/SetBatchPoster.module.css';
import Image from "next/image";
import { useRouter } from 'next/router';

// Define the ABI for the SequencerInbox contract
const SequencerInboxABI = SequencerInboxJSON.abi;

// Extend Window object to include the ethereum property for MetaMask
declare let window: Window & { ethereum: any };

// Define the SetBatchPoster component
export default function SetBatchPoster() {
  // State variables for Ethereum address and status message
  const [ethAddress, setEthAddress] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [sequencerInboxAddress, setSequencerInboxAddress] = useState<string | null>(null);
  const [transactionSuccessful, setTransactionSuccessful] = useState(false); // State to hold transaction status
  const router = useRouter(); // Router instance

  useEffect(() => {
    // Read the 'rollupData' from local storage when the component mounts
    const rollupDataJSON = localStorage.getItem('rollupData');
    const rollupData = rollupDataJSON && JSON.parse(rollupDataJSON);

    // If the 'rollupData' is available, retrieve the 'sequencer-inbox' and set it to state
    if (rollupData && rollupData.chain["info-json"][0].rollup) {
      setSequencerInboxAddress(rollupData.chain["info-json"][0].rollup["sequencer-inbox"]);
    }
  }, []);

  // Function to handle Ethereum transaction signing and sending
  async function signTransactionAndSend() {
    setStatusMessage('Processing...');
    try {
      // Connect to Ethereum network via MetaMask
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Make sure the sequencerInboxAddress is not null
      if (sequencerInboxAddress === null) {
        setStatusMessage('Error: Sequencer Inbox Address not found');
        return;
        }

      // Create an instance of the contract
      const sequencerInboxContract = new ethers.Contract(sequencerInboxAddress, SequencerInboxABI, signer);

      // Call the setIsBatchPoster function on the contract and sign the transaction
      const isBatchPoster = true;
      const tx = await sequencerInboxContract.setIsBatchPoster(ethAddress, isBatchPoster);

      // Send the transaction to the network and wait for the receipt
      const receipt = await tx.wait();
      setStatusMessage(`Transaction successful! The account address ${ethAddress} is now a Batch Poster`);
      setTransactionSuccessful(true); // Set the transaction as successful
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('Error: Unable to process transaction');
    }
  }
  function viewRollupData() {
    router.push('/ViewRollupData');
  }

  // Define the component's return JSX
  return (
    <div className={styles.container}>
      <Image
        className={styles.logo} 
        src="/logo.svg"
        alt="Logo"
        width={250}
        height={250}
      />  
      <h1 className={styles.title}>Set Batch Poster</h1>
      <div className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter Ethereum address"
          value={ethAddress}
          onChange={(e) => setEthAddress(e.target.value)}
        />
        {transactionSuccessful ? (
          <button className={styles.button} onClick={viewRollupData}>
            View Rollup Data
          </button>
        ) : (
          <button className={styles.button} onClick={signTransactionAndSend}>
            Sign and Send Transaction
          </button>
        )}
        <p className={styles.statusMessage}>{statusMessage}</p>
      </div>
    </div>
  );
}

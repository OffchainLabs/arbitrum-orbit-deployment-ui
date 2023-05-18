// Import necessary libraries and JSON files
import { useState } from 'react';
import { ethers } from 'ethers';
import SequencerInboxJSON from '../ethereum/SequencerInbox.json';
import styles from '../styles/SetBatchPoster.module.css';
import { useRouter } from 'next/router';
import Image from "next/image";

// Define the ABI for the SequencerInbox contract
const SequencerInboxABI = SequencerInboxJSON.abi;

// Extend Window object to include the ethereum property for MetaMask
declare let window: Window & { ethereum: any };

// Define the SetBatchPoster component
export default function SetBatchPoster() {
  // State variables for Ethereum address and status message
  const [ethAddress, setEthAddress] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Next.js Router to get query params
  const router = useRouter();

  // Get the sequencer inbox address from the URL params
  const sequencerInboxAddress = router.query.sequencerInbox as string;

  // Function to handle Ethereum transaction signing and sending
  async function signTransactionAndSend() {
    setStatusMessage('Processing...');
    try {
      // Connect to Ethereum network via MetaMask
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create an instance of the contract
      const sequencerInboxContract = new ethers.Contract(sequencerInboxAddress, SequencerInboxABI, signer);

      // Call the setIsBatchPoster function on the contract and sign the transaction
      const isBatchPoster = true;
      const tx = await sequencerInboxContract.setIsBatchPoster(ethAddress, isBatchPoster);

      // Send the transaction to the network and wait for the receipt
      const receipt = await tx.wait();
      setStatusMessage(`Transaction successful! The account address ${ethAddress} is now a Batch Poster`);
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('Error: Unable to process transaction');
    }
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
        <button className={styles.button} onClick={signTransactionAndSend}>
          Sign and Send Transaction
        </button>
        <p className={styles.statusMessage}>{statusMessage}</p>
      </div>
    </div>
  );
}

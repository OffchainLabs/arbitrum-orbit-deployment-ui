import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import RollupAdminLogicABIJSON from '../ethereum/RollupAdminLogic.json';
import styles from '../styles/SetValidator.module.css'; 
import Image from "next/image";

const RollupAdminLogicABI = RollupAdminLogicABIJSON.abi;
declare let window: Window & { ethereum: any };

interface AddressInput {
  address: string;
}

const SetValidator = () => {
  const staker = ethers.Wallet.createRandom();
  const stakerAddress = staker.address;
  const stakerPrivateKey = staker.privateKey;

  const [rollupAddress, setRollupAddress] = useState('');
  const [numAddresses, setNumAddresses] = useState(0);
  const [addressInputs, setAddressInputs] = useState<AddressInput[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [showBatchPosterButton, setShowBatchPosterButton] = useState(false);

  useEffect(() => {
    const rollupDataString = localStorage.getItem('rollupData');
    if (rollupDataString) {
      const rollupData = JSON.parse(rollupDataString);
      if (rollupData && rollupData.chain["info-json"][0].rollup) {
        setRollupAddress(rollupData.chain["info-json"][0].rollup.rollup);
      }
      // Update the private key of staker in the rollupData and store it back in local storage
      rollupData.node.staker["parent-chain-wallet"]["private-key"] = stakerPrivateKey;
      localStorage.setItem('rollupData', JSON.stringify(rollupData));
    }
    if (rollupDataString) {
      const rollupData = JSON.parse(rollupDataString);
      console.log('Rollup data:', rollupData);
    }
    if (rollupAddress === null) {
      console.error('Error: Unable to find rollup address');
    }
  }, []);
  

  const handleAddressCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (count > 0) {
      setNumAddresses(count + 1);
      setAddressInputs([{ address: stakerAddress }, ...Array.from({ length: count }, () => ({ address: ''}))]);
    }
  };

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => { 
    const newInputs = [...addressInputs];
    newInputs[index].address = e.target.value;
    setAddressInputs(newInputs);
  };


  const handleSubmit = async () => {
    setIsLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const rollupAdminLogic = new ethers.Contract(
      rollupAddress, 
      RollupAdminLogicABI,
      signer
    );

    const validators = addressInputs.map((input) => input.address);
    const bools = Array(addressInputs.length).fill(true);

    try {
      const tx = await rollupAdminLogic.setValidator(validators, bools);
      await tx.wait();
      alert('Transaction successful. Validator set changed!');
      setShowBatchPosterButton(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Transaction failed');
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <Image
          className={styles.logo} 
          src="/logo.svg"
          alt="Logo"
          width={250}
          height={250}
          />
      <h1 className={styles.title}>Set Validator</h1>
      <div className={styles.form}>
        <input
          className={styles.input}
          type="number"
          placeholder="Number of addresses"
          onChange={handleAddressCount}
        />
        {addressInputs.map((input, index) => (
          <div key={index}>
            <input
              className={styles.input}
              type="text"
              placeholder={`Address ${index + 1}`}
              value={input.address}
              onChange={(e) => index !== 0 ? handleAddressInput(e, index) : null}
              readOnly={index === 0}
            />
          </div>
        ))}

{!showBatchPosterButton && (
  <button className={styles.button} onClick={handleSubmit} disabled={isLoading}>
    {isLoading ? 'Loading...' : 'Submit'}
  </button>
)}
        {showBatchPosterButton && (
          <button className={styles.button} onClick={() => window.open(`/batchPoster`, '_blank')}>
            Set Batch Poster
          </button>
        )}
      </div>
    </div>
  );
};

export default SetValidator;

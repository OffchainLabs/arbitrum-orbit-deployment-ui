import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import RollupAdminLogicABIJSON from '../ethereum/RollupAdminLogic.json';
import styles from '../styles/SetValidator.module.css';

const RollupAdminLogicABI = RollupAdminLogicABIJSON.abi;
declare let window: Window & { ethereum: any };

interface AddressInput {
  address: string;
}

const staker = ethers.Wallet.createRandom();
const stakerPrivateKey = staker.privateKey;
const stakerAddress = staker.address;

export const SetValidator = ({ onDone }: { onDone: () => void }) => {
  const [rollupAddress, setRollupAddress] = useState('');
  const [addressInputs, setAddressInputs] = useState<AddressInput[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBatchPosterButton, setShowBatchPosterButton] = useState(false);

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
    if (count >= 1) {
      const additionalInputs =
        count > 1 ? Array.from({ length: count - 1 }, () => ({ address: '' })) : [];

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

  const handleSubmit = async () => {
    setIsLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const rollupAdminLogic = new ethers.Contract(rollupAddress, RollupAdminLogicABI, signer);

    const validators = addressInputs.map((input) => input.address);
    const bools = Array(addressInputs.length).fill(true);

    try {
      const tx = await rollupAdminLogic.setValidator(validators, bools);
      await tx.wait();
      alert('Transaction successful. Validator set changed!');
      onDone();
      // setShowBatchPosterButton(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Transaction failed');
    }

    setIsLoading(false);
  };

  return (
    <>
      <label htmlFor="numberOfValidators">Number of Validators</label>
      <input
        className={styles.input}
        name="numberOfValidators"
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
            onChange={(e) => (index !== 0 ? handleAddressInput(e, index) : null)}
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
    </>
  );
};

export default SetValidator;

import { useState } from 'react';
import { ethers } from 'ethers';
import RollupAdminLogicABIJSON from '../ethereum/RollupAdminLogic.json';
import styles from '../styles/SetValidator.module.css'; 
import { useRouter } from 'next/router';
import Image from "next/image";

const RollupAdminLogicABI = RollupAdminLogicABIJSON.abi;
declare let window: Window & { ethereum: any };

interface AddressInput {
  address: string;
  isChecked: boolean;
}

const SetValidator = () => {
  const router = useRouter();
  const rollupAddress = router.query.rollupAddress as string;
  const [numAddresses, setNumAddresses] = useState(0);
  const [addressInputs, setAddressInputs] = useState<AddressInput[]>([]); 
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (count > 0) {
      setNumAddresses(count);
      setAddressInputs(Array.from({ length: count }, () => ({ address: '', isChecked: false })));
    }
  };

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => { 
    const newInputs = [...addressInputs];
    newInputs[index].address = e.target.value;
    setAddressInputs(newInputs);
  };

  const handleCheckmark = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newInputs = [...addressInputs];
    newInputs[index].isChecked = e.target.checked;
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
    const bools = addressInputs.map((input) => input.isChecked);

    try {
      const tx = await rollupAdminLogic.setValidator(validators, bools);
      await tx.wait();
      alert('Transaction successful. Validator set changed!');
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
              onChange={(e) => handleAddressInput(e, index)}
            />
            <input
              type="checkbox"
              checked={input.isChecked}
              onChange={(e) => handleCheckmark(e, index)}
            />
          </div>
        ))}
        <button className={styles.button} onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};


export default SetValidator;

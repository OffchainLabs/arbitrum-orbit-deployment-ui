// Importing necessary dependencies and files
import { useState,useEffect } from "react";
import { ethers } from "ethers";
import RollupCreator from "../ethereum/RollupCreator.json";
import RollupCore from "../ethereum/RollupCore.json";
import styles from "../styles/DeployRollup.module.css";
import { RollupConfig } from "./rollupConfigInput";
import { useRouter } from "next/router"; 
import Image from "next/image";

// Extend Window object to include the ethereum property for MetaMask
declare let window: Window & { ethereum: any };

// Define the RollupData type
type RollupData = {
  rollupAddress?: string;
  inboxAddress?: string;
  adminProxy?: string;
  sequencerInbox?: string;
  bridge?: string;
  utils?: string;
  validatorWalletCreator?: string;
  blockNumber?: number;
};

// Function to update local storage with new rollup data
function updateLocalStorage(data: RollupData) {
  const currentData = localStorage.getItem('rollupData');
  const updatedData = currentData ? JSON.parse(currentData) : {};

  Object.assign(updatedData, data);

  localStorage.setItem('rollupData', JSON.stringify(updatedData));
}

// The DeployRollup component
const DeployRollup = () => {

  // Define hooks and state variables
  const router = useRouter();
  const [rollupConfig, setRollupConfig] = useState<RollupConfig | null>(null);

  // useEffect to parse and set rollup configuration from URL query parameters
  useEffect(() => {
    if (router.query.rollupConfig) {
      const parsedConfig = JSON.parse(router.query.rollupConfig as string);
      console.log("Parsed rollupConfig:", parsedConfig);
      setRollupConfig(parsedConfig);
    }
  }, [router.query]);
  

  const [rollupAddress, setRollupAddress] = useState('');
  const [inboxAddress, setInboxAddress] = useState('');
  const [adminProxy, setAdminProxy] = useState('');
  const [sequencerInbox, setSequencerInbox] = useState('');
  const [bridge, setBridge] = useState('');
  const [utils, setUtils] = useState('');
  const [validatorWalletCreator, setValidatorWalletCreator] = useState('');
  const [blockNumber, setBlockNumber] = useState(0);

  const handleSaveRollupConfig = (config: any) => {
    setRollupConfig(config);
  };
  const handleSetBatchPoster = () => {
    window.open(`/batchPoster?sequencerInbox=${sequencerInbox}`, '_blank');
  };
  
  const handleSetValidators = () => {
    window.open(`/setValidators?rollupAddress=${rollupAddress}`, '_blank');
  };
  
  // The main function to deploy the rollup
  async function main() {
  // getting the provider and signer from wallet
  if (!window.ethereum) {
    throw new Error('Please install MetaMask');
  }
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
    try {
      if (!rollupConfig) {
        console.error('Please provide a rollup config before deploying');
        return;
      }
      const rollupCreatorAddress = '0x716590405B9F6F597090fc0daEf4041bB6C23525'; //On Arb Goerli, so need to change it for other networks
      const rollupCreator = new ethers.Contract(
        rollupCreatorAddress,
        RollupCreator.abi,
        signer,
      );
      console.log("Going for deployment")
      const createRollupTx = await rollupCreator.createRollup(rollupConfig);
      const createRollupReceipt = await createRollupTx.wait();
      console.log(await createRollupReceipt.events)
      const rollupCreatedEvent = createRollupReceipt.events?.find(
        (event: { event: string }) => event.event === 'RollupCreated',
      );

      if (rollupCreatedEvent) {
        setRollupAddress(rollupCreatedEvent.args?.rollupAddress);
        setInboxAddress(rollupCreatedEvent.args?.inboxAddress);
        setAdminProxy(rollupCreatedEvent.args?.adminProxy);
        setSequencerInbox(rollupCreatedEvent.args?.sequencerInbox);
        setBridge(rollupCreatedEvent.args?.bridge);

        const rollupCore = new ethers.Contract(
          rollupCreatedEvent.args?.rollupAddress,
          RollupCore.abi,
          signer,
        );
        setUtils(await rollupCore.validatorUtils());
        setValidatorWalletCreator(await rollupCore.validatorWalletCreator());
        setBlockNumber(createRollupReceipt.blockNumber);

        updateLocalStorage({
          rollupAddress,
          inboxAddress,
          adminProxy,
          sequencerInbox,
          bridge,
          utils,
          validatorWalletCreator,
          blockNumber,
        });
        
      } else {
        console.error('RollupCreated event not found');
      }
    } catch (error) {
     
        console.error(
            'Deployment failed:',
            error instanceof Error ? error.message : error,
          );
        }
      }
    
      if (!rollupConfig) {
        return (
          <div className={styles.container}>
            <h1 className={styles.title}>
              No rollup configuration found. Please configure the rollup first.
            </h1>
          </div>
        );
      }  

      return (
        <div className={styles.container}>
          <Image
          className={styles.logo} 
          src="/logo.svg"
          alt="Logo"
          width={250}
          height={250}
          />
          <h1 className={styles.title}>Rollup Deployment Results</h1>
          <button className={styles.button} onClick={main}>
            Deploy Rollup
          </button>
          {blockNumber > 0 && (
            <>
          <button className={styles.button} onClick={handleSetBatchPoster}>
            Set Batch Poster
          </button>
          <button className={styles.button} onClick={handleSetValidators}>
            Set Validator(s)
          </button>
              <p className={styles.info}>Rollup address: {rollupAddress}</p>
              <p className={styles.info}>Inbox address: {inboxAddress}</p>
              <p className={styles.info}>Admin Proxy address: {adminProxy}</p>
              <p className={styles.info}>Sequencer Inbox address: {sequencerInbox}</p>
              <p className={styles.info}>Bridge address: {bridge}</p>
              <p className={styles.info}>Utils address: {utils}</p>
              <p className={styles.info}>
                Validator Wallet Creator address: {validatorWalletCreator}
              </p>
              <p className={styles.info}>Block number: {blockNumber}</p>
            </>
          )}
        </div>
      );
    };
    
    export default DeployRollup;
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


export type RollupConfigData = {
  chain: {
    'info-json': Array<{
      'chain-id': number,
      'parent-chain-id': number,
      'chain-name': string,
      'sequencer-url': string,
      'feed-url': string,
      'chain-config': object, 
      'rollup': {
        'bridge': string,
        'inbox': string,
        'sequencer-inbox': string,
        'rollup': string,
        'validator-utils': string,
        'validator-wallet-creator': string,
        'deployed-at': number,
      }
    }>,
    'name': string,
  },
  'parent-chain': {
    'connection': {
      'url': string,
    }
  },
  http: {
    addr: string,
    port: number,
  },
  node: {
    'forwarding-target': string,
    sequencer: {
      enable: boolean,
      dangerous: {
        'no-coordinator': boolean,
      },
      'max-block-speed': string,
    },
    'delayed-sequencer': {
      enable: boolean,
    },
    'batch-poster': {
      enable: boolean,
      'parent-chain-wallet': {
        'private-key': string,
      }
    },
    staker: {
      enable: boolean;
      strategy: string;
      'parent-chain-wallet': {
        'private-key': string,
      }
    },
  },
};

// Function to update local storage with new rollup data
function updateLocalStorage(data: RollupConfigData) {
  const currentData = localStorage.getItem('rollupData');
  let updatedData: any = {};

  if (currentData) {
    updatedData = JSON.parse(currentData);
  }

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


  
  const handleSetValidators = () => {
    window.open('/setValidators', '_blank');
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
        const rollupCore = new ethers.Contract(
          rollupCreatedEvent.args?.rollupAddress,
          RollupCore.abi,
          signer,
        );
        setBlockNumber(createRollupReceipt.blockNumber);
        setRollupAddress(rollupCreatedEvent.args?.rollupAddress);
        setInboxAddress(rollupCreatedEvent.args?.inboxAddress);
        setAdminProxy(rollupCreatedEvent.args?.adminProxy);
        setSequencerInbox(rollupCreatedEvent.args?.sequencerInbox);
        setBridge(rollupCreatedEvent.args?.bridge);
        setUtils(await rollupCore.validatorUtils());
        setValidatorWalletCreator(await rollupCore.validatorWalletCreator());

        const rollupConfigData: RollupConfigData = {
          'chain': {
            'info-json': [{
              'chain-id': rollupConfig.chainId,
              'parent-chain-id': 421613,
              'chain-name': "example-l3",
              'sequencer-url': "http://example.com/OPTIONAL",
              'feed-url': "http://example.com/OPTIONAL",
              'chain-config': {
                'chainId': rollupConfig.chainId,
                'homesteadBlock': 0,
                'daoForkBlock': null,
                'daoForkSupport': true,
                'eip150Block': 0,
                'eip150Hash': "0x0000000000000000000000000000000000000000000000000000000000000000",
                'eip155Block': 0,
                'eip158Block': 0,
                'byzantiumBlock': 0,
                'constantinopleBlock': 0,
                'petersburgBlock': 0,
                'istanbulBlock': 0,
                'muirGlacierBlock': 0,
                'berlinBlock': 0,
                'londonBlock': 0,
                'clique': {
                  'period': 0,
                  'epoch': 0
                },
                'arbitrum': {
                  'EnableArbOS': true,
                  'AllowDebugPrecompiles': false,
                  'DataAvailabilityCommittee': false,
                  'InitialArbOSVersion': 10,
                  'InitialChainOwner': rollupConfig.owner,
                  'GenesisBlockNum': 0
                }
              },
              'rollup': {
                'bridge': rollupCreatedEvent.args.bridge,
                'inbox': rollupCreatedEvent.args.inboxAddress,
                'sequencer-inbox':  rollupCreatedEvent.args.sequencerInbox,
                'rollup': rollupCreatedEvent.args.rollupAddress,
                'validator-utils': await rollupCore.validatorUtils(),
                'validator-wallet-creator': await rollupCore.validatorWalletCreator(),
                'deployed-at': createRollupReceipt.blockNumber
              }
            }],
            'name': "example-l3"
          },
          'parent-chain': {
            'connection': {
              'url': "https://goerli-rollup.arbitrum.io/rpc",
            },
          },
          'http': {
            'addr': "0.0.0.0",
            'port': 8449,
          },
          'node': {
            'forwarding-target': "",
            'sequencer': {
              'enable': true,
              'dangerous': {
                'no-coordinator': true,
              },
              'max-block-speed': "250ms",
            },
            'delayed-sequencer': {
              'enable': true,
            },
            'batch-poster': {
              'enable': true,
              'parent-chain-wallet': {
                'private-key': "1234123412341234123412341234123412341234123412341234123412341234",
              },
            },
            'staker': {
              'enable': true,
              'strategy': "MakeNodes",
              'parent-chain-wallet': {
                'private-key': "1234123412341234123412341234123412341234123412341234123412341234",
              },
            },
          }
        };
        updateLocalStorage(await rollupConfigData);
      } else {
        console.error('RollupCreated event not found');
      }    } catch (error) {
     
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
          {blockNumber <= 0 && (
      <button className={styles.button} onClick={main}>
        Deploy Rollup
      </button>
    )}
          {blockNumber > 0 && (
            <>
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
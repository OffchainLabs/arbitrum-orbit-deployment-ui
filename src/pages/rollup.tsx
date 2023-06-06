// Importing necessary dependencies and files
import { useState,useEffect } from "react";
import { ethers } from "ethers";
import RollupCreator from "../ethereum/RollupCreator.json";
import RollupCore from "../ethereum/RollupCore.json";
import styles from "../styles/DeployRollup.module.css";
import { RollupConfig } from "./rollupConfigInput";
import { useRouter } from "next/router"; 
import Image from "next/image";
import {RollupConfigData} from "../types/rollupConfigDataType";
import {L3Config} from "../types/l3ConfigType";

// Extend Window object to include the ethereum property for MetaMask
declare let window: Window & { ethereum: any };

// Function to update local storage with new rollup data and l3 data
function updateLocalStorage(data: RollupConfigData, l3config: L3Config) {
  const currentData = localStorage.getItem('rollupData');
  const currentL3Config = localStorage.getItem('l3Config');
  let updatedData: any = {};
  let updatedL3Config: any = {};

  if (currentData) {
    updatedData = JSON.parse(currentData);
  }
  if (currentL3Config) {
    updatedL3Config = JSON.parse(currentL3Config);
  }

  Object.assign(updatedData, data);
  Object.assign(updatedL3Config, l3config);

  localStorage.setItem('rollupData', JSON.stringify(updatedData));
  localStorage.setItem('l3Config', JSON.stringify(updatedL3Config));
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
  
  // Defining L3 config
  const l3Config: L3Config = {
    minL2BaseFee: 100000000,
    networkFeeReceiver: await signer.getAddress(),
    infrastructureFeeCollector: await signer.getAddress(),
    batchPoster: '', 
    staker: '', 
    chainOwner: rollupConfig ? rollupConfig.owner : '',
    inboxAddress: ''
  };  
    try {
      if (!rollupConfig) {
        console.error('Please provide a rollup config before deploying');
        return;
      }
      const rollupCreatorAddress = '0xa9259274263aed9090952507537DDc681619EDcA'; //On Arb Goerli, so need to change it for other networks
      const rollupCreator = new ethers.Contract(
        rollupCreatorAddress,
        RollupCreator.abi,
        signer,
      );

      //////
      let rollupConfigData: RollupConfigData = {
        'chain': {
          'info-json': [{
            'chain-id': Number(rollupConfig.chainId),
            'parent-chain-id': 421613,
            'chain-name': "example-l3",
            'chain-config': {
              'chainId': Number(rollupConfig.chainId),
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
              'bridge': '',
              'inbox': '',
              'sequencer-inbox':  '',
              'rollup': '',
              'validator-utils':'',
              'validator-wallet-creator': '',
              'deployed-at': 0
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
              'private-key': "",
            },
          },
          'staker': {
            'enable': true,
            'strategy': "MakeNodes",
            'parent-chain-wallet': {
              'private-key': "",
            },
          },
        }
      };
      ///////
      ///////
      const chainConfig : string = JSON.stringify(rollupConfigData.chain["info-json"][0]["chain-config"]);
      console.log(rollupConfigData.chain["info-json"][0]["chain-config"])
      rollupConfig.chainConfig = chainConfig;
      console.log(chainConfig)
      console.log("Going for deployment")
      console.log(rollupConfig)
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
         rollupConfigData = {
          'chain': {
            'info-json': [{
              'chain-id': rollupConfig.chainId,
              'parent-chain-id': 421613,
              'chain-name': "example-l3",
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
        l3Config.inboxAddress = rollupCreatedEvent.args.inboxAddress
        updateLocalStorage(await rollupConfigData, l3Config);
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

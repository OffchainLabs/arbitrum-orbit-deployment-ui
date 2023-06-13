import { ethers } from 'ethers';
import { Signer } from '@ethersproject/abstract-signer';

import { RollupConfig } from '@/components/RollupConfigInput';
import { L3Config } from '@/types/l3ConfigType';
import { RollupConfigData } from '@/types/rollupConfigDataType';

import RollupCore from '@/ethereum/RollupCore.json';
import RollupCreator from '@/ethereum/RollupCreator.json';
import { RollupContracts } from '@/types/RollupContracts';

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

type DeployRollupProps = {
  rollupConfig: RollupConfig;
  signer: Signer;
};

export async function deployRollup({
  rollupConfig,
  signer,
}: DeployRollupProps): Promise<RollupContracts> {
  // Defining L3 config
  const l3Config: L3Config = {
    chainOwner: '',
    rollup: '',
    inbox: '',
    outbox: '',
    adminProxy: '',
    sequencerInbox: '',
    bridge: '',
    utils: '',
    validatorWalletCreator: '',
    deployedAtBlockNumber: 0,
    minL2BaseFee: 100000000,
    networkFeeReceiver: await signer.getAddress(),
    infrastructureFeeCollector: await signer.getAddress(),
    batchPoster: '',
    staker: '',
    chainName:'',
    chainId: 0
  };

  // On Arbitrum Goerli, so need to change it for other networks
  const rollupCreatorAddress = '0x0992DCafaCe5C60693EEf55E2788D5F8C2dEB995';
  const rollupCreator = new ethers.Contract(rollupCreatorAddress, RollupCreator.abi, signer);

  let rollupConfigData: RollupConfigData = {
    'chain': {
      'info-json': [
        {
          'chain-id': Number(rollupConfig.chainId),
          'parent-chain-id': 421613,
          'chain-name': rollupConfig.chainName,
          'chain-config': {
            chainId: Number(rollupConfig.chainId),
            homesteadBlock: 0,
            daoForkBlock: null,
            daoForkSupport: true,
            eip150Block: 0,
            eip150Hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            eip155Block: 0,
            eip158Block: 0,
            byzantiumBlock: 0,
            constantinopleBlock: 0,
            petersburgBlock: 0,
            istanbulBlock: 0,
            muirGlacierBlock: 0,
            berlinBlock: 0,
            londonBlock: 0,
            clique: {
              period: 0,
              epoch: 0,
            },
            arbitrum: {
              EnableArbOS: true,
              AllowDebugPrecompiles: false,
              DataAvailabilityCommittee: false,
              InitialArbOSVersion: 10,
              InitialChainOwner: rollupConfig.owner,
              GenesisBlockNum: 0,
            },
          },
          'rollup': {
            'bridge': '',
            'inbox': '',
            'sequencer-inbox': '',
            'rollup': '',
            'validator-utils': '',
            'validator-wallet-creator': '',
            'deployed-at': 0,
          },
        },
      ],
      'name': rollupConfig.chainName,
    },
    'parent-chain': {
      connection: {
        url: 'https://goerli-rollup.arbitrum.io/rpc',
      },
    },
    'http': {
      addr: '0.0.0.0',
      port: 8449,
      vhosts: '*',
      corsdomain: '*',
      api: ['eth', 'net', 'web3', 'arb', 'debug'],
    },
    'node': {
      'forwarding-target': '',
      'sequencer': {
        'enable': true,
        'dangerous': {
          'no-coordinator': true,
        },
        'max-block-speed': '250ms',
      },
      'delayed-sequencer': {
        enable: true,
      },
      'batch-poster': {
        'enable': true,
        'parent-chain-wallet': {
          'private-key': '',
        },
      },
      'staker': {
        'enable': true,
        'strategy': 'MakeNodes',
        'parent-chain-wallet': {
          'private-key': '',
        },
      },
      'caching': {
        archive: true,
      },
    },
  };

  const chainConfig: string = JSON.stringify(
    rollupConfigData.chain['info-json'][0]['chain-config'],
  );
  rollupConfig.chainConfig = chainConfig;
  console.log(chainConfig);
  console.log('Going for deployment');

  const createRollupTx = await rollupCreator.createRollup(rollupConfig);
  const createRollupTxReceipt = await createRollupTx.wait();
  const createRollupTxReceiptEvents = createRollupTxReceipt.events ?? [];

  const rollupCreatedEvent = createRollupTxReceiptEvents.find(
    (event: { event: string }) => event.event === 'RollupCreated',
  );

  if (!rollupCreatedEvent) {
    throw new Error('RollupCreated event not found');
  }

  const rollupCore = new ethers.Contract(
    rollupCreatedEvent.args.rollupAddress,
    RollupCore.abi,
    signer,
  );

  const rollupContracts: RollupContracts = {
    rollup: rollupCreatedEvent.args.rollupAddress,
    inbox: rollupCreatedEvent.args.inboxAddress,
    outbox: await rollupCore.outbox(),
    adminProxy: rollupCreatedEvent.args.adminProxy,
    sequencerInbox: rollupCreatedEvent.args.sequencerInbox,
    bridge: rollupCreatedEvent.args.bridge,
    utils: await rollupCore.validatorUtils(),
    validatorWalletCreator: await rollupCore.validatorWalletCreator(),
    deployedAtBlockNumber: createRollupTxReceipt.blockNumber,
  };

  rollupConfigData.chain['info-json'][0].rollup = {
    'bridge': rollupContracts.bridge,
    'inbox': rollupContracts.inbox,
    'sequencer-inbox': rollupContracts.sequencerInbox,
    'rollup': rollupContracts.rollup,
    'validator-utils': rollupContracts.utils,
    'validator-wallet-creator': rollupContracts.validatorWalletCreator,
    'deployed-at': rollupContracts.deployedAtBlockNumber,
  };

  l3Config.rollup= rollupCreatedEvent.args.rollupAddress;
  l3Config.inbox = rollupCreatedEvent.args.inboxAddress;
  l3Config.outbox =  await rollupCore.outbox();
  l3Config.adminProxy = rollupCreatedEvent.args.adminProxy;
  l3Config.sequencerInbox = rollupCreatedEvent.args.sequencerInbox;
  l3Config.bridge = rollupCreatedEvent.args.bridge;
  l3Config.utils = await rollupCore.validatorUtils();
  l3Config.validatorWalletCreator = await rollupCore.validatorWalletCreator();
  l3Config.deployedAtBlockNumber = createRollupTxReceipt.blockNumber;
  l3Config.chainOwner = rollupConfig.owner;
  l3Config.chainId = Number(rollupConfig.chainId);
  l3Config.chainName = rollupConfig.chainName;

  updateLocalStorage(rollupConfigData, l3Config);

  return rollupContracts;
}

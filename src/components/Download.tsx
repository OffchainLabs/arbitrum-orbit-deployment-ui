import Image from 'next/image';
import { useEffect, useState } from 'react';
import { L3Config } from '@/types/l3ConfigType';
import { RollupConfigData } from '@/types/rollupConfigDataType';
import { CodeComponent } from './CodeComponent';
import { StepTitle } from './StepTitle';
import { useClipboard } from 'use-clipboard-copy';

// Function to remove unwanted fields
const removeFields = (obj: any, fieldsToRemove: string[]): any => {
  let newObj = JSON.parse(JSON.stringify(obj));

  fieldsToRemove.forEach((field) => {
    if (newObj.hasOwnProperty(field)) {
      delete newObj[field];
    }
  });

  return newObj;
};

// Modifying the parts of 'rollupData' which is needed for configuration
const removeNestedFields = (obj: any): any => {
  let newObj = JSON.parse(JSON.stringify(obj)); // Deep clone the original object

  if (newObj.chain && newObj.chain['info-json']) {
    if (typeof newObj.chain['info-json'] === 'string') {
      newObj.chain['info-json'] = JSON.parse(newObj.chain['info-json']); // Parse the stringified JSON
    }

    // Stringify the entire 'info-json' object
    newObj.chain['info-json'] = JSON.stringify(newObj.chain['info-json']);
  }

  // Check and update 'private-key' in 'staker'
  if (newObj.node && newObj.node.staker && newObj.node.staker['parent-chain-wallet']) {
    let privateKey = newObj.node.staker['parent-chain-wallet']['private-key'];
    if (privateKey.startsWith('0x')) {
      newObj.node.staker['parent-chain-wallet']['private-key'] = privateKey.slice(2);
    }
  }

  // Check and update 'private-key' in 'batch-poster'
  if (
    newObj.node &&
    newObj.node['batch-poster'] &&
    newObj.node['batch-poster']['parent-chain-wallet']
  ) {
    let privateKey = newObj.node['batch-poster']['parent-chain-wallet']['private-key'];
    if (privateKey.startsWith('0x')) {
      newObj.node['batch-poster']['parent-chain-wallet']['private-key'] = privateKey.slice(2);
    }
  }

  return newObj;
};

export function Download() {
  const [data, setData] = useState<RollupConfigData | null>(null);
  const [l3Config, setL3Config] = useState<L3Config | null>(null);

  const unwantedFields = [
    'inboxAddress',
    'adminProxy',
    'sequencerInbox',
    'bridge',
    'utils',
    'validatorWalletCreator',
    'blockNumber',
    'rollupAddress',
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rollupData = localStorage.getItem('rollupData');
      if (rollupData) {
        let parsedData = JSON.parse(rollupData);
        let cleanedData = removeFields(parsedData, unwantedFields);
        cleanedData = removeNestedFields(cleanedData);
        setData(cleanedData);
      }

      const l3ConfigData = localStorage.getItem('l3Config');

      if (l3ConfigData) {
        setL3Config(JSON.parse(l3ConfigData));
      }
    }
  }, []);

  if (!data) {
    return (
      <div>
        <Image src="/logo.svg" alt="Logo" width={250} height={250} />
        <h1>No rollup data found.</h1>
      </div>
    );
  }

  const dataWithParsedInfoJson = () => {
    const parsedData = JSON.parse(JSON.stringify(data));
    const infoJson = JSON.parse(parsedData.chain['info-json']);
    parsedData.chain['info-json'] = infoJson;
    return parsedData;
  };

  return (
    <>
      <StepTitle>Download Config</StepTitle>
      <div className="mx-0 my-2 grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-bold">Rollup Config</h4>
          <CodeComponent
            data={data}
            fileName="nodeConfig.json"
            transformDataFunc={dataWithParsedInfoJson}
          />
        </div>
        <div>
          <h4 className="font-bold">L3 Config</h4>
          <CodeComponent data={l3Config} fileName="orbitSetupScriptConfig.json" />
        </div>
      </div>
    </>
  );
}

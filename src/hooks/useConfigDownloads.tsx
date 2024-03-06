import { NodeConfig } from '@arbitrum/orbit-sdk';

import { L3Config } from '@/types/L3Config';
import { useEffect, useState } from 'react';
import JSZip from 'jszip';

export const useConfigDownloads = () => {
  const [rollupConfigData, setRollupConfigData] = useState<NodeConfig | null>(null);
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
        setRollupConfigData(cleanedData);
      }

      const l3ConfigData = localStorage.getItem('l3Config');

      if (l3ConfigData) {
        setL3Config(JSON.parse(l3ConfigData));
      }
    }
  }, []);

  const dataWithParsedInfoJson = () => {
    const parsedData = JSON.parse(JSON.stringify(rollupConfigData));
    const infoJson = JSON.parse(parsedData.chain['info-json']);
    parsedData.chain['info-json'] = infoJson;
    return parsedData;
  };

  const downloadJSON = (dataToDownload: any, fileName: string) => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  };

  const downloadRollupConfig = () => downloadJSON(rollupConfigData, 'nodeConfig.json');

  const downloadL3Config = () => downloadJSON(l3Config, 'orbitSetupScriptConfig.json');

  const downloadZippedConfigs = () => {
    const zip = new JSZip();
    zip.file('nodeConfig.json', JSON.stringify(rollupConfigData, null, 2));
    zip.file('orbitSetupScriptConfig.json', JSON.stringify(l3Config, null, 2));

    zip.generateAsync({ type: 'blob' }).then((file) => {
      const element = document.createElement('a');
      element.href = URL.createObjectURL(file);
      element.download = 'orbit-config.zip';
      document.body.appendChild(element);
      element.click();
    });
  };

  return {
    rollupConfigDownloadData: rollupConfigData,
    rollupConfigDisplayData: rollupConfigData ? dataWithParsedInfoJson() : '',
    l3Config,
    downloadJSON,
    downloadRollupConfig,
    downloadL3Config,
    downloadZippedConfigs,
  };
};

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

  return newObj;
};

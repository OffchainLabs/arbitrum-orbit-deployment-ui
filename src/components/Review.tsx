import { useState, useEffect } from 'react';
import Image from 'next/image';

import { RollupConfigData } from '@/types/rollupConfigDataType';
import { L3Config } from '@/types/l3ConfigType';

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
  if (newObj.node && newObj.node['batch-poster'] && newObj.node['batch-poster']['parent-chain-wallet']) {
    let privateKey = newObj.node['batch-poster']['parent-chain-wallet']['private-key'];
    if (privateKey.startsWith('0x')) {
      newObj.node['batch-poster']['parent-chain-wallet']['private-key'] = privateKey.slice(2);
    }
  }

  return newObj;
};



export function Review() {
  const [data, setData] = useState<RollupConfigData | null>(null);
  const [l3Config, setL3Config] = useState<L3Config | null>(null);
  const [showData, setShowData] = useState(false);
  const [showL3Config, setShowL3Config] = useState(false);

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

  const downloadJSON = (dataToDownload: RollupConfigData | L3Config | null, fileName: string) => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
};

  const toggleShowData = () => {
    setShowData(!showData);
  };

  if (!data) {
    return (
      <div>
        <Image src="/logo.svg" alt="Logo" width={250} height={250} />
        <h1>No rollup data found.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-l3-chain/orbit-quickstart`}
        className="text-lg font-bold uppercase text-[#1366C1] underline"
      >
        Open supporting documentation for this flow
      </a>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => downloadJSON(data, 'config.json')}
          className="w-full rounded-lg bg-[#243145] px-3 py-2 text-2xl text-white"
        >
          Download Rollup JSON
        </button>
        <button
          onClick={toggleShowData}
          className="w-full rounded-lg border border-[#243145] px-3 py-2 text-2xl text-[#243145]"
        >
          Show/Hide Rollup JSON
        </button>
        {showData && (
          <pre className="overflow-auto rounded-lg border border-[#243145] px-3 py-2">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        <button
          onClick={() => downloadJSON(l3Config, 'l3Config.json')}
          className="w-full rounded-lg bg-[#243145] px-3 py-2 text-2xl text-white"
        >
          Download L3Config JSON
        </button>
        <button
          onClick={() => setShowL3Config(!showL3Config)}
          className="w-full rounded-lg border border-[#243145] px-3 py-2 text-2xl text-[#243145]"
        >
          Show/Hide L3Config JSON
        </button>
        {showL3Config && (
          <pre className="overflow-auto rounded-lg border border-[#243145] px-3 py-2">
            {JSON.stringify(l3Config, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

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

//for removing other parts
const removeNestedFields = (obj: any): any => {
  let newObj = JSON.parse(JSON.stringify(obj)); // Deep clone the original object

  if (newObj.chain && typeof newObj.chain['info-json'] === 'string') {
    newObj.chain['info-json'] = JSON.parse(newObj.chain['info-json']); // Parse the stringified JSON
  }

  if (newObj.chain && newObj.chain['info-json']) {
    newObj.chain['info-json'].forEach((item: any) => {
      if (item.hasOwnProperty('sequencer-url')) {
        delete item['sequencer-url'];
      }
      if (item.hasOwnProperty('feed-url')) {
        delete item['feed-url'];
      }
    });
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
    <div className="flex flex-col gap-2">
      <button
        onClick={() => downloadJSON(data, 'rollupData.json')}
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
  );
}

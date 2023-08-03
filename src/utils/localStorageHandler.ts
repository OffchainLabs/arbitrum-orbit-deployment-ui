import { L3Config } from '@/types/l3ConfigType';
import { RollupConfigData } from '@/types/rollupConfigDataType';

// Function to update local storage with new rollup data and l3 data
export function updateLocalStorage(data: RollupConfigData, l3config: L3Config) {
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

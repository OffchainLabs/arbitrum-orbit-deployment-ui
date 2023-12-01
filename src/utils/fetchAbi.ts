import fetch from 'node-fetch';

import { ChainId } from '@/types/ChainId';

type BlockExplorerApi = {
  url: string;
};

const blockExplorerApis: Record<ChainId, BlockExplorerApi> = {
  [ChainId.ArbitrumSepolia]: {
    url: 'https://api-sepolia.arbiscan.io/api',
  },
};

export function getRequestUrl(chainId: ChainId, address: `0x${string}`) {
  return `${blockExplorerApis[chainId].url}?module=contract&action=getabi&format=raw&address=${address}`;
}

export async function fetchAbi(chainId: ChainId, address: `0x${string}`) {
  const requestUrl = getRequestUrl(chainId, address);
  const response = await fetch(requestUrl);
  const responseJson = await response.json();
  return responseJson;
}

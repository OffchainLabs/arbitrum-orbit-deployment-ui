import fetch from 'node-fetch';

import { ChainId } from '@/types/ChainId';

type BlockExplorerProvider = 'arbiscan' | 'blockscout';

type BlockExplorerApi = {
  provider: BlockExplorerProvider;
  url: string;
};

const blockExplorerApis: Record<ChainId, BlockExplorerApi> = {
  [ChainId.ArbitrumGoerli]: {
    provider: 'arbiscan',
    url: 'https://api-goerli.arbiscan.io/api',
  },
  [ChainId.ArbitrumSepolia]: {
    provider: 'blockscout',
    url: 'https://sepolia-explorer.arbitrum.io/api',
  },
};

export function getRequestUrl(chainId: ChainId, address: `0x${string}`) {
  return `${blockExplorerApis[chainId].url}?module=contract&action=getabi&format=raw&address=${address}`;
}

export async function fetchAbi(chainId: ChainId, address: `0x${string}`) {
  const requestUrl = getRequestUrl(chainId, address);

  return blockExplorerApis[chainId].provider === 'arbiscan'
    ? fetchAbiFromArbiscan(requestUrl)
    : fetchAbiFromBlockscout(requestUrl);
}

export async function fetchAbiFromArbiscan(url: string) {
  const response = await fetch(url);
  const responseJson = await response.json();

  return responseJson;
}

export async function fetchAbiFromBlockscout(url: string) {
  const response = await fetch(url);
  const responseJson = await response.json();

  return JSON.parse((responseJson as any).result);
}

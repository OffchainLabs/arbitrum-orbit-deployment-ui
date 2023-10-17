import { defineConfig } from '@wagmi/cli';
import { fetch } from '@wagmi/cli/plugins';
import axios from 'axios';

import { ChainId } from '@/types/ChainId';

async function request(contract: { address: Record<number, `0x${string}`> }) {
  function getAbiRequestUrl(chainId: ChainId, address: string) {
    if (chainId === ChainId.ArbitrumGoerli) {
      return `https://api-goerli.arbiscan.io/api?module=contract&action=getabi&address=${address}&format=raw`;
    }

    return `https://sepolia-explorer.arbitrum.io/api?module=contract&action=getabi&address=${address}`;
  }

  const [{ data: arbiscanResponse }, { data: blockscoutResponse }] = await Promise.all(
    Object.entries(contract.address)
      //
      .map(([chainId, address]) => axios(getAbiRequestUrl(Number(chainId), address))),
  );

  if (JSON.stringify(arbiscanResponse) !== blockscoutResponse.result) {
    throw new Error(`ABIs don't match!`);
  }

  const [chainId, address] = Object.entries(contract.address)[0];

  return { url: getAbiRequestUrl(Number(chainId), address) };
}

export default defineConfig({
  out: 'src/generated.ts',
  plugins: [
    fetch({
      cacheDuration: 1,
      contracts: [
        {
          name: 'RollupCreator',
          address: {
            [ChainId.ArbitrumGoerli]: '0xB3f62C1c92D5224d0EC3A8d1efc8a44495B12BEc',
            [ChainId.ArbitrumSepolia]: '0x8f6C1B4d75fA3a0D43ca750F308b1F3DDA8d92F7',
          },
        },
      ],
      request,
    }),
  ],
});

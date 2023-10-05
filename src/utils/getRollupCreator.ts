import { ChainId } from '@/types/ChainId';

const rollupCreator: {
  [key: string]: `0x${string}`;
} = {
  arbitrumGoerli: '0x5Bbc71b2C7E5B01dc4D8b337059f0F6dEF0FDF3F',
  // todo: update arb sepolia address to latest version
  arbitrumSepolia: '0x5e136cdb8d442EB3BB61f04Cb64ab5D3CE01c564',
};

export function getRollupCreator(chainId: ChainId): `0x${string}` {
  switch (chainId) {
    case ChainId.ArbitrumGoerli:
      return rollupCreator.arbitrumGoerli;

    case ChainId.ArbitrumSepolia:
      return rollupCreator.arbitrumSepolia;
  }
}

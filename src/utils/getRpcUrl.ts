import { goerli, sepolia } from 'wagmi/chains';

import { ChainId } from '@/types/ChainId';

export function getRpcUrl(chainId: number) {
  switch (chainId) {
    case goerli.id:
      return goerli.rpcUrls.default.http[0];

    case sepolia.id:
      return sepolia.rpcUrls.default.http[0];

    case ChainId.ArbitrumGoerli:
      return 'https://goerli-rollup.arbitrum.io/rpc';

    case ChainId.ArbitrumSepolia:
      return 'https://sepolia-rollup.arbitrum.io/rpc';

    default:
      throw new Error(`[getRpcUrl] Unexpected chainId: ${chainId}`);
  }
}

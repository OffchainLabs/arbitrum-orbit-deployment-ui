import { goerli, sepolia } from 'wagmi/chains';

import { ChainId } from '@/types/ChainId';

export function getBlockExplorerUrl(chainId: number) {
  switch (chainId) {
    case goerli.id:
      return goerli.blockExplorers.default.url;

    case sepolia.id:
      return sepolia.blockExplorers.default.url;

    case ChainId.ArbitrumGoerli:
      return 'https://goerli.arbiscan.io';

    case ChainId.ArbitrumSepolia:
      return 'https://sepolia-explorer.arbitrum.io';

    default:
      throw new Error(`[getBlockExplorerUrl] Unexpected chainId: ${chainId}`);
  }
}

import { ChainId } from '@/types/ChainId';

export function getRpcUrl(chainId: number) {
  switch (chainId) {
    case 5:
      return 'https://rpc.ankr.com/eth_goerli';

    case 11155111:
      return 'https://rpc.sepolia.org';

    case ChainId.ArbitrumGoerli:
      return 'https://goerli-rollup.arbitrum.io/rpc';

    case ChainId.ArbitrumSepolia:
      return 'https://sepolia-rollup.arbitrum.io/rpc';

    default:
      throw new Error(`[getRpcUrl] Unexpected chainId: ${chainId}`);
  }
}

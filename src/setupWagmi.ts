'use client';
import { configureChains, createConfig } from 'wagmi';
import { sepolia } from '@wagmi/core/chains';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';

import { ChainId } from '@/types/ChainId';
import { getRpcUrl } from '@/utils/getRpcUrl';
import { getBlockExplorerUrl } from '@/utils/getBlockExplorerUrl';
import { ARBITRUM_SEPOLIA_ICON_URL } from './utils/constants';

const arbitrumSepolia = {
  id: ChainId.ArbitrumSepolia,
  name: 'Arbitrum Sepolia',
  network: 'arbitrum-sepolia',
  iconUrl: ARBITRUM_SEPOLIA_ICON_URL,
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [getRpcUrl(ChainId.ArbitrumSepolia)],
    },
    public: {
      http: [getRpcUrl(ChainId.ArbitrumSepolia)],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: getBlockExplorerUrl(ChainId.ArbitrumSepolia),
    },
  },
  testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    // Ideally, we wouldn't need to register the L1s, but there's currently an issue with WalletConnect v2: https://github.com/wagmi-dev/references/issues/225
    arbitrumSepolia,
    sepolia,
  ],
  [publicProvider()],
);

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const appInfo = {
  appName: 'Arbitrum Orbit',
  projectId,
};

const { wallets } = getDefaultWallets({ ...appInfo, chains });

const connectors = connectorsForWallets(wallets);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains, appInfo, wagmiConfig };

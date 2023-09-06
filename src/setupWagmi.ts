'use client';
import { configureChains, createConfig } from 'wagmi';
import { goerli, arbitrumGoerli, sepolia } from '@wagmi/core/chains';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';

const arbitrumSepolia = {
  id: 421614,
  name: 'Arbitrum Sepolia',
  network: 'arbitrum-sepolia',
  nativeCurrency: {
    name: 'Arbitrum Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    alchemy: {
      http: ['https://arb-sepolia.g.alchemy.com/v2'],
      webSocket: ['wss://arb-sepolia.g.alchemy.com/v2'],
    },
    infura: {
      http: ['https://arbitrum-sepolia.infura.io/v3'],
      webSocket: ['wss://arbitrum-sepolia.infura.io/ws/v3'],
    },
    default: {
      http: ['https://sepolia-rollup.arbitrum.io/rpc'],
    },
    public: {
      http: ['https://sepolia-rollup.arbitrum.io/rpc'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Arbiscan',
      url: 'https://sepolia.arbiscan.io/',
    },
    default: {
      name: 'Arbiscan',
      url: 'https://sepolia.arbiscan.io/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xded9AD2E65F3c4315745dD915Dbe0A4Df61b2320' as `0x${string}`,
      blockCreated: 4139226,
    },
  },
  testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    arbitrumGoerli,
    // Ideally, we wouldn't need to regiter Goerli, but there's currently an issue with WalletConnect v2: https://github.com/wagmi-dev/references/issues/225
    goerli,
    sepolia,
    arbitrumSepolia,
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

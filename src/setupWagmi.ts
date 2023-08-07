'use client';
import { configureChains, createConfig } from 'wagmi';
import { goerli, arbitrumGoerli } from '@wagmi/core/chains';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    arbitrumGoerli,
    // Ideally, we wouldn't need to regiter Goerli, but there's currently an issue with WalletConnect v2: https://github.com/wagmi-dev/references/issues/225
    goerli,
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

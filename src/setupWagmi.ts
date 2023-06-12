import { createClient, configureChains } from 'wagmi';
import { arbitrumGoerli } from '@wagmi/core/chains';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';

const { chains, provider } = configureChains([arbitrumGoerli], [publicProvider()]);

const appInfo = {
  appName: 'Arbitrum Orbit',
};

const { wallets } = getDefaultWallets({
  appName: 'Arbitrum Orbit',
  chains,
});

const connectors = connectorsForWallets(wallets);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { chains, provider, appInfo, wagmiClient };

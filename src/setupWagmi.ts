import { createClient, configureChains } from 'wagmi';
import { arbitrumGoerli } from '@wagmi/core/chains';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';

const { chains, provider } = configureChains([arbitrumGoerli], [publicProvider()]);

const projectId = 'a88549a6f47b1f67f9261ffb345df8ee';

const appInfo = {
  appName: 'Arbitrum Orbit',
  projectId,
};

const { wallets } = getDefaultWallets({ ...appInfo, chains });

const connectors = connectorsForWallets(wallets);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { chains, provider, appInfo, wagmiClient };

import type { AppProps } from 'next/app';
import { QueryParamProvider } from 'use-query-params';
import { NextAdapter } from 'next-query-params';
import queryString from 'query-string';
import { WagmiConfig } from 'wagmi';
import { arbitrumGoerli } from 'wagmi/chains';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';

import '@rainbow-me/rainbowkit/styles.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; // core css
import 'primeicons/primeicons.css'; // icons
import 'primeflex/primeflex.css';

import '@/styles/globals.css';
import { wagmiClient, chains, appInfo } from '@/setupWagmi';
import { spaceGrotesk } from '@/fonts';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryParamProvider
      adapter={NextAdapter}
      options={{
        searchStringToObject: queryString.parse,
        objectToSearchString: queryString.stringify,
        updateType: 'replaceIn',
      }}
    >
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          appInfo={appInfo}
          initialChain={arbitrumGoerli}
          theme={{
            ...lightTheme({
              accentColor: '#243145',
            }),
            fonts: {
              body: spaceGrotesk.style.fontFamily,
            },
          }}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryParamProvider>
  );
}

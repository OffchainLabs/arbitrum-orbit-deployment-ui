import type { AppProps } from 'next/app';
import { QueryParamProvider } from 'use-query-params';
import { NextAdapter } from 'next-query-params';
import queryString from 'query-string';
import { WagmiConfig } from 'wagmi';
import { arbitrumGoerli } from 'wagmi/chains';
import { RainbowKitProvider, ConnectButton, lightTheme } from '@rainbow-me/rainbowkit';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

import '@rainbow-me/rainbowkit/styles.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; // core css
import 'primeicons/primeicons.css'; // icons
import 'primeflex/primeflex.css';

import '@/styles/globals.css';
import { wagmiClient, chains, appInfo } from '@/setupWagmi';
import { spaceGrotesk } from '@/fonts';
import Head from 'next/head';

if (typeof window !== 'undefined' && typeof process.env.NEXT_PUBLIC_POSTHOG_KEY === 'string') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: 'https://app.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV !== 'production') {
        // when in dev, you can see data that would be sent in prod (in devtools)
        posthog.debug();
      }
    },
    // store data in temporary memory that expires with each session
    persistence: 'memory',
    autocapture: true,
    disable_session_recording: true,
  });
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PostHogProvider client={posthog}>
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
            <div className="items flex w-full flex-col" style={spaceGrotesk.style}>
              <Head>
                <title>Arbitrum Orbit Deployment UI</title>
              </Head>
              <header className="flex w-full justify-center">
                <div className="flex w-[1024px] flex-col gap-2 py-4">
                  <div className="flex w-full items-center justify-between">
                    <h1 className="text-2xl font-bold">Arbitrum Orbit</h1>
                    <ConnectButton />
                  </div>
                  <div>
                    <span className="rounded-lg bg-[#FFEED3] px-3 py-2 text-sm text-[#60461F]">
                      This interface is currently intended for local devnet deployment.
                    </span>
                  </div>
                </div>
              </header>

              <Component {...pageProps} />
            </div>
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryParamProvider>
    </PostHogProvider>
  );
}

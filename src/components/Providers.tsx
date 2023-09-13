'use client';

import { spaceGrotesk } from '@/fonts';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { WagmiConfig } from 'wagmi';
import { arbitrumGoerli } from 'wagmi/chains';
import { appInfo, chains, wagmiConfig } from '@/setupWagmi';

import '@rainbow-me/rainbowkit/styles.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'; // icons
import 'primereact/resources/primereact.css'; // core css
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import '@/styles/globals.css';

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

export const Providers = ({ children }: any) => {
  return (
    <PostHogProvider client={posthog}>
      <WagmiConfig config={wagmiConfig}>
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
          {children}{' '}
        </RainbowKitProvider>
      </WagmiConfig>
    </PostHogProvider>
  );
};

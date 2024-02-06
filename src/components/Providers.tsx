'use client';

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { WagmiConfig } from 'wagmi';
import { appInfo, chains, wagmiConfig } from '@/setupWagmi';

import '@rainbow-me/rainbowkit/styles.css';
import 'primeicons/primeicons.css'; // icons
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
          theme={{
            ...darkTheme({
              accentColor: '#31572A',
              borderRadius: 'small',
            }),
          }}
        >
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </PostHogProvider>
  );
};

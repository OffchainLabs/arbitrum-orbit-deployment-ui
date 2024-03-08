import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Metadata } from 'next';
import posthog from 'posthog-js';
import { Providers } from '@/components/Providers';
import { unica77 } from '@/fonts';

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

const metadataInfo = {
  title: 'Arbitrum Orbit Deployment UI',
  description: `Utilize the Orbit chain deployment portal to launch your own devnet Arbitrum Orbit chain. By following these steps, you will have a local devnet chain that hosts EVM-compatible contracts (you will not have a mainnet L2 chain)

We are building the tech and docs that will help you move your project from "local devnet chain that settles to Arbitrum Sepolia" to "public production-ready chain that settles to Arbitrum One or Arbitrum Nova". Stay tuned!`,
};

export const metadata: Metadata = {
  ...metadataInfo,
  twitter: {
    card: 'summary_large_image',
    ...metadataInfo,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={unica77.style} className="px-4">
        <Providers>
          <header className="mx-auto flex max-w-screen-xl justify-end py-6">
            <ConnectButton />
          </header>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}

import type { AppProps } from 'next/app';
import { Space_Grotesk } from 'next/font/google';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; // core css
import 'primeicons/primeicons.css'; // icons
import 'primeflex/primeflex.css';

import '@/styles/globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main style={spaceGrotesk.style}>
      <Component {...pageProps} />
    </main>
  );
}

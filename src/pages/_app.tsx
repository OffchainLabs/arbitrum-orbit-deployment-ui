import type { AppProps } from 'next/app';
import { QueryParamProvider } from 'use-query-params';
import { NextAdapter } from 'next-query-params';
import queryString from 'query-string';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; // core css
import 'primeicons/primeicons.css'; // icons
import 'primeflex/primeflex.css';

import '@/styles/globals.css';
import { spaceGrotesk } from '@/fonts';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main style={spaceGrotesk.style}>
      <QueryParamProvider
        adapter={NextAdapter}
        options={{
          searchStringToObject: queryString.parse,
          objectToSearchString: queryString.stringify,
          updateType: 'replaceIn',
        }}
      >
        <Component {...pageProps} />
      </QueryParamProvider>
    </main>
  );
}

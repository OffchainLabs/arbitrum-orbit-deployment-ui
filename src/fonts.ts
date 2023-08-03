import { Space_Grotesk } from 'next/font/google';
import localFont from 'next/font/local';

export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const unica77 = localFont({
  src: [
    {
      path: '../public/fonts/Unica77LLWeb-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Unica77LLWeb-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/Unica77LLWeb-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Unica77LLWeb-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/Unica77LLWeb-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/fonts/Unica77LLWeb-BlackItalic.woff2',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../public/fonts/Unica77LLWeb-ExtraBlack.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/Unica77LLWeb-ExtraBlackItalic.woff2',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../public/fonts/Unica77LLWeb-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Unica77LLWeb-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/Unica77LLWeb-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Unica77LLWeb-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/Unica77LLWeb-Thin.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/Unica77LLWeb-ThinItalic.woff2',
      weight: '200',
      style: 'italic',
    },
  ],
});

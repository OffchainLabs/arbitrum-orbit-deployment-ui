/** @type {import('tailwindcss').Config} */
module.exports = {
  important: false,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@offchainlabs/cobalt/dist/*.js',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-landing-banner': 'linear-gradient(90deg, #12AAFF 18.22%, #1B4ADD 99.99%)',
      },
      boxShadow: {
        input: '0px 2px 2px rgba(33, 37, 41, 0.06), 0px 0px 1px rgba(33, 37, 41, 0.08)',
      },
      colors: {
        'green': '#32CD32',
        'yellow': '#60461F',
        'darkgrey': '#A9A9A9',
        'grey': '#808080',
        'lightgrey': '#D3D3D3',
        'default-black': '#1a1c1d',
        'blue': '#12aaff',
        'lime-dark': '#31572A',
        'stylus-pink': '#F62674',
      },
      backgroundColor: {
        DEFAULT: '#000000',
      },
      textColor: {
        DEFAULT: '#FFFFFF',
      },
    },
  },
  plugins: [],
  corePlugins: {
    // Override the input text color
    inputTextColor: ({ addBase, theme }) => {
      addBase({
        input: { color: theme('colors.black') },
      });
    },
  },
};

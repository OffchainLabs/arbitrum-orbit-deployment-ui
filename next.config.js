/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: () => [
    {
      source: '/deployment',
      destination: '/',
      permanent: true,
    },
    {
      source: '/deployment/step/(\\d)',
      destination: '/step/chain-type',
      permanent: true,
    },
  ],
};

module.exports = nextConfig;

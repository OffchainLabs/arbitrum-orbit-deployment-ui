/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: () => [
    {
      source: '/deployment',
      destination: '/deployment/step/chain-type',
      permanent: true,
    },
    {
      source: '/deployment/step/(\\d)',
      destination: `/deployment/step/chain-type`,
      permanent: true,
    },
  ],
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: () => [
    {
      source: '/deployment',
      destination: `/deployment/step/chain-type`,
      permanent: true,
    },
    { source: '/deployment/step/1', destination: `/deployment/step/chain-type`, permanent: true },
  ],
};

module.exports = nextConfig;

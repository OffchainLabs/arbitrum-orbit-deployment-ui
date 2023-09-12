/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  redirects: () => [
    {
      source: '/deployment',
      destination: `/deployment/step/1`,
      permanent: true,
    },
  ],
};

module.exports = nextConfig;

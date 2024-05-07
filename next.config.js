const { ADMIN_UI_URL } = process.env;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: () => [
    {
      source: '/deployment/step/(\\d)',
      destination: '/deployment/step/chain-type',
      permanent: true,
    },
  ],
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: `${ADMIN_UI_URL}/admin`,
      },
    ];
  },
};

module.exports = nextConfig;

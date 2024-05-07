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
        source: '/:path*',
        destination: `/:path*`,
      },
      {
        source: '/admin',
        destination: `${ADMIN_UI_URL}/admin`,
      },
      {
        source: '/admin/:path*',
        destination: `${ADMIN_UI_URL}/admin/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

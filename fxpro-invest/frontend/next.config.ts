import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['bluepeak-capital.online', '*.bluepeak-capital.online'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_INTERNAL_URL ?? 'http://backend:4000'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

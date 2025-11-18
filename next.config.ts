import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'todo-app.pioneeralpha.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

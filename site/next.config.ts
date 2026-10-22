import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The engine ships TypeScript source; Next compiles it with the app.
  transpilePackages: ['@kuraykaraaslan/docs'],
};

export default nextConfig;

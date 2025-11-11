import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    domains: [
      'www.google.com',
      'www.linkedin.com',
      'picsum.photos',
      'storage.googleapis.com',
      'firebasestorage.googleapis.com',
    ],
  },
};

export default nextConfig;

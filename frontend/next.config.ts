import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    domains: ['www.google.com', 'www.linkedin.com', 'picsum.photos'], // Add any external image domains here
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['gsap'],
  reactStrictMode: true,
  compress: true,
  // Ensure better compatibility with Sanity
  serverExternalPackages: ['@sanity/client', 'sanity'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    ppr: true,
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
  i18n: {
    locales: ['hr', 'en', 'de', 'pt', 'es', 'it'],
    defaultLocale: 'en',
    localeDetection: true,
  },
};

export default nextConfig;


const nextConfig = {
  output: 'standalone',
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
    localeDetection: false,
  },
};

export default nextConfig;


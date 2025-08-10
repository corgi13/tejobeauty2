// Proper ESM Next.js config with next-intl plugin for App Router
import createNextIntlPlugin from 'next-intl/plugin';

// Point plugin to the i18n config file (relative to project root)
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: standalone' to avoid runtime warning with `next start`.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudinary.com' }
    ]
  }
};

export default withNextIntl(nextConfig);


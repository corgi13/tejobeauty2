import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['hr', 'en', 'de', 'pt', 'es', 'it'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/((?!_next|_vercel|api|order|manifest|robots|sitemap|favicon).*)'],
};



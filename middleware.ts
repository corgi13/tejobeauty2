import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

// Use 'always' so /en stays stable (avoids plugin redirecting /en -> /)
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Redirect root to default locale
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url);
  }
  
  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(hr|en|de|pt|es|it)/:path*']
};
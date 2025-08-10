import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Use 'always' so /en stays stable (avoids plugin redirecting /en -> /)
const intlMiddleware = createMiddleware({
  locales: ['hr', 'en', 'de', 'pt', 'es', 'it'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect root to /en
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/en';
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(hr|en|de|pt|es|it)/:path*']
};



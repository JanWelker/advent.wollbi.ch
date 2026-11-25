import { NextRequest, NextResponse } from 'next/server'

// A fresh nonce per request: Next reads it back out of the request's CSP and
// puts it on its own inline scripts, so no script needs 'unsafe-inline'.
// Styles keep 'unsafe-inline' because React's style attributes take no nonce.
// Umami is the one other origin; Analytics.tsx passes it the nonce.
const ANALYTICS = 'https://analytics.k8s.wlkr.ch'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'
  const csp = [
    "default-src 'none'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    `connect-src 'self' ${ANALYTICS}`,
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    'upgrade-insecure-requests',
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}

// The site only: Payload's admin and API bring their own scripts, and static
// files and prefetches need no policy.
export const config = {
  matcher: [
    {
      source: '/((?!api|admin|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}

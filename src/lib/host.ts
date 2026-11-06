// The public host, for the calendar's UIDs and the flyer's foot. The pod
// sees requests from Envoy, so the request's own host is the fallback only.
export const publicHost = (request: Request) => {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL
  if (configured) return new URL(configured).host
  return request.headers.get('x-forwarded-host') ?? new URL(request.url).host
}

// ?seite=<slug>, the page whose windows block to draw; the home page by default.
export const slugOf = (request: Request) => new URL(request.url).searchParams.get('seite') || 'home'

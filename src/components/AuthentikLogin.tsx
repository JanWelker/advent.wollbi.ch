// The only login there is: local accounts are off. A plain anchor, because the
// authorize endpoint answers with a redirect, not a React Server Component.
export default function AuthentikLogin() {
  return (
    <div style={{ marginTop: 'var(--base)' }}>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a redirect, not a page */}
      <a className="btn btn--style-primary btn--size-large" href="/api/users/oauth/authorize">
        Mit Authentik anmelden
      </a>
    </div>
  )
}

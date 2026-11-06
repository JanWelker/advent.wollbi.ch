import { OAuth2Plugin } from 'payload-oauth2'

// Editors sign in through Authentik with OpenID Connect. The policy binding in
// Authentik decides who gets a code at all; the group check below repeats it,
// so a binding lost in a blueprint edit does not open the admin to every
// account. The client and its secret come from JanWelker/homelab-apps.
const authentik = (process.env.AUTHENTIK_URL || 'https://auth.k8s.wlkr.ch').replace(/\/$/, '')
const clientId = process.env.OIDC_CLIENT_ID || ''
const clientSecret = process.env.OIDC_CLIENT_SECRET || ''

export const EDITOR_GROUP = 'wollbi-editors'

export const authentikPlugin = (serverURL: string) =>
  OAuth2Plugin({
    // Off without a client, so `next build` and a laptop run without one.
    enabled: Boolean(clientId && clientSecret),
    strategyName: 'authentik',
    useEmailAsIdentity: true,
    onUserNotFoundBehavior: 'create',
    serverURL,
    clientId,
    clientSecret,
    providerAuthorizationUrl: `${authentik}/application/o/authorize/`,
    tokenEndpoint: `${authentik}/application/o/token/`,
    scopes: ['openid', 'email', 'profile'],
    pkceEnabled: true,
    getUserInfo: async (accessToken: string) => {
      const response = await fetch(`${authentik}/application/o/userinfo/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!response.ok) throw new Error(`userinfo answered ${response.status}`)
      const info = (await response.json()) as {
        email?: string
        groups?: string[]
        name?: string
        sub?: string
      }
      if (!info.groups?.includes(EDITOR_GROUP)) {
        throw new Error(`${info.email ?? info.sub} is not in ${EDITOR_GROUP}`)
      }
      // Only what the collection stores; the rest of the claims stay out.
      return { email: info.email, sub: info.sub, name: info.name }
    },
    successRedirect: () => '/admin',
    failureRedirect: (req, error) => {
      req.payload.logger.error({ err: error }, 'Authentik login failed')
      return '/admin/login?error=authentik'
    },
  })

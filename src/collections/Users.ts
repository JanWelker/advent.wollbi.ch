import type { CollectionConfig } from 'payload'

// The OK members who edit the site. Authentik is the only way in: there is
// no password here, and the oauth plugin in payload.config.ts creates an
// editor on their first login. Who may log in is the wollbi-editors group in
// Authentik, see JanWelker/homelab-apps.
//
// `email` and `sub` are declared here rather than left to the plugin, which
// adds them only while it is enabled: the schema, and so the migrations, must
// not depend on whether OIDC_CLIENT_SECRET is set.
export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: { disableLocalStrategy: true },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'sub',
      type: 'text',
      index: true,
      admin: { readOnly: true },
      access: { update: () => false },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Name',
    },
  ],
}

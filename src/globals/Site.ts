import type { GlobalConfig } from 'payload'

// What the Pelican SITENAME, SITESUBTITLE and the footer used to be.
export const Site: GlobalConfig = {
  slug: 'site',
  access: { read: () => true },
  label: 'Website',
  fields: [
    { name: 'name', type: 'text', label: 'Titel', required: true },
    { name: 'subtitle', type: 'text', label: 'Untertitel' },
    { name: 'footer', type: 'text', label: 'Fusszeile' },
  ],
}

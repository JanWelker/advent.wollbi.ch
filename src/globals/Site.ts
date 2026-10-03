import type { GlobalConfig } from 'payload'

// What the Pelican SITENAME, SITESUBTITLE and the footer used to be, plus
// what the home page opens with. The OK lives here rather than in a page so
// the home page and the Info page show one list, edited once a year.
export const Site: GlobalConfig = {
  slug: 'site',
  access: { read: () => true },
  label: 'Website',
  fields: [
    { name: 'name', type: 'text', label: 'Titel', required: true },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Untertitel',
      admin: { description: 'Steht in der Fusszeile.' },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Einladung',
      admin: { description: 'Der Satz unter der Überschrift der Startseite.' },
    },
    { name: 'email', type: 'text', label: 'Kontakt-E-Mail', defaultValue: 'advent@wollbi.ch' },
    {
      name: 'team',
      type: 'array',
      label: 'OK',
      labels: { singular: 'Person', plural: 'Personen' },
      fields: [
        {
          name: 'house',
          type: 'text',
          label: 'Hausnummer',
          required: true,
          admin: { description: 'z. B. W7' },
        },
        { name: 'names', type: 'text', label: 'Name(n)', required: true },
      ],
    },
    { name: 'footer', type: 'text', label: 'Fusszeile' },
  ],
}

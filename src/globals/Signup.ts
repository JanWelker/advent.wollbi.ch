import type { GlobalConfig } from 'payload'

// The sign-up for the coming year: which days and whether it is open. Anyone
// can sign up while it is open; /anmelden reads it server-side.
export const Signup: GlobalConfig = {
  slug: 'signup',
  label: 'Anmeldung',
  access: { read: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user) },
  fields: [
    {
      name: 'open',
      type: 'checkbox',
      label: 'Anmeldung offen',
      defaultValue: false,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'firstDay',
          type: 'date',
          label: 'Erster Tag',
          required: true,
          admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd. MMMM yyyy' } },
        },
        {
          name: 'lastDay',
          type: 'date',
          label: 'Letzter Tag',
          required: true,
          admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd. MMMM yyyy' } },
        },
      ],
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Text über dem Formular',
    },
    {
      name: 'qr',
      type: 'ui',
      admin: { components: { Field: '@/components/SignupQR' } },
    },
  ],
}

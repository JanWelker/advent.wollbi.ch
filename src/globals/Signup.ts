import type { GlobalConfig } from 'payload'

import { newCode } from '../lib/signup'

// The sign-up for the coming year: which days, whether it is open, and the
// code the QR code carries. Read by editors only, so the code never reaches
// the public API; /anmelden reads it server-side.
export const Signup: GlobalConfig = {
  slug: 'signup',
  label: 'Anmeldung',
  access: { read: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user) },
  hooks: {
    beforeChange: [
      ({ data }) => {
        data.code = (data.code || newCode()).trim().toUpperCase()
        return data
      },
    ],
  },
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
      name: 'code',
      type: 'text',
      label: 'Code',
      admin: {
        description:
          'Steckt im QR-Code. Für ein neues Jahr leeren und speichern: Es entsteht ein neuer Code, und der alte QR-Code gilt nicht mehr.',
      },
    },
    {
      name: 'qr',
      type: 'ui',
      admin: { components: { Field: '@/components/SignupQR' } },
    },
  ],
}

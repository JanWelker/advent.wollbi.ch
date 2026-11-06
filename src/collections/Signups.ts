import type { CollectionConfig } from 'payload'

import { dayKey, normaliseHouse } from '../lib/signup'

const editors = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

// Who opens a window on which day. The public form at /anmelden writes here;
// the OK edits, moves and deletes rows in /admin. The two rules -- one house
// per day, one day per house -- are unique indexes, so two people taking the
// same day at the same moment cannot both win.
export const Signups: CollectionConfig = {
  slug: 'signups',
  labels: { singular: 'Anmeldung', plural: 'Anmeldungen' },
  access: { read: editors, create: editors, update: editors, delete: editors },
  admin: {
    useAsTitle: 'names',
    defaultColumns: ['date', 'house', 'names', 'contact', 'createdAt'],
    description: 'Ein Fenster pro Tag und ein Tag pro Haus. Die Seite /anmelden schreibt hierher.',
  },
  defaultSort: 'day',
  indexes: [{ fields: ['year', 'house'], unique: true }],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        data.house = normaliseHouse(data.house)
        if (data.date) {
          data.day = dayKey(data.date)
          data.year = Number(data.day.slice(0, 4))
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      label: 'Datum',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'EEEE, d. MMMM yyyy' } },
    },
    {
      name: 'house',
      type: 'text',
      label: 'Hausnummer',
      required: true,
      admin: { description: 'z. B. W43' },
    },
    { name: 'names', type: 'text', label: 'Gastgeber', required: true },
    { name: 'contact', type: 'text', label: 'E-Mail oder Telefon' },
    {
      name: 'note',
      type: 'text',
      label: 'Hinweis',
      admin: { description: 'z. B. «ohne Apéro»' },
    },
    {
      name: 'time',
      type: 'text',
      label: 'Andere Zeit',
      admin: { description: 'Nur wenn es nicht die übliche Zeit für diesen Wochentag ist.' },
    },
    // Derived from `date` in Zurich time, for the unique indexes.
    { name: 'day', type: 'text', required: true, unique: true, admin: { hidden: true } },
    { name: 'year', type: 'number', required: true, admin: { hidden: true } },
  ],
}

import type { Block } from 'payload'

// The shapes the pages are made of. The first three are what the Pelican
// pages were; the rest are the night-street design's sections, as data so
// the OK can change them in /admin without a deploy.

export const Prose: Block = {
  slug: 'prose',
  labels: { singular: 'Text', plural: 'Texte' },
  fields: [{ name: 'content', type: 'richText', required: true }],
}

export const Gallery: Block = {
  slug: 'gallery',
  labels: { singular: 'Bilder', plural: 'Bilder' },
  fields: [
    { name: 'heading', type: 'text', label: 'Überschrift' },
    {
      name: 'images',
      type: 'array',
      label: 'Bilder',
      minRows: 1,
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
  ],
}

export const Download: Block = {
  slug: 'download',
  labels: { singular: 'Download', plural: 'Downloads' },
  fields: [
    { name: 'label', type: 'text', label: 'Beschriftung', required: true },
    { name: 'file', type: 'upload', relationTo: 'media', required: true },
  ],
}

// The year's windows. The weekday and the time follow from the date, so a
// row is only what changes from year to year: when, who and which house.
export const Windows: Block = {
  slug: 'windows',
  labels: { singular: 'Adventsfenster', plural: 'Adventsfenster' },
  fields: [
    { name: 'heading', type: 'text', label: 'Überschrift', defaultValue: 'Wann, wo, bei wem' },
    {
      type: 'row',
      fields: [
        { name: 'weekdayTime', type: 'text', label: 'Zeit Mo–Fr', defaultValue: '19:00' },
        { name: 'weekendTime', type: 'text', label: 'Zeit Sa & So', defaultValue: '17:00' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'calendar', type: 'upload', relationTo: 'media', label: 'Kalenderdatei (.ics)' },
        { name: 'flyer', type: 'upload', relationTo: 'media', label: 'Flyer (PDF)' },
      ],
    },
    {
      name: 'entries',
      type: 'array',
      label: 'Fenster',
      labels: { singular: 'Fenster', plural: 'Fenster' },
      minRows: 1,
      fields: [
        {
          name: 'date',
          type: 'date',
          label: 'Datum',
          required: true,
          admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'EEEE, d. MMMM yyyy' } },
        },
        { name: 'names', type: 'text', label: 'Gastgeber', required: true },
        {
          name: 'house',
          type: 'text',
          label: 'Hausnummer',
          required: true,
          admin: { description: 'z. B. W43' },
        },
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
      ],
    },
  ],
}

export const Callout: Block = {
  slug: 'callout',
  labels: { singular: 'Hinweis', plural: 'Hinweise' },
  fields: [
    { name: 'title', type: 'text', label: 'Titel', required: true },
    { name: 'text', type: 'textarea', label: 'Text' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Bild' },
  ],
}

export const Team: Block = {
  slug: 'team',
  labels: { singular: 'OK', plural: 'OK' },
  fields: [
    { name: 'heading', type: 'text', label: 'Überschrift', defaultValue: 'Euer OK' },
    {
      name: 'note',
      type: 'text',
      label: 'Hinweis',
      admin: { description: 'Die Personen selbst stehen unter Website → OK.' },
    },
  ],
}

export const ArchiveTeaser: Block = {
  slug: 'archiveTeaser',
  labels: { singular: 'Archiv-Vorschau', plural: 'Archiv-Vorschauen' },
  fields: [
    { name: 'heading', type: 'text', label: 'Überschrift', defaultValue: 'Frühere Jahre' },
    { name: 'archiveSlug', type: 'text', label: 'Archivseite (Slug)', defaultValue: 'archiv' },
    { name: 'count', type: 'number', label: 'Anzahl Flyer', defaultValue: 3, min: 1, max: 6 },
  ],
}

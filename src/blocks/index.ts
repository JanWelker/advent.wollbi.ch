import type { Block } from 'payload'

// Three blocks, because the Pelican pages were three things: prose, a run of
// images under a year heading, and a file to download.

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

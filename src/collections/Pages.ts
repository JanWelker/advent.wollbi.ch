import type { CollectionConfig } from 'payload'

import { Download, Gallery, Prose } from '../blocks'

// One page per Pelican page. `slug: 'home'` is served at /, everything else
// at /<slug>; `order` is what page_order was.
export const Pages: CollectionConfig = {
  slug: 'pages',
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', 'updatedAt'],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Titel', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'home wird unter / ausgeliefert.' },
    },
    { name: 'navLabel', type: 'text', label: 'Beschriftung im Menü' },
    { name: 'order', type: 'number', label: 'Reihenfolge', required: true, defaultValue: 100 },
    {
      name: 'showInNav',
      type: 'checkbox',
      label: 'Im Menü zeigen',
      defaultValue: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Inhalt',
      blocks: [Prose, Gallery, Download],
    },
  ],
}

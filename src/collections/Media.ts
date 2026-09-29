import type { CollectionConfig } from 'payload'

// Uploads land on the volume the deployment mounts at ./media, never in the
// repository. Alt text is required: the archive is almost entirely images.
export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf', 'text/calendar'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alternativtext',
      required: true,
    },
  ],
}

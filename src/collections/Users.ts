import type { CollectionConfig } from 'payload'

// The OK members who edit the site. Created by the seed route on an empty
// database and by an existing editor afterwards; there is no public signup.
export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
    },
  ],
}

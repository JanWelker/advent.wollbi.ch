import configPromise from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import { markdown } from '@/lib/lexical'
import { admin, info, site, welcome } from './content'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const IMAGES = path.join(process.cwd(), 'public', 'seed', 'images')

// Alt text a human would have written, keyed by what the file is.
const altFor = (filename: string) => {
  const flyer = /^flyer_(\d{4})\./.exec(filename)
  if (flyer) return `Flyer ${flyer[1]}`
  if (filename.startsWith('advent_apero')) return 'Apéro an einem Adventsfenster'
  if (filename.startsWith('advent_')) return `Programm ${filename.slice(7, 11)}`
  if (filename === 'logo.png') return 'Wollbi Adventsfenster'
  return filename.replace(/\.[^.]+$/, '')
}

// POST only, and only with the secret the pod already holds. The route is
// part of the build, so there is no second image to keep in step -- the
// PostSync hook in homelab-apps is a curl.
export const POST = async (request: Request) => {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret || request.headers.get('x-seed-token') !== secret) {
    return Response.json({ error: 'forbidden' }, { status: 403 })
  }

  const payload = await getPayload({ config: configPromise })

  const users = await payload.count({ collection: 'users' })
  if (users.totalDocs === 0) {
    const password = process.env.SEED_ADMIN_PASSWORD
    if (!password) {
      return Response.json({ error: 'SEED_ADMIN_PASSWORD is not set' }, { status: 500 })
    }
    await payload.create({ collection: 'users', data: { ...admin, password } })
  }

  const pages = await payload.count({ collection: 'pages' })
  if (pages.totalDocs > 0) {
    return Response.json({ seeded: false, reason: 'pages already exist' })
  }

  // Every file, not only the ones a page references: the flyers of past
  // years are the record of them and nothing should be dropped in transit.
  const media: Record<string, number | string> = {}
  for (const filename of fs.readdirSync(IMAGES).sort()) {
    const created = await payload.create({
      collection: 'media',
      data: { alt: altFor(filename) },
      filePath: path.join(IMAGES, filename),
    })
    media[filename] = created.id
  }

  await payload.updateGlobal({ slug: 'site', data: site })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Herzlich willkommen zu unseren Adventsfenstern',
      slug: 'home',
      navLabel: 'Willkommen',
      order: 1,
      showInNav: true,
      layout: [
        { blockType: 'prose', content: markdown(welcome.intro) },
        { blockType: 'gallery', images: [{ image: media[welcome.flyerImage] }] },
        ...welcome.downloads
          .filter((entry) => media[entry.file])
          .map((entry) => ({
            blockType: 'download',
            label: entry.label,
            file: media[entry.file],
          })),
        { blockType: 'prose', content: markdown(welcome.closing) },
      ],
    } as never,
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Info',
      slug: 'info',
      navLabel: 'Info',
      order: 2,
      showInNav: true,
      layout: [{ blockType: 'prose', content: markdown(info) }],
    } as never,
  })

  return Response.json({ seeded: true, media: Object.keys(media).length, pages: 2 })
}

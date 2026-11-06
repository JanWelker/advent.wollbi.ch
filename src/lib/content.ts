import { getPayload } from 'payload'

import config from '@/payload.config'
import { withSignups } from './signup'

type Block = Record<string, any>

// A page with its first windows block resolved, for the calendar and the
// flyer: they draw the same rows the page lists.
export const pageWindows = async (slug: string) => {
  const payload = await getPayload({ config: await config })
  const [found, site] = await Promise.all([
    payload.find({ collection: 'pages', where: { slug: { equals: slug } }, depth: 1, limit: 1 }),
    payload.findGlobal({ slug: 'site' }),
  ])
  const page = found.docs[0]
  if (!page) return null
  const layout = await withSignups(payload, (page.layout ?? []) as Block[])
  const windows = layout.find((block) => block.blockType === 'windows')
  if (!windows) return null
  return { page, site, windows }
}

// The year the rows are in, for file names.
export const yearOf = (keys: string[]) => keys[keys.length - 1]?.slice(0, 4) ?? ''

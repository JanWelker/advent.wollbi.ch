import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Site } from '@/payload-types'
import { evenings } from '@/lib/windows'

type Media = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}
type Block = Record<string, any>

const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' ? (value as Media) : null

// Payload returns an absolute URL once serverURL is set, and next/image
// treats an absolute one as remote -- which needs a remotePatterns entry per
// hostname. The path is the same file either way.
const localPath = (url: string) => (url.startsWith('http') ? new URL(url).pathname : url)

const Flyer = ({ media, label }: { media: Media; label?: string | null }) => (
  <figure className="flyer">
    <a href={localPath(media.url!)}>
      <Image
        alt={media.alt ?? ''}
        src={localPath(media.url!)}
        width={media.width ?? 900}
        height={media.height ?? 1270}
        sizes="(max-width: 720px) 30vw, 170px"
      />
    </a>
    {label ? <figcaption>{label}</figcaption> : null}
  </figure>
)

const WindowsList = ({ block }: { block: Block }) => {
  const calendar = asMedia(block.calendar)
  const flyer = asMedia(block.flyer)
  return (
    <section id="fenster" className="windows">
      <div className="wrap">
        <div className="section-head">
          <h2>{block.heading || 'Wann, wo, bei wem'}</h2>
          <div className="actions">
            {calendar?.url ? (
              <a className="button button-primary" href={localPath(calendar.url)}>
                In meinen Kalender
              </a>
            ) : null}
            {flyer?.url ? (
              <a className="button button-secondary" href={localPath(flyer.url)}>
                Flyer (PDF)
              </a>
            ) : null}
          </div>
        </div>
        <ol className="evenings">
          {evenings(block).map((evening, i) => (
            <li key={i} className="evening">
              <span className="evening-date">
                <span className="evening-day">{evening.day}</span>
                <abbr className="evening-weekday" title={evening.weekday}>
                  {evening.weekdayShort}
                </abbr>
              </span>
              <span className="evening-who">
                <span className="evening-names">{evening.names}</span>
                {evening.note ? <span className="evening-note">{evening.note}</span> : null}
              </span>
              <span className="evening-where">
                <span className="evening-house">{evening.house}</span>
                {evening.time ? <span className="evening-time">ab {evening.time}</span> : null}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const TeamList = ({ block, site }: { block: Block; site: Site | null }) => (
  <div className="team">
    <h2>{block.heading || 'Euer OK'}</h2>
    <ul className="team-list">
      {(site?.team ?? []).map((member, i) => (
        <li key={i}>
          <span className="house-tag">{member.house}</span>
          {member.names}
        </li>
      ))}
    </ul>
    {block.note || site?.email ? (
      <p className="lead">
        {block.note || 'Anregungen und Fragen an'}{' '}
        {site?.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : null}
      </p>
    ) : null}
  </div>
)

// The most recent years from the archive page, oldest first, so the row
// ends with this year's flyer.
const ArchiveTeaser = async ({ block }: { block: Block }) => {
  const payload = await getPayload({ config: await config })
  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: block.archiveSlug || 'archiv' } },
    depth: 2,
    limit: 1,
  })
  const archive = found.docs[0]
  if (!archive) return null

  const flyers = (archive.layout ?? [])
    .filter((b: Block) => b.blockType === 'gallery')
    .map((b: Block) => ({ year: b.heading as string | null, media: asMedia(b.images?.[0]?.image) }))
    .filter((entry: { media: Media | null }) => entry.media?.url)
    .slice(-(block.count || 3))

  return (
    <div className="archive-teaser">
      <div className="section-head">
        <h2>{block.heading || 'Frühere Jahre'}</h2>
        <a className="more" href={`/${archive.slug}`}>
          Ganzes Archiv
        </a>
      </div>
      <div className="flyers">
        {flyers.map((entry: { year: string | null; media: Media | null }, i: number) => (
          <Flyer key={i} media={entry.media!} label={entry.year} />
        ))}
      </div>
    </div>
  )
}

// Two rewrites of the block list before rendering. Consecutive galleries --
// the archive is one per year -- become one row of flyers with the year under
// each. An OK followed by an archive teaser share a row, as two columns.
const arrange = (layout: Block[]) => {
  const out: Block[] = []
  for (const block of layout) {
    const last = out[out.length - 1]
    if (block.blockType === 'gallery') {
      const entries = (block.images ?? [])
        .map((row: Block) => ({ media: asMedia(row.image), label: block.heading as string | null }))
        .filter((entry: { media: Media | null }) => entry.media?.url)
      if (last?.blockType === 'wall') last.entries.push(...entries)
      else out.push({ blockType: 'wall', entries })
      continue
    }
    if (block.blockType === 'archiveTeaser' && last?.blockType === 'team') {
      out[out.length - 1] = { blockType: 'pair', team: last, archive: block }
      continue
    }
    out.push(block)
  }
  return out
}

// One renderer for every page: the home page is the page whose slug is
// `home`, and nothing else about it is special.
export const PageBody = ({ layout, site }: { layout?: Block[] | null; site: Site | null }) => (
  <>
    {arrange(layout ?? []).map((block, index) => {
      switch (block.blockType) {
        case 'prose':
          return (
            <section key={index} className="prose wrap">
              <RichText data={block.content} />
            </section>
          )

        case 'windows':
          return <WindowsList key={index} block={block} />

        case 'callout': {
          const image = asMedia(block.image)
          return (
            <section key={index} className="wrap">
              <div className="callout">
                {image?.url ? (
                  <Image
                    className="callout-image"
                    alt={image.alt ?? ''}
                    src={localPath(image.url)}
                    width={image.width ?? 1024}
                    height={image.height ?? 1024}
                    sizes="(max-width: 720px) 60vw, 260px"
                  />
                ) : null}
                <div>
                  <h2>{block.title}</h2>
                  {block.text ? <p>{block.text}</p> : null}
                </div>
              </div>
            </section>
          )
        }

        case 'team':
          return (
            <section key={index} className="wrap">
              <TeamList block={block} site={site} />
            </section>
          )

        case 'archiveTeaser':
          return (
            <section key={index} className="wrap">
              <ArchiveTeaser block={block} />
            </section>
          )

        case 'pair':
          return (
            <section key={index} className="pair wrap">
              <TeamList block={block.team} site={site} />
              <ArchiveTeaser block={block.archive} />
            </section>
          )

        case 'wall':
          return (
            <section key={index} className="wrap">
              <div className="flyers flyers-wall">
                {block.entries.map((entry: { media: Media; label: string | null }, i: number) => (
                  <Flyer key={i} media={entry.media} label={entry.label} />
                ))}
              </div>
            </section>
          )

        case 'download': {
          const media = asMedia(block.file)
          if (!media?.url) return null
          return (
            <section key={index} className="wrap">
              <a className="button button-secondary" href={localPath(media.url)}>
                {block.label}
              </a>
            </section>
          )
        }

        default:
          return null
      }
    })}
  </>
)

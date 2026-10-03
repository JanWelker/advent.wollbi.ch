import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import React from 'react'

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

// One renderer for both routes: the home page is the page whose slug is
// `home`, and nothing else about it is special.
export const PageBody = ({ layout }: { layout?: Block[] | null }) => (
  <article>
    {(layout ?? []).map((block, index) => {
      if (block.blockType === 'prose') {
        return <RichText key={index} data={block.content} />
      }

      if (block.blockType === 'gallery') {
        return (
          <section key={index} className="gallery">
            {block.heading ? <h2>{block.heading}</h2> : null}
            <div className="images">
              {(block.images ?? []).map((row: Block, i: number) => {
                const media = asMedia(row.image)
                if (!media?.url) return null
                return (
                  <a key={i} href={localPath(media.url)}>
                    <Image
                      alt={media.alt ?? ''}
                      src={localPath(media.url)}
                      width={media.width ?? 900}
                      height={media.height ?? 1200}
                    />
                  </a>
                )
              })}
            </div>
          </section>
        )
      }

      if (block.blockType === 'download') {
        const media = asMedia(block.file)
        if (!media?.url) return null
        return (
          <p key={index} className="download">
            <a href={localPath(media.url)}>{block.label}</a>
          </p>
        )
      }

      return null
    })}
  </article>
)

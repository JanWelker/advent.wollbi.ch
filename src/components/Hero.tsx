import type { Site } from '@/payload-types'
import { dateRange, evenings } from '@/lib/windows'
import { Street } from './Street'

type Block = Record<string, any>

// The home page's opening: the dates, the page's title, the invitation, and
// the street drawn from the first windows block on the page.
export const Hero = ({
  title,
  site,
  windows,
}: {
  title: string
  site: Site | null
  windows?: Block
}) => {
  const range = windows ? dateRange(windows) : null
  return (
    <section className="hero">
      <div className="hero-text wrap">
        {range ? <p className="hero-date">{range}</p> : null}
        <h1 className="hero-title">{title}</h1>
        {site?.intro ? <p className="hero-intro">{site.intro}</p> : null}
      </div>
      {windows ? <Street evenings={evenings(windows)} /> : null}
    </section>
  )
}

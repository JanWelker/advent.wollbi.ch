import type { Site } from '@/payload-types'
import { dateRange, evenings } from '@/lib/windows'
import { Street } from './Street'

type Block = Record<string, any>

// The home page's opening: the dates, the page's title, the invitation, and
// the street drawn from the first windows block on the page. While the
// sign-up is open it also says how many evenings are still free.
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
  const list = windows ? evenings(windows) : []
  const free = list.filter((evening) => evening.free).length
  return (
    <section className="hero">
      <div className="hero-text wrap">
        {range ? <p className="hero-date">{range}</p> : null}
        <h1 className="hero-title">{title}</h1>
        {site?.intro ? <p className="hero-intro">{site.intro}</p> : null}
        {windows?.signupOpen ? (
          <div className="hero-signup">
            <p>
              {free
                ? `Noch ${free} von ${list.length} Abenden frei. Welcher wird eurer?`
                : 'Alle Abende sind vergeben. Merci!'}
            </p>
            {free ? (
              <a className="button button-glow" href="#fenster">
                Abend aussuchen
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
      {windows ? <Street evenings={list} /> : null}
    </section>
  )
}

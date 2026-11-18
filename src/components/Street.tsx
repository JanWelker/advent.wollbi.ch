import type { CSSProperties } from 'react'

import type { Evening } from '@/lib/windows'

// The Wollbacherstrasse at night: one house per window, in date order, its
// window lit with the day. While the sign-up is open a free day is a dark
// window that leads to /anmelden. Decoration only -- the list under it says
// the same in words, with its own links -- so it is hidden from assistive
// tech and out of the tab order.

const WALLS = ['#2b3d63', '#3a2f55', '#24435a', '#43304a']
const ROOFS = ['#2e5240', '#6a4526', '#3d3d66', '#6b2f2f']
// A repeatable skyline rather than a random one, so a reload looks the same.
const HEIGHTS = [150, 190, 130, 170, 210, 140, 180]

export const signupHref = (day: string) => `/anmelden?tag=${day}`

const Facade = ({ evening }: { evening: Evening }) => (
  <>
    <span className="house-weekday">{evening.weekdayShort}</span>
    <span className="house-roof" />
    <span className="house-body">
      <span className="house-window">{evening.day}</span>
    </span>
    <span className="house-number">{evening.free ? 'frei' : evening.house}</span>
  </>
)

export const Street = ({ evenings }: { evenings: Evening[] }) => {
  if (!evenings.length) return null
  return (
    <div className="street" aria-hidden="true">
      <ol className="houses" style={{ '--count': evenings.length } as CSSProperties}>
        {evenings.map((evening, i) => (
          <li
            key={i}
            className={evening.free ? 'house is-free' : 'house'}
            style={
              {
                '--wall': WALLS[i % WALLS.length],
                '--roof': ROOFS[i % ROOFS.length],
                '--height': `${HEIGHTS[i % HEIGHTS.length]}px`,
              } as CSSProperties
            }
          >
            {evening.free ? (
              <a className="house-link" href={signupHref(evening.key)} tabIndex={-1}>
                <Facade evening={evening} />
              </a>
            ) : (
              <Facade evening={evening} />
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

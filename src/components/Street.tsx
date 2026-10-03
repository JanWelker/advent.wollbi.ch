import type { CSSProperties } from 'react'

import type { Evening } from '@/lib/windows'

// The Wollbacherstrasse at night: one house per window, in date order, its
// window lit with the day. Decoration only -- the list under it says the
// same in words -- so it is hidden from assistive tech.

const WALLS = ['#2b3d63', '#3a2f55', '#24435a', '#43304a']
const ROOFS = ['#2e5240', '#6a4526', '#3d3d66', '#6b2f2f']
// A repeatable skyline rather than a random one, so a reload looks the same.
const HEIGHTS = [150, 190, 130, 170, 210, 140, 180]

export const Street = ({ evenings }: { evenings: Evening[] }) => {
  if (!evenings.length) return null
  return (
    <div className="street" aria-hidden="true">
      <ol className="houses" style={{ '--count': evenings.length } as CSSProperties}>
        {evenings.map((evening, i) => (
          <li
            key={i}
            className="house"
            style={
              {
                '--wall': WALLS[i % WALLS.length],
                '--roof': ROOFS[i % ROOFS.length],
                '--height': `${HEIGHTS[i % HEIGHTS.length]}px`,
              } as CSSProperties
            }
          >
            <span className="house-weekday">{evening.weekdayShort}</span>
            <span className="house-roof" />
            <span className="house-body">
              <span className="house-window">{evening.day}</span>
            </span>
            <span className="house-number">{evening.house}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

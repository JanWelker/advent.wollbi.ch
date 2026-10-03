// Turns a windows block into what the street and the list show. Dates are
// read in Zurich time: the admin's day picker stores midnight local, which
// is the previous day in UTC.

type Block = Record<string, any>

export type Evening = {
  day: string
  weekday: string
  weekdayShort: string
  time: string
  names: string
  house: string
  note?: string | null
}

const format = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('de-CH', { ...options, timeZone: 'Europe/Zurich' }).format(new Date(iso))

export const evenings = (block: Block): Evening[] =>
  [...(block.entries ?? [])]
    .filter((entry: Block) => entry.date)
    .sort((a: Block, b: Block) => a.date.localeCompare(b.date))
    .map((entry: Block) => {
      const weekday = format(entry.date, { weekday: 'long' })
      const weekend = weekday === 'Samstag' || weekday === 'Sonntag'
      return {
        day: format(entry.date, { day: 'numeric' }),
        weekday,
        weekdayShort: weekday.slice(0, 2),
        time: entry.time || (weekend ? block.weekendTime : block.weekdayTime) || '',
        names: entry.names,
        house: entry.house,
        note: entry.note,
      }
    })

// "7.–21. Dezember 2025", from the first and last date, so the hero never
// disagrees with the list under it.
export const dateRange = (block: Block): string | null => {
  const dates = (block.entries ?? [])
    .map((entry: Block) => entry.date)
    .filter(Boolean)
    .sort()
  if (!dates.length) return null
  const first = dates[0]
  const last = dates[dates.length - 1]
  const tail = format(last, { day: 'numeric', month: 'long', year: 'numeric' })
  if (first === last) return tail
  const sameMonth = format(first, { month: 'numeric' }) === format(last, { month: 'numeric' })
  const head = sameMonth
    ? `${format(first, { day: 'numeric' })}.`
    : format(first, { day: 'numeric', month: 'long' })
  return `${head}–${tail}`
}

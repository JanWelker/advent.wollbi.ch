import { Document, Font, Page, Polygon, StyleSheet, Svg, Text, View } from '@react-pdf/renderer'
import path from 'path'

import type { Evening } from './windows'

// The flyer: the home page at A4. Dates, title and invitation on the night,
// the lit street, the list on snow, the times at the foot. Drawn per request
// from the same rows as the page, so it is never a year behind.

// The site's fonts, as the latin WOFF subsets Google Fonts serves. They are
// files rather than next/font, which only exists for the browser; `public/`
// is copied into the image, and the server runs from the app's root.
const font = (file: string) => path.join(process.cwd(), 'public', 'fonts', file)
Font.register({ family: 'Fredoka', src: font('fredoka-600.woff'), fontWeight: 600 })
Font.register({
  family: 'Nunito',
  fonts: [
    { src: font('nunito-400.woff'), fontWeight: 400 },
    { src: font('nunito-700.woff'), fontWeight: 700 },
    { src: font('nunito-800.woff'), fontWeight: 800 },
  ],
})
// Names are not to be hyphenated.
Font.registerHyphenationCallback((word) => [word])

// The palette of src/app/(frontend)/styles.css.
const C = {
  night: '#0f1b30',
  nightLine: '#2b3d63',
  moon: '#f4eedf',
  haze: '#c5d0e2',
  glow: '#ffc24b',
  snow: '#eef3f8',
  snowLine: '#c9d4e2',
  slate: '#5a6b85',
}
// The street's, from src/components/Street.tsx.
const WALLS = ['#2b3d63', '#3a2f55', '#24435a', '#43304a']
const ROOFS = ['#2e5240', '#6a4526', '#3d3d66', '#6b2f2f']
const HEIGHTS = [150, 190, 130, 170, 210, 140, 180]

const A4 = { width: 595.28, height: 841.89 }
const GUTTER = 32
const INNER = A4.width - 2 * GUTTER

// A fixed scatter of snow, so every download looks the same.
const FLAKES = [
  [44, 30, 1.6],
  [120, 96, 1.1],
  [210, 22, 1.3],
  [520, 40, 1.7],
  [470, 120, 1.2],
  [560, 160, 1],
  [70, 180, 1.2],
  [300, 60, 0.9],
  [395, 18, 1.1],
]

const s = StyleSheet.create({
  page: { backgroundColor: C.night, color: C.moon, fontFamily: 'Nunito' },
  head: { alignItems: 'center', paddingTop: 44, paddingHorizontal: GUTTER },
  date: { color: C.glow, fontWeight: 800, fontSize: 11, letterSpacing: 2.4 },
  title: {
    fontFamily: 'Fredoka',
    fontWeight: 600,
    fontSize: 50,
    marginTop: 8,
    textAlign: 'center',
  },
  intro: {
    color: C.haze,
    fontSize: 10.5,
    lineHeight: 1.5,
    marginTop: 10,
    maxWidth: 400,
    textAlign: 'center',
  },
  street: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: GUTTER,
    marginTop: 22,
  },
  house: { alignItems: 'center' },
  weekday: { color: C.haze, fontSize: 6.5, fontWeight: 800, marginBottom: 3 },
  window: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.glow,
    borderRadius: 2,
  },
  windowDay: { color: C.night, fontFamily: 'Fredoka', fontWeight: 600 },
  snow: { flexGrow: 1, backgroundColor: C.snow, color: C.night, paddingHorizontal: GUTTER },
  numbers: { flexDirection: 'row', paddingTop: 6 },
  number: { fontFamily: 'Fredoka', fontWeight: 600, fontSize: 8, textAlign: 'center' },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'center',
    flexGrow: 1,
    paddingVertical: 10,
  },
  evening: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (INNER - 24) / 2,
    borderBottomWidth: 0.75,
    borderBottomColor: C.snowLine,
  },
  when: { width: 34, alignItems: 'center' },
  day: { fontFamily: 'Fredoka', fontWeight: 600, lineHeight: 1 },
  short: { color: C.slate, fontSize: 6.5, fontWeight: 800, letterSpacing: 0.6 },
  who: { flexGrow: 1, flexShrink: 1, paddingHorizontal: 8 },
  names: { fontWeight: 800 },
  small: { color: C.slate, fontSize: 7.5 },
  where: { alignItems: 'flex-end' },
  houseName: { fontFamily: 'Fredoka', fontWeight: 600, fontSize: 10.5 },
  foot: { alignItems: 'center', paddingVertical: 18, paddingHorizontal: GUTTER },
  times: {
    color: C.glow,
    fontFamily: 'Fredoka',
    fontWeight: 600,
    fontSize: 15,
    textAlign: 'center',
  },
  contact: { color: C.haze, fontSize: 9, marginTop: 4 },
})

const House = ({ evening, i, width }: { evening: Evening; i: number; width: number }) => {
  const body = width * 0.88
  const height = HEIGHTS[i % HEIGHTS.length] * 0.48
  const win = Math.min(body * 0.62, 20)
  return (
    <View style={[s.house, { width }]}>
      {width > 20 ? <Text style={s.weekday}>{evening.weekdayShort}</Text> : null}
      <Svg width={body + 4} height={9} viewBox={`0 0 ${body + 4} 9`}>
        <Polygon points={`0,9 ${(body + 4) / 2},0 ${body + 4},9`} fill={ROOFS[i % ROOFS.length]} />
      </Svg>
      <View
        style={{
          width: body,
          height,
          backgroundColor: WALLS[i % WALLS.length],
          alignItems: 'center',
          paddingTop: 7,
        }}
      >
        <View
          style={{
            padding: 3,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 194, 75, 0.35)',
          }}
        >
          <View style={[s.window, { width: win, height: win }]}>
            <Text style={[s.windowDay, { fontSize: win * 0.5 }]}>{evening.day}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export const Flyer = ({
  title,
  range,
  intro,
  evenings,
  times,
  line,
  host,
  email,
}: {
  title: string
  range: string | null
  intro?: string | null
  evenings: Evening[]
  times: string
  line?: string | null
  host: string
  email?: string | null
}) => {
  const width = INNER / Math.max(evenings.length, 1)
  // Up to 24 evenings in two columns: the rows shrink as the list grows.
  const rows = Math.ceil(evenings.length / 2)
  const rowHeight = Math.min(50, 360 / Math.max(rows, 1))
  const scale = rowHeight / 40
  return (
    <Document title={`${title} – Flyer`} author={host} language="de">
      <Page size="A4" style={s.page}>
        <Svg
          width={A4.width}
          height={200}
          style={{ position: 'absolute', top: 0, left: 0 }}
          viewBox={`0 0 ${A4.width} 200`}
        >
          {FLAKES.map(([x, y, r], i) => (
            <Polygon
              key={i}
              points={`${x - r},${y} ${x},${y - r} ${x + r},${y} ${x},${y + r}`}
              fill={C.moon}
              fillOpacity={0.55}
            />
          ))}
        </Svg>

        <View style={s.head}>
          {range ? <Text style={s.date}>{range.toUpperCase()}</Text> : null}
          <Text style={s.title}>{title}</Text>
          {intro ? <Text style={s.intro}>{intro}</Text> : null}
        </View>

        <View style={s.street}>
          {evenings.map((evening, i) => (
            <House key={evening.key} evening={evening} i={i} width={width} />
          ))}
        </View>

        <View style={s.snow}>
          <View style={s.numbers}>
            {evenings.map((evening) => (
              <Text key={evening.key} style={[s.number, { width }]}>
                {evening.house}
              </Text>
            ))}
          </View>

          <View style={s.list}>
            {evenings.map((evening) => (
              <View key={evening.key} style={[s.evening, { height: rowHeight }]} wrap={false}>
                <View style={s.when}>
                  <Text style={[s.day, { fontSize: 20 * scale + 2 }]}>{evening.day}</Text>
                  <Text style={s.short}>{evening.weekdayShort.toUpperCase()}</Text>
                </View>
                <View style={s.who}>
                  <Text style={[s.names, { fontSize: 9 + scale }]}>{evening.names}</Text>
                  {evening.note ? <Text style={s.small}>{evening.note}</Text> : null}
                </View>
                <View style={s.where}>
                  <Text style={s.houseName}>{evening.house}</Text>
                  {evening.time ? <Text style={s.small}>ab {evening.time}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={s.foot}>
          <Text style={s.times}>{[times, line].filter(Boolean).join('  ·  ')}</Text>
          <Text style={s.contact}>{[host, email].filter(Boolean).join('  ·  ')}</Text>
        </View>
      </Page>
    </Document>
  )
}

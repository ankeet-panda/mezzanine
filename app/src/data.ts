// Sample data for the Mezzanine concept: one floor, one team, one week.
// Invented people and a fictional office. Every count on screen is computed from these rows.

export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri'
export type PersonId = 'you' | 'arjun' | 'kavya' | 'rohan' | 'sana' | 'dev' | 'ira' | 'neel'
export type ZoneId = 'bench' | 'a' | 'b' | 'c' | 'd' | 'quiet'
export type Feature = 'window' | 'standing' | 'dual'

export type Desk = {
  id: string // "3.26"
  zone: ZoneId
  x: number // plan px, top-left of the desk
  y: number
  w: number
  h: number
  chair: 'above' | 'below' | 'left' | 'right'
  features: Feature[]
}

export type Person = { id: PersonId; name: string; short: string; initials: string }

export const OFFICE = { name: 'Kora House', city: 'Bengaluru', floor: 'Floor 3' }
export const TEAM_NAME = 'Design'
export const ANCHOR: DayId = 'wed'

export const DAYS: { id: DayId; short: string; date: number; long: string }[] = [
  { id: 'mon', short: 'Mon', date: 9, long: 'Monday 9 November' },
  { id: 'tue', short: 'Tue', date: 10, long: 'Tuesday 10 November' },
  { id: 'wed', short: 'Wed', date: 11, long: 'Wednesday 11 November' },
  { id: 'thu', short: 'Thu', date: 12, long: 'Thursday 12 November' },
  { id: 'fri', short: 'Fri', date: 13, long: 'Friday 13 November' },
]

export const PEOPLE: Person[] = [
  { id: 'you', name: 'Meera Rao', short: 'You', initials: 'MR' },
  { id: 'arjun', name: 'Arjun Mehta', short: 'Arjun', initials: 'AM' },
  { id: 'kavya', name: 'Kavya Iyer', short: 'Kavya', initials: 'KI' },
  { id: 'rohan', name: 'Rohan Das', short: 'Rohan', initials: 'RD' },
  { id: 'sana', name: 'Sana Qureshi', short: 'Sana', initials: 'SQ' },
  { id: 'dev', name: 'Dev Malhotra', short: 'Dev', initials: 'DM' },
  { id: 'ira', name: 'Ira Sen', short: 'Ira', initials: 'IS' },
  { id: 'neel', name: 'Neel Joshi', short: 'Neel', initials: 'NJ' },
]
export const person = (id: PersonId) => PEOPLE.find(p => p.id === id)!
export const TEAMMATES = PEOPLE.filter(p => p.id !== 'you')

export const ZONES: Record<ZoneId, string> = {
  bench: 'Window bench',
  a: 'Team table A',
  b: 'Team table B',
  c: 'Team table C',
  d: 'Team table D',
  quiet: 'Quiet room',
}

export const FEATURE_LABEL: Record<Feature, string> = { window: 'By the window', standing: 'Standing desk', dual: 'Dual monitor' }

// ---- The floor plan (760 × 520 px, drawn at 1:1) ----------------------------------------

export const PLAN = { w: 760, h: 520 }
const DW = 46 // desk width
const DH = 28 // desk depth
const STANDING = new Set(['3.04', '3.09', '3.24', '3.33', '3.45', '3.56'])

const desks: Desk[] = []
const add = (id: string, zone: ZoneId, x: number, y: number, chair: Desk['chair'], extra: Feature[] = []) => {
  const features: Feature[] = [...extra]
  if (STANDING.has(id)) features.push('standing')
  desks.push({ id, zone, x, y, w: DW, h: DH, chair, features })
}

// Window bench: 12 desks facing the glazing on the north wall
for (let i = 0; i < 12; i++) add(`3.${String(i + 1).padStart(2, '0')}`, 'bench', 30 + i * (DW + 2), 30, 'below', ['window'])

// Four team tables, back to back, 2 × 4
const table = (zone: ZoneId, base: number, x: number, y: number, dual: boolean) => {
  for (let i = 0; i < 4; i++) add(`3.${base + i}`, zone, x + i * (DW + 2), y, 'above', dual ? ['dual'] : [])
  for (let i = 0; i < 4; i++) add(`3.${base + 4 + i}`, zone, x + i * (DW + 2), y + DH + 2, 'below', dual ? ['dual'] : [])
}
table('a', 21, 46, 138, true)
table('b', 31, 330, 138, true)
table('c', 41, 46, 268, false)
table('d', 51, 330, 268, false)

// Quiet room: two columns of four, every desk facing east, chair on its west side
for (let i = 0; i < 4; i++) add(`3.${61 + i}`, 'quiet', 628, 56 + i * 46, 'left', ['dual'])
for (let i = 0; i < 4; i++) add(`3.${65 + i}`, 'quiet', 694, 56 + i * 46, 'left', ['dual'])

export const DESKS = desks
export const desk = (id: string) => DESKS.find(d => d.id === id)!

export const ROOMS = [
  { name: 'Cubbon', seats: 8, x: 12, y: 382, w: 226, h: 126 },
  { name: 'Lalbagh', seats: 4, x: 238, y: 382, w: 150, h: 126 },
  { name: 'Ulsoor', seats: 6, x: 388, y: 382, w: 214, h: 126 },
]
export const SERVICES = [
  { name: 'Kitchen', x: 614, y: 252, w: 134, h: 130 },
  { name: 'Lifts and stairs', x: 614, y: 382, w: 134, h: 126 },
]

// ---- Bookings ----------------------------------------------------------------------------

/** Your team's desks for each day, as they stand before you book anything this session. */
export const TEAM_BOOKINGS: Record<DayId, Partial<Record<PersonId, string>>> = {
  mon: { arjun: '3.22', rohan: '3.31' },
  tue: { you: '3.24', kavya: '3.23', sana: '3.34', dev: '3.35' },
  wed: { arjun: '3.22', kavya: '3.23', rohan: '3.27', sana: '3.32', dev: '3.33', ira: '3.36' },
  thu: { kavya: '3.23', ira: '3.36', neel: '3.37' },
  fri: { dev: '3.33' },
}

/** How many people from other teams are booked each day. */
const OTHERS_COUNT: Record<DayId, number> = { mon: 22, tue: 30, wed: 34, thu: 26, fri: 12 }

// A fixed-seed shuffle, so the sample is the same on every load and in every render
function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

/** Desks taken by other teams, per day. Team table A is the design team's home table, so they leave it be. */
export const OTHERS: Record<DayId, Set<string>> = Object.fromEntries(
  DAYS.map((d, i) => {
    const team = new Set(Object.values(TEAM_BOOKINGS[d.id]))
    const pool = DESKS.filter(x => x.zone !== 'a' && !team.has(x.id)).map(x => x.id)
    const rnd = seeded(97 + i * 31)
    for (let j = pool.length - 1; j > 0; j--) {
      const k = Math.floor(rnd() * (j + 1))
      ;[pool[j], pool[k]] = [pool[k], pool[j]]
    }
    return [d.id, new Set(pool.slice(0, OTHERS_COUNT[d.id]))]
  }),
) as Record<DayId, Set<string>>

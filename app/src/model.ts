import { DAYS, DESKS, OTHERS, PEOPLE, TEAM_BOOKINGS, desk, person, type DayId, type Desk, type Feature, type PersonId } from './data'

/** Your own booking per day; the rest of the week is fixed sample data. */
export type Mine = Record<DayId, string | null>

export const START_MINE: Mine = Object.fromEntries(DAYS.map(d => [d.id, TEAM_BOOKINGS[d.id].you ?? null])) as Mine

export type DeskState = 'you' | 'team' | 'other' | 'free'

export type DayView = {
  id: DayId
  /** Teammates (not you) at their desks */
  team: { person: PersonId; desk: string }[]
  mine: string | null
  byDesk: Map<string, { state: DeskState; person?: PersonId }>
  free: Desk[]
  /** Your team in the office that day, you included, of 8 */
  teamIn: number
  taken: number
}

export function dayView(day: DayId, mine: Mine): DayView {
  const team = Object.entries(TEAM_BOOKINGS[day])
    .filter(([p]) => p !== 'you')
    .map(([p, d]) => ({ person: p as PersonId, desk: d as string }))
  const my = mine[day]
  const byDesk = new Map<string, { state: DeskState; person?: PersonId }>()
  for (const d of DESKS) byDesk.set(d.id, { state: 'free' })
  for (const id of OTHERS[day]) byDesk.set(id, { state: 'other' })
  for (const t of team) byDesk.set(t.desk, { state: 'team', person: t.person })
  if (my) byDesk.set(my, { state: 'you', person: 'you' })
  const free = DESKS.filter(d => byDesk.get(d.id)!.state === 'free')
  return { id: day, team, mine: my, byDesk, free, teamIn: team.length + (my ? 1 : 0), taken: DESKS.length - free.length }
}

const centre = (d: Desk) => ({ x: d.x + d.w / 2, y: d.y + d.h / 2 })
const dist = (a: Desk, b: Desk) => Math.hypot(centre(a).x - centre(b).x, centre(a).y - centre(b).y)

/** The free desk closest to your teammates that day (sum of distances), else the nearest to your home table. */
export function suggestion(v: DayView, filters: Feature[] = []): Desk | null {
  const pool = v.free.filter(d => filters.every(f => d.features.includes(f)))
  if (!pool.length) return null
  const mates = v.team.map(t => desk(t.desk))
  const anchor = desk('3.21')
  const score = (d: Desk) => (mates.length ? mates.reduce((s, m) => s + dist(d, m), 0) / mates.length : dist(d, anchor))
  return [...pool].sort((a, b) => score(a) - score(b) || a.id.localeCompare(b.id))[0]
}

/** The teammates sitting nearest a desk that day, nearest first. */
export function nearest(v: DayView, deskId: string, n = 2) {
  const d = desk(deskId)
  return v.team
    .map(t => ({ ...t, name: person(t.person).short, distance: dist(d, desk(t.desk)) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, n)
}

/** How one desk sits to another, in the words people use at a table. */
function relation(a: Desk, b: Desk): string | null {
  const sameRow = a.y === b.y && a.zone === b.zone
  const facing = a.zone === b.zone && a.y !== b.y && Math.abs(a.y - b.y) < 40
  const dx = Math.abs(a.x - b.x)
  if (sameRow && dx <= 50) return 'next to'
  if (facing && dx < 4) return 'across from'
  if (facing && dx <= 50) return 'diagonally across from'
  return null
}

/** One plain sentence about where a desk sits relative to your team. */
export function nearText(v: DayView, deskId: string): string {
  const d = desk(deskId)
  const near = nearest(v, deskId, 3)
  if (!near.length) return 'None of your team is in that day.'
  const close = near
    .map(n => ({ ...n, rel: relation(d, desk(n.desk)) }))
    .filter(n => n.rel)
    .slice(0, 2)
  if (close.length) {
    const parts = close.map(n => `${n.rel} ${n.name}`)
    const text = parts.join(', ')
    return text[0].toUpperCase() + text.slice(1) + '.'
  }
  // Desk pitch is 48 px; say it in desks, the unit people count in
  const desks = Math.max(2, Math.round(near[0].distance / 48))
  return `${near[0].name} is ${desks} desks away.`
}

export const TEAM_SIZE = PEOPLE.length

export const dayOf = (id: DayId) => DAYS.find(d => d.id === id)!

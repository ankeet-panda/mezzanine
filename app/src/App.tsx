import { useEffect, useMemo, useRef, useState } from 'react'
import { BookMarked, CalendarRange, DoorOpen, Menu, Settings, Users, X } from 'lucide-react'
import { DAYS, FEATURE_LABEL, OFFICE, TEAM_NAME, type DayId, type Feature } from './data'
import { START_MINE, dayOf, dayView, suggestion, type Mine } from './model'
import { WeekStrip } from './components/WeekStrip'
import { FloorPlan } from './components/FloorPlan'
import { DeskPanel } from './components/DeskPanel'
import { WhoIsIn } from './components/WhoIsIn'
import { ScrollFade } from './recipes/ScrollFade'

const FILTERS: Feature[] = ['window', 'standing', 'dual']
const isDay = (x: string | null): x is DayId => DAYS.some(d => d.id === x)

// The day and filters live in the URL, so a view can be shared and Back restores it
function readUrl() {
  const q = new URLSearchParams(location.search)
  const day = q.get('day')
  const f = (q.get('f') ?? '').split(',').filter((x): x is Feature => (FILTERS as string[]).includes(x))
  return { day: isDay(day) ? day : 'wed', filters: f }
}

const NAV = [
  { id: 'week', label: 'Week', Icon: CalendarRange },
  { id: 'rooms', label: 'Rooms', Icon: DoorOpen },
  { id: 'bookings', label: 'My bookings', Icon: BookMarked },
  { id: 'team', label: 'Team', Icon: Users },
] as const

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [note, setNote] = useState('')
  return (
    <aside className="sidebar" data-open={open || undefined} aria-label="Mezzanine">
      <div className="sidebar__top">
        <div className="brand">
          <span className="brand__tile" aria-hidden="true">M</span>
          <span className="brand__name">Mezzanine</span>
        </div>
        <button type="button" className="icon-btn sidebar__close" onClick={onClose} aria-label="Close menu"><X size={18} aria-hidden="true" /></button>
      </div>
      <div className="office">
        <span className="office__name">{OFFICE.name}</span>
        <span className="office__sub">{OFFICE.city} · {OFFICE.floor}</span>
      </div>
      <nav className="nav" aria-label="Main">
        {NAV.map(({ id, label, Icon }) =>
          id === 'week' ? (
            <a key={id} className="nav__item" href="?" aria-current="page" onClick={e => e.preventDefault()}>
              <Icon size={18} strokeWidth={1.75} aria-hidden="true" />{label}
            </a>
          ) : (
            <button key={id} type="button" className="nav__item" onClick={() => setNote(`${label} isn’t part of this one-screen concept.`)}>
              <Icon size={18} strokeWidth={1.75} aria-hidden="true" />{label}
            </button>
          ),
        )}
      </nav>
      <p className="sidebar__note" role="status">{note}</p>
      <div className="sidebar__foot">
        <button type="button" className="nav__item" onClick={() => setNote('Settings aren’t part of this one-screen concept.')}>
          <Settings size={18} strokeWidth={1.75} aria-hidden="true" />Settings
        </button>
        <div className="me">
          <span className="face" data-you aria-hidden="true">MR</span>
          <span className="me__text"><span className="me__name">Meera Rao</span><span className="me__team">{TEAM_NAME} team</span></span>
        </div>
      </div>
    </aside>
  )
}

export function App() {
  const init = useMemo(readUrl, [])
  const [day, setDay] = useState<DayId>(init.day)
  const [filters, setFilters] = useState<Feature[]>(init.filters)
  const [mine, setMine] = useState<Mine>(START_MINE)
  const [picked, setPicked] = useState<string | null>(null)
  const [landing, setLanding] = useState<string | null>(null)
  const [undo, setUndo] = useState<{ day: DayId; desk: string } | null>(null)
  const [menu, setMenu] = useState(false)
  const [whole, setWhole] = useState(false) // phone: the whole floor opens on request; the card above carries the inset
  const undoTimer = useRef(0)
  const landTimer = useRef(0)

  const views = useMemo(() => Object.fromEntries(DAYS.map(d => [d.id, dayView(d.id, mine)])) as Record<DayId, ReturnType<typeof dayView>>, [mine])
  const view = views[day]
  const suggested = view.mine ? null : suggestion(view, filters)?.id ?? null
  const shown = picked ?? view.mine ?? suggested
  const freeCount = view.free.length
  const matchCount = view.free.filter(d => filters.every(f => d.features.includes(f))).length

  useEffect(() => {
    const q = new URLSearchParams(location.search)
    q.set('day', day)
    if (filters.length) q.set('f', filters.join(',')); else q.delete('f')
    history.replaceState(null, '', `?${q}`)
  }, [day, filters])

  useEffect(() => () => { window.clearTimeout(undoTimer.current); window.clearTimeout(landTimer.current) }, [])

  const chooseDay = (d: DayId) => { setDay(d); setPicked(null) }
  const toggle = (f: Feature) => { setFilters(fs => (fs.includes(f) ? fs.filter(x => x !== f) : [...fs, f])); setPicked(null) }

  const book = (id: string) => {
    setMine(m => ({ ...m, [day]: id }))
    setPicked(null)
    setUndo(null)
    setLanding(id)
    window.clearTimeout(landTimer.current)
    landTimer.current = window.setTimeout(() => setLanding(null), 600)
  }
  const cancel = () => {
    const was = mine[day]
    if (!was) return
    setMine(m => ({ ...m, [day]: null }))
    setPicked(was)
    setUndo({ day, desk: was })
    window.clearTimeout(undoTimer.current)
    undoTimer.current = window.setTimeout(() => setUndo(null), 8000)
  }
  const restore = () => {
    if (!undo) return
    setMine(m => ({ ...m, [undo.day]: undo.desk }))
    setPicked(null)
    setUndo(null)
  }

  const d = dayOf(day)

  return (
    <div className="shell">
      <Sidebar open={menu} onClose={() => setMenu(false)} />
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu}><Menu size={20} aria-hidden="true" /></button>
        <span className="brand"><span className="brand__tile" aria-hidden="true">M</span><span className="brand__name">Mezzanine</span></span>
      </header>
      {menu && <button type="button" className="scrim" tabIndex={-1} aria-label="Close menu" onClick={() => setMenu(false)}></button>}

      <main className="main">
        <header className="page-head">
          <h1 className="page-title">Next week</h1>
          <p className="page-sub">9–13 November at {OFFICE.name}, floor 3. Wednesday is the {TEAM_NAME.toLowerCase()} team’s day in.</p>
        </header>

        <WeekStrip views={views} day={day} onDay={chooseDay} />

        <div className="board" id="day-panel" role="tabpanel" aria-labelledby={`tab-${day}`}>
          <section className="card plan-card" aria-label={`Floor 3 on ${d.long}`} data-open={whole || undefined}>
            <div className="plan-card__head">
              <div className="plan-card__title">
                <h2 className="card__title">Floor 3 on {d.short} {d.date}</h2>
                <span className="plan-card__count">
                  {filters.length ? <><span className="num">{matchCount}</span> of <span className="num">{freeCount}</span> free desks match</> : <><span className="num">{freeCount}</span> desks free</>}
                </span>
              </div>
              <div className="filters" role="group" aria-label="Show free desks with">
                {FILTERS.map(f => (
                  <button key={f} type="button" className="filter" aria-pressed={filters.includes(f)} onClick={() => toggle(f)}>
                    {FEATURE_LABEL[f]}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className="plan-toggle" aria-expanded={whole} aria-controls="floor" onClick={() => setWhole(w => !w)}>
              {whole ? 'Hide the whole floor' : 'Show the whole floor'}
            </button>
            <p className="plan-hint">Scroll sideways to see the whole floor.</p>
            <ScrollFade id="floor" label="Floor plan" maxHeight="none" axis="x" className="plan-scroll">
              <FloorPlan view={view} selected={shown} suggested={suggested} filters={filters} landing={landing} onSelect={id => { setPicked(id); setUndo(u => (u && u.day === day ? u : null)) }} />
            </ScrollFade>
            <ul className="legend" aria-label="Key">
              <li><span className="key key--you" aria-hidden="true" />You</li>
              <li><span className="key key--team" aria-hidden="true" />{TEAM_NAME} team</li>
              <li><span className="key key--other" aria-hidden="true" />Other teams</li>
              <li><span className="key key--free" aria-hidden="true" />Free</li>
            </ul>
          </section>

          <div className="rail">
            <DeskPanel
              view={view}
              deskId={shown}
              suggested={suggested}
              filters={filters}
              onBook={book}
              onCancel={cancel}
              onClearFilters={() => setFilters([])}
              undo={undo}
              onUndo={restore}
              landing={landing}
            />
            <WhoIsIn view={view} selected={shown} onPick={id => setPicked(id)} />
          </div>
        </div>
      </main>
    </div>
  )
}

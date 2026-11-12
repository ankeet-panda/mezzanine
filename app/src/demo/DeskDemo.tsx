import { useEffect, useState } from 'react'
import { Stage } from '@kit/stage'
import { Window } from '@kit/window'
import { Fly } from '@kit/motion/Fly'
import type { Act } from '@kit/act'
import { BookMarked, CalendarRange, DoorOpen, Users } from 'lucide-react'
import { DAYS, type DayId } from '../data'
import { START_MINE, dayView, suggestion, type Mine } from '../model'
import { WeekStrip } from '../components/WeekStrip'
import { FloorPlan } from '../components/FloorPlan'
import { DeskPanel } from '../components/DeskPanel'
import { useReducedMotion } from '../recipes/motion'

// The real product's components and data: the demo books Wednesday's suggested desk,
// so every count that changes on screen is computed, not typed.
type S = { day: DayId; mine: Mine; hold: boolean; go: boolean }

const START: S = { day: 'tue', mine: START_MINE, hold: false, go: false }
const BOOKED: Mine = { ...START_MINE, wed: '3.24' }
const END: S = { day: 'wed', mine: BOOKED, hold: false, go: false }
const REST = { wide: { x: 700, y: 560 }, compact: { x: 300, y: 560 } }

const script = async (a: Act<S>) => {
  // Tuesday, already booked: long enough to read the week
  await a.wait(1500)
  a.mark('day')
  await a.click('day-wed')
  await a.set({ day: 'wed' })
  // Six of the team at their desks; the suggested desk sits next to Kavya
  await a.wait(1500)
  a.mark('desk')
  if (a.layout === 'wide') {
    await a.move('desk-3.24')
    await a.wait(700)
  }
  a.mark('book')
  await a.click('book')
  // The place card buds off the button and flies to the desk
  await a.set({ hold: true })
  await a.wait(120)
  await a.set({ go: true })
  await a.wait(760)
  await a.set({ mine: BOOKED, hold: false, go: false })
  a.mark('payoff')
  await a.move(a.layout === 'wide' ? REST.wide : REST.compact)
  await a.wait(2600)
}

const NAV = [
  { label: 'Week', Icon: CalendarRange, on: true },
  { label: 'Rooms', Icon: DoorOpen },
  { label: 'My bookings', Icon: BookMarked },
  { label: 'Team', Icon: Users },
]

function Sidebar() {
  return (
    <div className="dd-side">
      <div className="brand"><span className="brand__tile">M</span><span className="brand__name">Mezzanine</span></div>
      <div className="dd-nav">
        {NAV.map(({ label, Icon, on }) => (
          <span key={label} className="nav__item" aria-current={on ? 'page' : undefined}><Icon size={16} strokeWidth={1.75} />{label}</span>
        ))}
      </div>
    </div>
  )
}

function Scene({ s, rect, compact }: { s: S; rect: (n: string) => import('@kit/measure').Rect; compact: boolean }) {
  const views = Object.fromEntries(DAYS.map(d => [d.id, dayView(d.id, s.mine)])) as Record<DayId, ReturnType<typeof dayView>>
  const view = views[s.day]
  const suggested = view.mine ? null : suggestion(view)?.id ?? null
  const shown = view.mine ?? suggested
  const target = compact ? 'crop-desk-3.24' : 'desk-3.24'
  const btn = rect('book')
  const desk = rect(target)
  // Drawn at the landing size, so it flies without changing shape
  const from = { x: btn.x + 16, y: btn.y + (btn.height - desk.height) / 2, width: desk.width, height: desk.height }

  const flyer = (
    <Fly from={from} to={desk} go={s.go} held={s.hold} duration={720} className="dd-fly">
      <span className="desk dd-place" data-state="you"><span className="desk__who">MR</span></span>
    </Fly>
  )

  if (compact) {
    return (
      <>
        <div className="dd-compact">
          <div className="dd-compact__week"><WeekStrip views={views} day={s.day} still maxFaces={3} /></div>
          <DeskPanel view={view} deskId={shown} suggested={suggested} filters={[]} still crop />
        </div>
        {flyer}
      </>
    )
  }
  return (
    <>
      <Window title="Next week" sidebar={<Sidebar />} sidebarWidth={180} className="dd-window">
        <div className="dd-body">
          <WeekStrip views={views} day={s.day} still maxFaces={4} />
          <div className="dd-board">
            <section className="card plan-card">
              <div className="plan-card__head">
                <div className="plan-card__title">
                  <span className="card__title">Floor 3 on {DAYS.find(d => d.id === s.day)!.short} {DAYS.find(d => d.id === s.day)!.date}</span>
                  <span className="plan-card__count"><span className="num">{view.free.length}</span> desks free</span>
                </div>
              </div>
              <FloorPlan view={view} selected={shown} suggested={suggested} filters={[]} still frame={{ x: 24, y: 104, w: 436, h: 252 }} />
            </section>
            <DeskPanel view={view} deskId={shown} suggested={suggested} filters={[]} still />
          </div>
        </div>
      </Window>
      {flyer}
    </>
  )
}

/** The self-playing demo: book a desk beside your team on their day in. Plays once in view. */
export function DeskDemo() {
  const reduced = useReducedMotion()
  const [chosen, setChosen] = useState(false) // under reduced motion, plays only when the person asks
  const [paused, setPaused] = useState(false)
  const [run, setRun] = useState(0)

  // A demo the person chose to play keeps its motion (accessibility: scoped keep-motion)
  useEffect(() => {
    if (chosen) document.documentElement.dataset.motion = 'full'
    return () => { delete document.documentElement.dataset.motion }
  }, [chosen])

  const still = paused || (reduced && !chosen)
  return (
    <figure className="dd-figure">
      <div aria-hidden="true">
        <Stage<S>
          key={`${run}-${still}`}
          width={1040}
          height={600}
          compact={{ below: 640, width: 358, height: 600 }}
          initial={START}
          poster={END}
          play="once"
          script={still ? undefined : script}
          cursor={{ at: REST }}
          className="dd"
        >
          {(s, rect, layout) => <Scene s={s} rect={rect} compact={layout === 'compact'} />}
        </Stage>
      </div>
      <figcaption className="dd-controls">
        {reduced && !chosen ? (
          <button type="button" className="dd-btn" onClick={() => { setChosen(true); setPaused(false); setRun(n => n + 1) }}>Play demo</button>
        ) : (
          <>
            <button type="button" className="dd-btn" onClick={() => setPaused(p => !p)} aria-pressed={paused}>{paused ? 'Play demo' : 'Pause demo'}</button>
            <button type="button" className="dd-btn" onClick={() => { setPaused(false); setRun(n => n + 1) }}>Replay</button>
          </>
        )}
        <span className="dd-note">Picking Wednesday, then booking the desk next to Kavya. Sample data in a product concept.</span>
      </figcaption>
    </figure>
  )
}

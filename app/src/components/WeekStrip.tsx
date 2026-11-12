import { useEffect, useRef, type KeyboardEvent } from 'react'
import NumberFlow from '@number-flow/react'
import { ANCHOR, DAYS, DESKS, person, type DayId } from '../data'
import { TEAM_SIZE, type DayView } from '../model'

type Props = {
  views: Record<DayId, DayView>
  day: DayId
  onDay?: (d: DayId) => void
  /** Demo use: no buttons, no focus */
  still?: boolean
  /** Most faces shown per day before "+N" */
  maxFaces?: number
}

export function Faces({ v, max = 7 }: { v: DayView; max?: number }) {
  const ids = [...(v.mine ? ['you' as const] : []), ...v.team.map(t => t.person)]
  const shown = ids.slice(0, max)
  return (
    <span className="faces" aria-hidden="true">
      {shown.map(id => (
        <span key={id} className="face" data-you={id === 'you' || undefined}>{person(id).initials}</span>
      ))}
      {ids.length > max && <span className="face face--more num">+{ids.length - max}</span>}
    </span>
  )
}

function DayCard({ v, maxFaces }: { v: DayView; maxFaces?: number }) {
  const d = DAYS.find(x => x.id === v.id)!
  const free = DESKS.length - v.taken
  return (
    <>
      <span className="day__head">
        <span className="day__name">{d.short} {d.date}</span>
        {v.id === ANCHOR && <span className="tag"><span className="tag__dot" aria-hidden="true" />Team day</span>}
      </span>
      <span className="day__count">
        <NumberFlow className="num day__figure" value={v.teamIn} /><span className="day__of"> of {TEAM_SIZE} in</span>
      </span>
      {v.teamIn > 0 ? <Faces v={v} max={maxFaces} /> : <span className="faces faces--empty">No one yet</span>}
      <span className="day__you" data-booked={v.mine ? true : undefined}>
        {v.mine ? <>Your desk <span className="num">{v.mine}</span></> : 'Not booked'}
      </span>
      <span className="day__cap">
        <span className="meter" aria-hidden="true"><span className="meter__fill" style={{ transform: `scaleX(${v.taken / DESKS.length})` }} /></span>
        <span className="day__free"><NumberFlow className="num" value={free} /> desks free</span>
      </span>
    </>
  )
}

/** The week as five days, each answering "is it worth coming in?" */
export function WeekStrip({ views, day, onDay, still, maxFaces }: Props) {
  const list = useRef<HTMLDivElement>(null)
  // On a phone the strip scrolls: bring the chosen day into view on load
  useEffect(() => {
    const box = list.current, el = box?.querySelector<HTMLElement>(`[data-day="${day}"]`)
    if (box && el && box.scrollWidth > box.clientWidth) box.scrollLeft = el.offsetLeft - box.offsetLeft - 16 - 56 // the day before peeks in
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onKey = (e: KeyboardEvent) => {
    const i = DAYS.findIndex(d => d.id === day)
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? DAYS.length - 1 : -2
    if (next === -2) return
    e.preventDefault()
    const n = DAYS[Math.max(0, Math.min(DAYS.length - 1, next))]
    onDay?.(n.id)
    list.current?.querySelector<HTMLElement>(`[data-day="${n.id}"]`)?.focus()
  }
  return (
    <div className="week" ref={list} role={still ? undefined : 'tablist'} aria-label="Days next week" onKeyDown={still ? undefined : onKey}>
      {DAYS.map(d =>
        still ? (
          <span key={d.id} className="day" data-day={d.id} data-target={`day-${d.id}`} data-selected={day === d.id || undefined}>
            <DayCard v={views[d.id]} maxFaces={maxFaces} />
          </span>
        ) : (
          <button
            key={d.id}
            type="button"
            role="tab"
            id={`tab-${d.id}`}
            aria-selected={day === d.id}
            aria-controls="day-panel"
            tabIndex={day === d.id ? 0 : -1}
            className="day"
            data-day={d.id}
            data-selected={day === d.id || undefined}
            onClick={() => onDay?.(d.id)}
          >
            <DayCard v={views[d.id]} />
          </button>
        ),
      )}
    </div>
  )
}

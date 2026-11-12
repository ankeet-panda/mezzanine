import { Check } from 'lucide-react'
import { DESKS, FEATURE_LABEL, PLAN, ZONES, desk, person, type DayId, type Feature } from '../data'
import { dayOf, nearText, type DayView } from '../model'
import { MorphButton } from '../recipes/MorphButton'
import { FloorPlan } from './FloorPlan'

type Props = {
  view: DayView
  /** The desk on show: your pick, else the suggestion */
  deskId: string | null
  suggested: string | null
  filters: Feature[]
  onBook?: (id: string) => void
  onCancel?: () => void
  onClearFilters?: () => void
  /** A cancelled booking that can still come back */
  undo?: { day: DayId; desk: string } | null
  onUndo?: () => void
  /** Demo use: the button is a span the cursor presses */
  still?: boolean
  /** The desk whose place card is landing */
  landing?: string | null
  /** Show the plan crop at any width (the demo's compact scene) */
  crop?: boolean
}

const CROP = { w: 296, h: 112 }
/** The window of the plan a phone card shows: the desk's table, or 296 px of a long bench, centred on the desk */
function cropOf(id: string) {
  const d = desk(id)
  const zone = DESKS.filter(x => x.zone === d.zone)
  const minX = Math.min(...zone.map(z => z.x)) - 14, maxX = Math.max(...zone.map(z => z.x + z.w)) + 14
  const minY = Math.min(...zone.map(z => z.y)) - 16, maxY = Math.max(...zone.map(z => z.y + z.h)) + 16
  const cx = maxX - minX <= CROP.w ? (minX + maxX) / 2 : d.x + d.w / 2
  const cy = maxY - minY <= CROP.h ? (minY + maxY) / 2 : d.y + d.h / 2
  const x = Math.round(Math.max(0, Math.min(PLAN.w - CROP.w, cx - CROP.w / 2)))
  const y = Math.round(Math.max(0, Math.min(PLAN.h - CROP.h, cy - CROP.h / 2)))
  return { x, y, ...CROP }
}

/** One card that answers "where do I sit that day?" and holds the one action. */
export function DeskPanel({ view, deskId, suggested, filters, onBook, onCancel, onClearFilters, undo, onUndo, still, landing, crop }: Props) {
  const day = dayOf(view.id)
  const heading = <h2 className="card__title">{day.long}</h2>

  if (!deskId) {
    return (
      <section className="card panel" aria-label="Your desk">
        {heading}
        <p className="panel__empty">No free desk matches {filters.map(f => FEATURE_LABEL[f].toLowerCase()).join(' and ')} that day.</p>
        <button type="button" className="text-btn" onClick={onClearFilters}>Clear filters</button>
      </section>
    )
  }

  const d = desk(deskId)
  const s = view.byDesk.get(deskId)!
  const mineHere = view.mine === deskId
  const isFree = s.state === 'free'
  const chip = mineHere ? 'Your desk' : deskId === suggested ? 'Suggested' : isFree ? 'Free' : 'Taken'
  const kit = d.features.filter(f => f !== 'window' || d.zone !== 'bench')

  const action = mineHere ? (
    { key: 'booked', label: <><Check aria-hidden="true" /><span>Booked for {day.short} {day.date} Nov</span></> }
  ) : isFree ? (
    view.mine
      ? { key: `move-${deskId}`, label: <span>Move to desk <span className="num">{deskId}</span></span> }
      : { key: `book-${deskId}`, label: <span>Book desk <span className="num">{deskId}</span></span> }
  ) : null

  return (
    <section className="card panel" aria-label="Your desk" data-state={mineHere ? 'booked' : s.state} data-crop={crop || undefined}>
      {heading}
      <div className="panel__desk">
        <span className="panel__figure"><span className="panel__unit">Desk</span> <span className="num">{deskId}</span></span>
        <span className="chip" data-tone={mineHere ? 'you' : deskId === suggested ? 'suggest' : undefined}>{chip}</span>
      </div>
      <p className="panel__where">
        {ZONES[d.zone]}.{' '}
        {s.state === 'team' ? `${person(s.person!).name} sits here.` : s.state === 'other' ? 'Booked by another team.' : nearText(view, deskId)}
      </p>
      {kit.length > 0 && (
        <ul className="panel__kit" aria-label="At this desk">
          {kit.map(f => <li key={f} className="kit">{FEATURE_LABEL[f]}</li>)}
        </ul>
      )}

      {action && (
        <MorphButton
          {...(still ? { tabIndex: -1, 'data-target': 'book' } : {})}
          stateKey={action.key}
          className="panel__action"
          anchor="start"
          aria-disabled={mineHere || undefined}
          data-done={mineHere || undefined}
          announce={mineHere ? `Booked desk ${deskId} for ${day.long}` : ''}
          onClick={() => { if (!mineHere && isFree) onBook?.(deskId) }}
        >
          {action.label}
        </MorphButton>
      )}

      {!still && (
        mineHere ? (
          <button type="button" className="text-btn text-btn--danger" onClick={onCancel}>Cancel booking</button>
        ) : undo && undo.day === view.id ? (
          <p className="panel__note" role="status">
            Booking for desk <span className="num">{undo.desk}</span> cancelled.{' '}
            <button type="button" className="text-btn text-btn--inline" onClick={onUndo}>Undo</button>
          </p>
        ) : !isFree ? (
          <p className="panel__note">Pick a free desk on the plan.</p>
        ) : view.mine ? (
          <p className="panel__note">You’re booked at desk <span className="num">{view.mine}</span>. Moving frees it for someone else.</p>
        ) : (
          <p className="panel__note">Or pick any free desk on the plan.</p>
        )
      )}
      {/* On a phone the plan sits below, so the card carries its own crop of it, centred on this desk */}
      <div className="panel__inset" aria-hidden="true">
        <FloorPlan view={view} selected={deskId} suggested={suggested} filters={[]} landing={landing} still frame={cropOf(deskId)} tag="crop-" />
      </div>
    </section>
  )
}

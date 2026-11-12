import NumberFlow from '@number-flow/react'
import { PEOPLE, TEAM_NAME, type PersonId } from '../data'
import { TEAM_SIZE, dayOf, type DayView } from '../model'

type Props = { view: DayView; onPick?: (desk: string) => void; selected?: string | null }

/** Your team that day: who is in, and where they sit. */
export function WhoIsIn({ view, onPick, selected }: Props) {
  const day = dayOf(view.id)
  const at = new Map<PersonId, string>(view.team.map(t => [t.person, t.desk]))
  if (view.mine) at.set('you', view.mine)
  const rows = [...PEOPLE].sort((a, b) => Number(at.has(b.id)) - Number(at.has(a.id)))
  return (
    <section className="card who" aria-label={`Who's in on ${day.long}`}>
      <div className="card__head">
        <h2 className="card__title">{TEAM_NAME} team on {day.short}</h2>
        <span className="who__count"><NumberFlow className="num" value={view.teamIn} /> of {TEAM_SIZE} in</span>
      </div>
      <ul className="who__list">
        {rows.map(p => {
          const d = at.get(p.id)
          const body = (
            <>
              <span className="face" data-you={p.id === 'you' || undefined} data-out={!d || undefined} aria-hidden="true">{p.initials}</span>
              <span className="who__name">{p.id === 'you' ? `${p.name} (you)` : p.name}</span>
              <span className="who__desk">{d ? <>Desk <span className="num">{d}</span></> : 'Not in'}</span>
            </>
          )
          return (
            <li key={p.id}>
              {d ? (
                <button type="button" className="who__row" aria-pressed={selected === d} onClick={() => onPick?.(d)}>{body}</button>
              ) : (
                <div className="who__row" data-out>{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

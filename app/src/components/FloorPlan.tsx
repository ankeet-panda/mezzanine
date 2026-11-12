import { useRef, type KeyboardEvent } from 'react'
import { DESKS, FEATURE_LABEL, PLAN, ROOMS, SERVICES, ZONES, person, type Desk, type Feature } from '../data'
import type { DayView } from '../model'

type Props = {
  view: DayView
  selected: string | null
  suggested: string | null
  filters: Feature[]
  /** The desk that was just booked: its place card lands */
  landing?: string | null
  onSelect?: (id: string) => void
  /** Demo use: plain spans, no buttons or focus */
  still?: boolean
  /** Draw only this window of the plan (a crop), at 1:1 */
  frame?: { x: number; y: number; w: number; h: number }
  /** Prefix for the demo's cursor targets, when two plans share a scene */
  tag?: string
}

// Meeting tables in Cubbon (8), Lalbagh (4) and Ulsoor (6): chairs on both long sides
const MEETING = [{ x: 66, w: 118, n: 4 }, { x: 283, w: 60, n: 2 }, { x: 450, w: 90, n: 3 }]

const chairRect = (d: Desk) => {
  const cw = 18, ch = 7
  switch (d.chair) {
    case 'above': return { x: d.x + d.w / 2 - cw / 2, y: d.y - ch - 3, w: cw, h: ch }
    case 'below': return { x: d.x + d.w / 2 - cw / 2, y: d.y + d.h + 3, w: cw, h: ch }
    case 'left': return { x: d.x - ch - 3, y: d.y + d.h / 2 - cw / 2, w: ch, h: cw }
    default: return { x: d.x + d.w + 3, y: d.y + d.h / 2 - cw / 2, w: ch, h: cw }
  }
}

function label(d: Desk, view: DayView) {
  const s = view.byDesk.get(d.id)!
  const where = ZONES[d.zone]
  const kit = d.features.filter(f => f !== 'window').map(f => FEATURE_LABEL[f].toLowerCase())
  const tail = `${where}${kit.length ? `, ${kit.join(', ')}` : ''}`
  // The name starts with what the desk shows, so voice users can say it
  if (s.state === 'you') return `${person('you').initials}, your booking, desk ${d.id}, ${tail}`
  if (s.state === 'team') return `${person(s.person!).initials}, ${person(s.person!).name}, desk ${d.id}, ${tail}`
  return `Desk ${d.id}, ${s.state === 'other' ? 'booked' : 'free'}, ${tail}`
}

/** The architect's plan of floor 3, with people at their desks for one day. */
export function FloorPlan({ view, selected, suggested, filters, landing, onSelect, still, frame, tag = '' }: Props) {
  const f = frame ?? { x: 0, y: 0, w: PLAN.w, h: PLAN.h }
  const inside = (d: Desk) => d.x >= f.x && d.y >= f.y && d.x + d.w <= f.x + f.w && d.y + d.h <= f.y + f.h
  const touches = (d: Desk) => d.x + d.w > f.x && d.y + d.h > f.y && d.x < f.x + f.w && d.y < f.y + f.h
  const box = useRef<HTMLDivElement>(null)
  const focusId = selected ?? suggested ?? DESKS[0].id

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const dirs: Record<string, [number, number]> = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }
    const dir = dirs[e.key]
    const from = DESKS.find(d => d.id === (document.activeElement as HTMLElement)?.dataset.desk)
    if (!dir || !from) return
    e.preventDefault()
    // The nearest desk in that direction, preferring ones straight ahead
    const cx = from.x + from.w / 2, cy = from.y + from.h / 2
    let best: Desk | null = null, bestScore = Infinity
    for (const d of DESKS) {
      if (d.id === from.id) continue
      const dx = d.x + d.w / 2 - cx, dy = d.y + d.h / 2 - cy
      const along = dx * dir[0] + dy * dir[1]
      if (along <= 4) continue
      const across = Math.abs(dx * dir[1] - dy * dir[0])
      const score = along + across * 2.5
      if (score < bestScore) { bestScore = score; best = d }
    }
    if (best) box.current?.querySelector<HTMLElement>(`[data-desk="${best.id}"]`)?.focus()
  }

  return (
    <div className="plan" ref={box} style={{ width: f.w, height: f.h }} data-frame={frame ? true : undefined} onKeyDown={still ? undefined : onKey}>
      <svg className="plan__drawing" width={f.w} height={f.h} viewBox={`${f.x} ${f.y} ${f.w} ${f.h}`} aria-hidden="true">
        {!frame && (
          <>
        <defs>
          <linearGradient id="daylight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--daylight)" />
            <stop offset="1" stopColor="oklch(0.93 0.06 90 / 0)" />
          </linearGradient>
        </defs>
        {/* Daylight from the north glazing, fading into the floor */}
        <rect x="8" y="8" width="596" height="150" fill="url(#daylight)" />
        {/* Rooms and services */}
        {ROOMS.map(r => <rect key={r.name} x={r.x} y={r.y} width={r.w} height={r.h} className="plan__room" />)}
        {SERVICES.map(r => <rect key={r.name} x={r.x} y={r.y} width={r.w} height={r.h} className="plan__service" />)}
        {/* Partitions, with door gaps */}
        <path className="plan__partition" d="M612 8 V96 M612 124 V252 H748 M12 382 H160 M188 382 H286 M314 382 H460 M488 382 H604 M238 382 V508 M388 382 V508 M604 382 V508 M614 382 H748" />
        {/* Outer wall, broken by the north glazing */}
        <path className="plan__wall" d="M8 8 V512 H752 V8 H612" />
        <path className="plan__wall" d="M8 8 H20" />
        <line className="plan__glazing" x1="20" y1="8" x2="604" y2="8" />
        <line className="plan__glazing" x1="20" y1="13" x2="604" y2="13" />
        {/* Window mullions along the glazing */}
        {Array.from({ length: 13 }, (_, i) => 20 + i * 48).map(x => <line key={x} className="plan__mullion" x1={x} y1="8" x2={x} y2="13" />)}
        {/* The planted courtyard spine between the team tables */}
        <rect className="plan__planter" x="252" y="140" width="64" height="196" rx="14" />
        {[[278, 168], [292, 210], [276, 252], [290, 296]].map(([x, y]) => <circle key={y} className="plan__tree" cx={x} cy={y} r="15" />)}
        {/* Meeting tables, each room's own size */}
        {MEETING.map(m => (
          <g key={m.x}>
            <rect className="plan__meet" x={m.x} y={404} width={m.w} height={34} rx="6" />
            {Array.from({ length: m.n }, (_, i) => m.x + (m.w / m.n) * (i + 0.5) - 9).map(cx => (
              <g key={cx}>
                <rect className="plan__chair" x={cx} y={393} width={18} height={7} rx="3" />
                <rect className="plan__chair" x={cx} y={442} width={18} height={7} rx="3" />
              </g>
            ))}
          </g>
        ))}
        {/* Kitchen: counter with sink, an island with stools */}
        <rect className="plan__counter" x="626" y="262" width="110" height="18" rx="2" />
        <circle className="plan__chair" cx="716" cy="271" r="5" />
        <rect className="plan__meet" x="648" y="298" width="66" height="22" rx="4" />
        {[660, 681, 702].map(x => <circle key={x} className="plan__chair" cx={x} cy="331" r="6" />)}
        {/* Two lift cars and a stair */}
        {[626, 664].map(x => (
          <g key={x} className="plan__lift">
            <rect x={x} y={392} width={32} height={32} rx="2" />
            <line x1={x + 8} y1={424} x2={x + 24} y2={424} />
          </g>
        ))}
        <rect className="plan__stair" x="704" y="392" width="34" height="56" />
        {Array.from({ length: 8 }, (_, i) => 392 + 7 * (i + 1)).map(y => <line key={y} className="plan__tread" x1="704" y1={y} x2="738" y2={y} />)}
          </>
        )}
        {/* Chairs */}
        {DESKS.filter(d => !frame || inside(d)).map(d => { const c = chairRect(d); return <rect key={d.id} className="plan__chair" x={c.x} y={c.y} width={c.w} height={c.h} rx="3" /> })}
        {/* Table tops under the desks */}
        {[[44, 136], [328, 136], [44, 266], [328, 266]].filter(([x, y]) => !frame || (x >= f.x && y >= f.y && x + 194 <= f.x + f.w && y + 62 <= f.y + f.h)).map(([x, y]) => <rect key={`${x}-${y}`} className="plan__table" x={x} y={y} width={194} height={62} rx="5" />)}
      </svg>

      {/* Room labels, set in the rooms */}
      {!frame && [...ROOMS.map(r => ({ ...r, sub: `${r.seats} seats` })), ...SERVICES.map(r => ({ ...r, sub: '' }))].map(r => (
        <div key={r.name} className="plan__label" style={{ left: r.x, top: r.y, width: r.w, height: r.h }} aria-hidden="true">
          <span className="plan__name">{r.name}</span>
          {r.sub && <span className="plan__sub">{r.sub}</span>}
        </div>
      ))}
      {!frame && <div className="plan__zone" style={{ left: 628, top: 22 }} aria-hidden="true">Quiet room</div>}

      <div className="plan__desks" role={still ? undefined : 'group'} aria-label={still ? undefined : 'Desks on floor 3. Use the arrow keys to move between desks.'}>
        {DESKS.filter(frame ? inside : touches).map(d => {
          const s = view.byDesk.get(d.id)!
          const match = s.state !== 'free' || filters.every(f => d.features.includes(f))
          const common = {
            className: 'desk',
            'data-desk': d.id,
            'data-target': `${tag}desk-${d.id}`,
            'data-state': s.state,
            'data-selected': selected === d.id || undefined,
            'data-suggested': (suggested === d.id && selected !== d.id) || undefined,
            'data-dim': !match || undefined,
            'data-landing': landing === d.id || undefined,
            style: { left: d.x - f.x, top: d.y - f.y, width: d.w, height: d.h },
          }
          const inner = (
            <>
              {(s.state === 'team' || s.state === 'you') && <span className="desk__who">{person(s.person!).initials}</span>}
              {(s.state === 'free' || s.state === 'other') && <span className="desk__id num">{d.id.slice(2)}</span>}
            </>
          )
          return still ? (
            <span key={d.id} {...common}>{inner}</span>
          ) : (
            <button
              key={d.id}
              type="button"
              {...common}
              tabIndex={d.id === focusId ? 0 : -1}
              aria-label={label(d, view)}
              aria-pressed={selected === d.id}
              onClick={() => onSelect?.(d.id)}
            >
              {inner}
            </button>
          )
        })}
      </div>
    </div>
  )
}

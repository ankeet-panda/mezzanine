import { DAYS, type DayId } from '../data'
import { START_MINE, dayView, suggestion } from '../model'
import { WeekStrip } from '../components/WeekStrip'
import { FloorPlan } from '../components/FloorPlan'

// The concept, told with the product's own parts and sample data
const wed = dayView('wed', START_MINE)
const suggested = suggestion(wed)?.id ?? null
const booked = dayView('wed', { ...START_MINE, wed: '3.24' })
const TABLE_A = { x: 30, y: 116, w: 220, h: 100 }
const TABLES_AB = { x: 30, y: 116, w: 506, h: 100 }
const bookedWeek = Object.fromEntries(DAYS.map(d => [d.id, dayView(d.id, { ...START_MINE, wed: '3.24' })])) as Record<DayId, ReturnType<typeof dayView>>

const SWATCHES = [
  { name: 'Limestone', role: 'The ground. A warm, near-neutral floor that lets the drawing read', token: '--bg', ink: false },
  { name: 'Graphite', role: 'Ink, walls, and your team at their desks', token: '--team', ink: true },
  { name: 'Courtyard green', role: 'You, and only you: your desk, your booking, your action', token: '--accent', ink: true },
  { name: 'Stone', role: 'Other teams. Present, but quiet', token: '--other', ink: false },
]

export function Concept({ appHref = '#app', demoHref = '#demo' }: { appHref?: string; demoHref?: string }) {
  return (
    <main className="concept">
      <header className="concept__head">
        <span className="brand"><span className="brand__tile" aria-hidden="true">M</span><span className="brand__name">Mezzanine</span></span>
        <h1 className="concept__title">Desk booking that starts from who’s in</h1>
        <p className="concept__lede">
          Not from which desk is free. A product concept for hybrid teams: people come to the office to be with their
          own people, and Mezzanine is built around that one reason.
        </p>
        <div className="concept__actions">
          <a className="hero__action" href={appHref}>Try the screen</a>
          <a className="concept__link" href={demoHref}>Watch the demo</a>
        </div>
      </header>

      {/* The product, first: next week with your place card set beside your team on their day */}
      <figure className="concept__hero" aria-label="Next week in Mezzanine: Wednesday booked at desk 3.24, next to Kavya">
        <div aria-hidden="true">
          <WeekStrip views={bookedWeek} day="wed" still maxFaces={4} />
          <div className="concept__floor">
            <span className="concept__floor-title">Floor 3 on Wed 11</span>
            <FloorPlan view={booked} selected="3.24" suggested={null} filters={[]} still frame={TABLES_AB} tag="h-" />
          </div>
        </div>
      </figure>

      <section className="concept__row">
        <h2 className="concept__h2">The problem</h2>
        <div className="concept__body">
          <p>
            People commute in and then sit alone, because they booked a desk on a day their team stayed home. A floor
            map with green and red dots answers “is a desk free?”. It never answers the question that matters:
            “is it worth coming in?”
          </p>
        </div>
      </section>

      <section className="concept__row">
        <h2 className="concept__h2">The job</h2>
        <div className="concept__body">
          <blockquote className="concept__job">
            When I plan next week, I want to see which day my team is in and sit next to them, so the commute buys me
            time with people.
          </blockquote>
          <p className="concept__meta">For members of hybrid teams of 5 to 15 people, planning on a laptop once or twice a week.</p>
        </div>
      </section>

      <section className="concept__row">
        <h2 className="concept__h2">How it works</h2>
        <div className="concept__body concept__steps">
          <div className="step">
            <h3 className="step__title">See who’s in each day</h3>
            <p>The week leads. Each day says how many of your team are in, who they are, and which day is the team’s day.</p>
          </div>
          <div className="step">
            <h3 className="step__title">Sit with your people</h3>
            <p>The plan shows your team at their desks. Mezzanine suggests the free desk closest to them: here, next to Kavya and diagonally across from Rohan.</p>
          </div>
          <div className="step">
            <h3 className="step__title">Book, and your place card lands</h3>
            <p>One click books it. Your initials land on the desk like a name card set at a table, and your team can see you’re in.</p>
          </div>
          <figure className="step__pair" aria-label="Before and after booking: desk 3.24 suggested, then booked with your initials">
            <div className="step__visual" aria-hidden="true">
              <span className="step__caption">Suggested</span>
              <FloorPlan view={wed} selected={suggested} suggested={suggested} filters={[]} still frame={TABLE_A} tag="c1-" />
            </div>
            <div className="step__visual" aria-hidden="true">
              <span className="step__caption">Booked</span>
              <FloorPlan view={booked} selected="3.24" suggested={null} filters={[]} still frame={TABLE_A} tag="c2-" />
            </div>
          </figure>
        </div>
      </section>

      <section className="concept__row">
        <h2 className="concept__h2">The design</h2>
        <div className="concept__body">
          <p>
            An architect’s floor plan on a bright morning: hairline walls, limestone floors, a planted courtyard, signage
            you can read across a room. The chrome stays quiet so the plan and the people on it carry the screen.
          </p>
          <ul className="swatches">
            {SWATCHES.map(s => (
              <li key={s.name} className="swatch">
                <span className="swatch__chip" data-ink={s.ink || undefined} style={{ background: `var(${s.token})` }} aria-hidden="true" />
                <span className="swatch__name">{s.name}</span>
                <span className="swatch__role">{s.role}</span>
              </li>
            ))}
          </ul>
          <div className="specimen">
            <span className="specimen__wide">Wed 11</span>
            <span className="specimen__note">Archivo, set wide for day names and figures, the voice of wayfinding signs; the same family at normal width for everything you read.</span>
          </div>
        </div>
      </section>

      <section className="concept__row">
        <h2 className="concept__h2">Scope of this concept</h2>
        <div className="concept__body">
          <p>
            One working screen (the week, the plan, booking, moving and cancelling with undo), one self-playing demo and
            this page. Rooms, parking and office-manager tools are named but not built. The office, the people and every
            booking are sample data; nothing is sent anywhere.
          </p>
        </div>
      </section>
    </main>
  )
}

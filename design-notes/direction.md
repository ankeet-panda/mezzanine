# Mezzanine: concept, brief and direction

Fictional product concept (2026-11-04). Sample data only.

## The concept

**Mezzanine** is desk and room booking for hybrid teams, built around the one reason people come into the office:
to be with their own people. Most booking tools start from the desk; Mezzanine starts from the week. You see which
days your team is in, pick the day that counts, and sit next to the people you came in for.

- **The problem.** People commute in and then sit alone, because they booked a desk on a day their team stayed home.
  A floor map with green and red dots answers "is a desk free?", not "is it worth coming in?".
- **For whom.** Members of hybrid teams (5 to 15 people) in a shared office, planning the coming week on a laptop,
  usually on a Friday afternoon or a Monday morning. Office managers are a second audience, not this screen's.
- **The job.** When I plan next week, I want to see which day my team is in and grab a desk next to them, so the
  commute buys me time with people, not a quieter version of working from home.
- **How it works.** 1. The week shows who on your team is in each day, and which day is the team's anchor day.
  2. The floor plan for that day shows your teammates at their desks; Mezzanine suggests the free desk closest to
  them. 3. Book it; your place card lands on the plan, and your team sees you're in.
- **What it is not.** No live services, no invented adoption numbers, no AI. Rooms, parking and office-manager tools
  are named in the concept but outside this one screen.

## Brief

| Field | Answer |
|---|---|
| Product | Mezzanine, desk booking for hybrid teams. Fictional |
| Outcome | In one glance a person knows which day their team is in; booking a desk next to them takes two clicks |
| Who, how often, device | Hybrid team members, once or twice a week, laptop (1440), sometimes phone (390) |
| Appetite and no-gos | One working screen, one self-playing demo, one concept page. No rooms flow, no admin, no fake sends |
| Surface | Operate (app); the demo is a faux UI in a landing-hero setting; the concept page is Read |
| Real content | None (fictional). Sample data: one office floor (52 desks in three zones, three meeting rooms), an eight-person design team, bookings for 9–13 Nov 2026, generated from a fixed seed so every count adds up |
| Brand | None; the direction is free |
| Feeling (user's words) | "modern, classy, premium, and like a high-budget product" |
| Questions asked | Product: "Hybrid office booking". Direction: "Decide and build through" (no separate direction stop; recorded here). Reference world: "Your call" → architecture |

## Five lines

| Line | Answer |
|---|---|
| Product | Booking for hybrid teams that starts from who is in, not which desk is free |
| Character | Considered, daylit, exact |
| World | An architect's floor plan on a bright morning: hairline walls, limestone floors, oak benches, a planted courtyard, signage you can read across a room |
| Moments | The floor plan (people at their desks) and the week strip (who is in each day) |
| Signature | Your booking as a place card: your initials land on the desk the way a name card is set at a table, beside your teammates' |

## Subject inventory (app)

Desks with numbers (3.26), zones (window bench, team tables, quiet room), meeting rooms named after Bengaluru's
parks and lakes (Cubbon, Lalbagh, Ulsoor), the week (Mon to Fri, one anchor day), people (initials, teams), desk
kit (dual monitor, standing), the lift core and kitchen, daylight along the window wall, the count that matters
("6 of 8 in").

## Candidates (internal) and the pick

| # | Source | Skeleton | Kept or cut |
|---|---|---|---|
| A | Reasoning: architect's plan, week first | Week strip → large plan with people at desks → rail with the suggested desk and who's in | **Picked**: the only one whose signature exists because of this product's job (sitting with your people) |
| B | Real same-medium reference: desk-booking map tools (not seen with my own eyes in this run) | Big map, availability dots green/red, filters on the left | Cut: this is the rut; answers "is a desk free", not "is it worth coming in" |
| C | Designer lens, restrained (Dieter Rams thinking) | Calendar grid of the month, booking as a toggle per day | Alternate: very calm, but loses the plan, which is where people are |
| D | Designer lens, bold (Paula Scher thinking) | Day names set huge as signage, plan secondary | Cut: costume on a working screen; the world would carry the layout |
| E | Style library: Swiss information | Timetable rows of people × days | Alternate: dense and exact; good for office managers, wrong for one person deciding a day |
| F | Style library: Soft natural tech | Rounded frosted cards, pastel zones | Cut: frosted surfaces over a plan hurt contrast; reads like every 2024 app |

The rut: a floor map with green/red dots (the category's always-shipped piece) and its opposite, a plain calendar
list. A sits between: it keeps the plan but draws people, not availability.

Why A won: the brief asked for high-budget and classy; an architect's drawing gives precision and quiet luxury through
line weight and material, and the place card ties the visual to the job (sitting with your team).

## Direction contract (A)

| Block | Value |
|---|---|
| Feeling | Considered, daylit, exact |
| Surface | Operate (app); Persuade frame for the demo; Read for the concept page |
| Scene | Friday afternoon or Monday morning, a laptop by a window, planning the week → light theme, one theme (no switch: not asked, web default) |
| Type | Archivo variable (wdth 62–125, wght 100–900). UI at width 100; display at width 112 (signage voice, the one place width changes). 12/13/14/16/20/24/32; weights 420/520/620; tabular figures for counts and desk numbers |
| Colour | Ground limestone (oklch L 0.978, warm-neutral, chroma ≤ 0.006); ink graphite with a green cast; accent courtyard green, meaning "you / your booking" only; your team = graphite ink; other people = quiet grey; free = outline. Posture Restrained (accent ≤ 5%) |
| Density and grid | Open-plane shell: 232 sidebar, fluid canvas, content `1fr 360px`, 24 gap; medium density |
| Radius and depth | Architectural, small: controls 8, cards 14, plan sheet 14, place card 6; hairlines on the plan, one low-alpha neutral resting shadow on cards, no border+shadow pairs |
| Motion | Quiet and exact: changed digits roll (Number Flow), place card lands (220 ms, ease-out, no bounce), day switch cross-fades the plan's people (160 ms); reduced motion keeps fades only |
| Signature | The place card on the plan (your initials in courtyard green on your desk) |
| References | Architectural plan drawings (take: hairline hierarchy, wall weights, room labels set in the room; do not take: hatching, dimension lines, drawing chrome). Wayfinding signage (take: wide grotesque for day names; do not take: uppercase, arrows everywhere) |

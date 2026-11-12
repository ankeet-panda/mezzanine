# Mezzanine: hand-over record (2026-11-04)

**Status: paused. A fresh-eye design review returned `rebuild` twice; work stopped before a third design round.** Every machine gate below passes; the open items are taste and composition.

## Decision
Desk booking for hybrid teams, week first. Direction A, "architect's plan on a bright morning": limestone ground,
graphite ink and team, courtyard green for "you" only, Archivo (wide for day names and figures). Signature: your
booking lands on the plan as a place card. Full contract in `direction.md`. Built through without a
separate direction stop; recorded there.

## What was built
- Clickable screen (`app/index.html`): week strip as tabs (URL `?day=`), the floor plan (52 real desk buttons, arrow-key
  navigation, filters in the URL as `?f=`), suggested desk, book / move / cancel with an 8 s undo, MorphButton
  label change, place card landing, who's in. Phone: action card first with an inset map; the whole floor opens on request.
- Self-playing demo (`app/demo.html`): kit Stage + Window + Fly, the real components in still mode; Tue → Wed →
  book desk 3.24 → place card flies to the desk; plays once in view (about 9.5 s); Pause / Replay; under reduced
  motion it shows the finished still with "Play demo".
- Concept page (`app/src/showcase/Concept.tsx`) and one shareable file `publish/mezzanine.html` (not published).

## Checks (latest)
| Check | Result |
|---|---|
| Lint | 0 FAIL, 67 WARN (mostly tokens without usage comments; 11 px initials in face pips; `i - 1` read as a minus) |
| Render check app, dev, 1440 + 390, axe, keyboard, interact | 0 FAIL |
| Render check app, production build, reduced + stress (320, 125% text) | 0 FAIL, 0 WARN |
| Render check concept page 1440 + 390, axe | 0 FAIL |
| Film rehearsal gate, demo 1440 and 390 | passed both; coverage "inconclusive" (sampling gaps on this machine) |
| Contrast (measured on computed tokens) | text ≥ 5.57:1; desk edges free 4.57:1, other teams 3.58:1 (fixed from 1.85); on-accent 6.37:1 |
| Fresh-eye review 1 | `rebuild`: plan read as placeholder, demo on a grey plate, concept had no product on screen 1, phone showed the plan twice, "between Kavya and Rohan" overstated. All acted on |
| Fresh-eye review 2 | `rebuild`: concept page still reads as a document; first screen not big enough; team day under-marked; flat material, small UI text; Wed card height shift on phone; demo crop drops Friday; no reduced-motion frame in evidence |

Reviewer 2 points judged not to hold: the demo window is no longer on a plate (corner bleed on the page ground,
Friday deliberately past the crop); other-team desk numbers use `--text-2` on `--other` (about 6:1, not measured in
the render); the demo's reduced-motion still exists but was not captured.

## Not verified
Screen reader pass; real touch device; the button label morph inside the demo (film flags one-frame label swaps on the
day change: check by eye); reduced-motion demo frame; dark theme (none built, by decision).

## Possible next step
One more design round aimed at "high-budget": concept page rebuilt around the full plan; stronger team-day mark;
material and light in the plan; larger UI type; equal card heights on phone. Or ship as is.

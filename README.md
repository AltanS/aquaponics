# Aquaponics Profitability Calculator

Interactive feasibility model for commercial aquaponics in the Berlin/Brandenburg
region (2026 figures). Vite + TypeScript rebuild of the original single-file
prototype (`aquaponics-calculator.html`, kept as the behavioural reference —
see `HANDOFF.md` for the full domain handoff).

## Run

```sh
pnpm install
pnpm dev         # dev server
pnpm build       # typecheck + production build → dist/
pnpm test        # golden-value + unit tests for the calculation core
```

A `pre-push` git hook in `.githooks/` runs the tests before every push
(activated via `core.hooksPath` by the `prepare` script on `pnpm install`).

## Architecture

Data / logic / UI are strictly separated (HANDOFF.md §6):

```
src/
  data/    reference data — version-controlled, read-only at runtime
           fish.ts  crops.ts  scales.ts  economics.ts  types.ts
  core/    pure, DOM-free calculation functions (the asset — guarded by tests)
           energy.ts  scenario.ts  simulate.ts  pairing.ts  indices.ts
  ui/      thin DOM layer: reads data, calls the core, renders
test/
  core.test.ts   golden values pinned from the prototype + unit tests
```

- **All fish/crop/scale/economics assumptions live in `src/data/`** — edit those
  files to update defaults; nothing economic is hard-coded elsewhere.
- `src/core/` mirrors the calculation reference in HANDOFF.md §4
  (`computeScenario`, `simulateMonthly`, `pairFishPlant`, `indexScore`, …)
  and never touches the DOM.
- The UI keeps the prototype's markup/CSS and re-renders live on any input.

## Domain notes

Key semantics that must survive future changes (HANDOFF.md §2):

- Lease-vs-rent are mutually exclusive property scenarios — construction CAPEX
  belongs to *lease only*.
- The model **buys** juveniles; it does not breed. FCR defaults are biological
  (optimistic) — an economic-FCR/survival input is the highest-value next fix.
- A "poor" fish↔crop pairing is not a hard block — it implies a decoupled
  (separate-loop) design.
- All monetary defaults are dated 2026 point estimates; provenance in
  HANDOFF.md §7.

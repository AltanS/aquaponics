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

## Data pipeline

Reference data lives in human-editable YAML files under `/data/` at repo root.
A build-time codegen script validates them and emits a typed TypeScript artifact.

### File layout

```
data/
  fish.yaml              # universal biology — 11 species (fcr, temp band, growMonths, …)
  crops.yaml             # universal biology — 11 crops (yld, cycleDays, temp ranges, …)
  scales.yaml            # 4 scale tiers (hobby → mid; harvest targets, build standards, …)
  regions/
    berlin-brandon.yaml  # Berlin/Brandenburg region: climate block + all economics + prices
```

**Taxonomy:** Biology (fish.yaml, crops.yaml) is region-independent — no prices, no display strings. Prices and economics live in the region file. Derived values (heatDemand, suitability) are never stored.

### Running the codegen

```sh
pnpm run build:data
```

This runs `scripts/build-data.ts` which:
1. Parses all YAML files with the `yaml` package.
2. Validates every entity against a `zod` schema — errors name file, entity, field, and expected unit.
3. Emits `src/data/generated.ts` — a deterministic, sorted, byte-reproducible TypeScript file.

The generated file is **checked in** so Vite and vitest can import it at zero runtime cost (no YAML parsing in production). `pnpm test` and `pnpm build` both wire `build:data` as a pre-step so CI stays fresh.

### Why generated.ts is checked in

- Zero runtime dependencies: `zod` and `yaml` are devDeps only — the bundle is pure TypeScript.
- Fast imports: no file I/O at startup.
- CI re-validates YAML via `test/schema.test.ts` — a bad edit fails immediately.
- Diffs are readable: the generated file is sorted and human-inspectable.

### Editing existing data

1. Edit the relevant YAML file (add a comment citing the source if you change a value).
2. Run `pnpm run build:data` to regenerate `src/data/generated.ts`.
3. Run `pnpm test` to confirm existing golden tests still pass (or re-pin if you intentionally changed a value).
4. Commit both the YAML and the generated file.

### Adding a new region

1. Create `/data/regions/<region-id>.yaml` with all required blocks:
   - `meta:` header (`schemaVersion`, `region`, `lastUpdated`, `notes`)
   - `climate:` block (`climateZone`, `monthlyAmbientC` 12-element array, `supplementalLight` bool array)
   - `enclosure:` block (`type`, `heatLossFactor`)
   - `economics:` block (all energy constants, property, finance, `fishPrices`, `cropPrices`)
2. Add the new region id to the region enum in `scripts/build-data.ts` (zod schema).
3. Add the region option to the `<select id="region-select">` in `index.html`.
4. Run `pnpm run build:data` and commit all three changes.

### Adding a new species or crop

1. Add an entry to `data/fish.yaml` or `data/crops.yaml` following the existing pattern. Add a comment citing your data source.
2. Add its price to every region file under `fishPrices:` or `cropPrices:`.
3. Run `pnpm run build:data`. The generated ID union type (`FishId`, `CropId`) updates automatically.
4. Run `pnpm test` to confirm the schema test passes.

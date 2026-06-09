# Aquaponics Profitability Calculator

Interactive feasibility model for commercial aquaponics. Pick a region, a fish, a
crop and a scale, tune the inputs, and the model live-computes whether the venture
pays back — and when. Vite + TypeScript rebuild of the original single-file
prototype (`aquaponics-calculator.html`, kept as the behavioural reference —
see `HANDOFF.md` for the full domain handoff).

## What it does

- **Lease vs. rent, head to head.** Compares building your own structure on cheap
  land (lease) against renting an existing one — one aligned table, with the
  break-even date as the headline. The single green accent marks whichever option
  actually breaks even first (it moves with the numbers, or marks neither).
- **Time-to-payback, not just steady profit.** A monthly cash-flow model accounts
  for the grow-out ramp (no fish income until the fish reach market size, no crop
  income until the first cycle), so the chart shows the cash valley → payback
  J-curve, not an idealised flat year.
- **Three honest profit views.** Operating cash (before paying yourself),
  profit after paying yourself a wage, and accounting profit after depreciation —
  shown as parallel lenses, not a misleading running total.
- **Fish × crop pairing.** The selected fish sets the shared loop temperature;
  each crop is rated good / workable / poor against it (poor = a decoupled design,
  never a hard block).
- **Energy modelling.** Heat demand derived from the species' temperature band,
  the region's monthly climate and the enclosure; optional solar PV and heat pump
  with a full energy balance.
- **Region-aware.** Seven regions (Berlin/Brandenburg, Spain, Turkey, USA West &
  East, Australia, Thailand), each with its own climate, economics, per-species/
  -crop prices, **local currency** (headline figures also show a rough `≈ €`
  comparison) and **capital-subsidy programmes** with real, sourced eligibility
  gates.
- **Everything is an editable assumption.** All defaults come from version-
  controlled YAML (`data/`); your in-browser tweaks persist locally. Figures are
  dated point estimates — the UI says so, and rounds break-even to a range rather
  than feigning precision.

## Run

```sh
pnpm install
pnpm dev         # dev server
pnpm build       # typecheck + production build → dist/ (regenerates data first)
pnpm test        # golden-value + unit tests + YAML schema/staleness checks
pnpm build:data  # regenerate src/data/generated.ts after editing /data/*.yaml
```

A `pre-push` git hook in `.githooks/` runs the tests before every push
(activated via `core.hooksPath` by the `prepare` script on `pnpm install`).

### Tailscale access

`pnpm dev` / `pnpm preview` listen on **all interfaces, port 5174**
(`vite.config.ts`: `host: true`; 5173 belongs to `../tgl` on this host —
override with `PORT=…`). Tailscale MagicDNS hostnames (`bluefin`,
`*.tailnet.internal`, `*.ts.net`) are allowlisted through Vite's Host-header
check; other Host values get a 403. Open `http://bluefin:5174/` (or the
node's `100.x` Tailscale IP) from any device on the tailnet.

## Architecture

Data / logic / UI are strictly separated (HANDOFF.md §6):

```
data/              human-editable YAML reference data (source of truth)
  fish.yaml  crops.yaml  scales.yaml  regions/berlin-brandenburg.yaml
scripts/
  build-data.ts    YAML → zod validation → src/data/generated.ts codegen
src/
  data/    generated artifact + shared types — read-only at runtime
           generated.ts (checked in)  types.ts  berlin-defaults.ts
  core/    pure, DOM-free calculation functions (the asset — guarded by tests)
           energy.ts  scenario.ts  simulate.ts  derive.ts  pairing.ts  indices.ts
  ui/      thin DOM layer: reads data, calls the core, renders
test/
  core.test.ts     golden values pinned from the prototype + unit tests
  schema.test.ts   YAML validation + generated.ts staleness guard
```

- **All fish/crop/scale/economics assumptions live in `/data/*.yaml`** — edit
  those files to update defaults; nothing economic is hard-coded elsewhere.
- `src/core/` mirrors the calculation reference in HANDOFF.md §4
  (`computeScenario`, `simulateMonthly`, `pairFishPlant`, `indexScore`, …)
  and never touches the DOM.
- The UI is organised into main tabs (Results · Scale & costs · Fish & plants ·
  Energy · Subsidies) under a sticky header that keeps the four key metrics and a
  cash-flow sparkline visible while adjusting variables. It re-renders live on any
  input. Headline money figures in non-EUR regions carry a small comparison-only
  "≈ €" companion (a dated FX rate per region file — not a quote).
- **Local persistence:** the whole session (selections, toggles, active tab,
  every input value) is stored in the browser via
  [TinyBase](https://tinybase.org/) (`src/ui/persist.ts`, localStorage key
  `aquaponics-calculator`) — same library/pattern as `~/playground/synth`.
  Reloading restores the exact session; the **Reset** button in the tab bar
  wipes it back to defaults. TinyBase is the app's only runtime dependency.

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
- Per-species/per-crop real-world feasibility research (grower forums, blogs,
  commercial cases) lives in `docs/research/` — rankings, cross-cutting themes,
  and the model-corrections table that drove the current YAML values.

## Data pipeline

Reference data lives in human-editable YAML files under `/data/` at repo root.
A build-time codegen script validates them and emits a typed TypeScript artifact.

### File layout

```
data/
  fish.yaml                   # universal biology — 11 species (fcr, temp band, growMonths, marketWeightKg, wiki, …)
  crops.yaml                  # universal biology — 12 crops (yld, cycleDays, temp ranges, unit weights, wiki, …)
  scales.yaml                 # 4 scale tiers (hobby → mid; harvest, build standards, total + owner labour hrs)
  model.yaml                  # model assumptions — labour/energy attribution shares, cropAreaFraction (canopy ÷ footprint)
  regions/                    # one self-contained file per region (loaded automatically)
    berlin-brandenburg.yaml   #   meta+currency, climate, enclosure, economics (+ price overrides), subsidies
    spain.yaml  turkey.yaml  usa-west.yaml  usa-east.yaml  australia.yaml  thailand.yaml
```

**Taxonomy:** Biology (fish.yaml, crops.yaml) is region-independent — no prices, no display strings. Everything that varies by place lives in the region file: climate, enclosure, economics, per-species/-crop price overrides (a missing id falls back to the universal price), the local **currency**, and that region's **capital-subsidy programs**. Derived values (heatDemand, suitability, annualMeanAmbientC) are never stored — they're computed. The codegen emits a `REGIONS` map + `RegionId` union from every `regions/*.yaml`; `berlin-brandenburg` is the default and backs the legacy `ENERGY`/`PROPERTY`/`FINANCE`/`SUBSIDIES`/`REGION` exports the pure core + golden tests use.

### Running the codegen

```sh
pnpm run build:data
```

This runs `scripts/build-data.ts` which:
1. Parses all YAML files with the `yaml` package.
2. Validates every entity against a `zod` schema — errors name file, entity, field, and expected unit.
3. Emits `src/data/generated.ts` — a deterministic, sorted, byte-reproducible TypeScript file.

The generated file is **checked in** so Vite and vitest can import it at zero
runtime cost (no YAML parsing in production). `pnpm build` regenerates it as a
pre-step (`prebuild`); **tests deliberately do not** — instead a staleness test
in `test/schema.test.ts` regenerates in memory and compares against the
checked-in file. If you edit YAML without regenerating, `pnpm test` (and
therefore the pre-push hook) fails with:

```
src/data/generated.ts is stale — run `pnpm build:data` and commit the result
```

> **Watch-mode caveat:** `pnpm test:watch` does not re-run codegen when you edit
> YAML files. Run `pnpm build:data` after a data edit, then re-run the tests.

### Why generated.ts is checked in

- No data-pipeline code in the bundle: `zod` and `yaml` are devDeps only — the data ships as plain TypeScript.
- Fast imports: no file I/O at startup.
- CI re-validates YAML via `test/schema.test.ts` — a bad edit fails immediately.
- Diffs are readable: the generated file is sorted and human-inspectable.

### Editing existing data

1. Edit the relevant YAML file (add a comment citing the source if you change a value).
2. Run `pnpm run build:data` to regenerate `src/data/generated.ts`.
3. Run `pnpm test` to confirm existing golden tests still pass (or re-pin if you intentionally changed a value).
4. Commit both the YAML and the generated file.

### Adding a new region

The codegen loads **every** `data/regions/*.yaml` automatically and emits the
`REGIONS` map, the `RegionId` union and the region `<select>` from it — no code
changes needed. **Only add a region when you have real, sourced numbers for it**
(see `docs/research/` for why fabricated zone data is the failure mode to avoid).

1. Create `/data/regions/<region-id>.yaml` with all required blocks
   (mirror `berlin-brandenburg.yaml`):
   - `meta:` header — `schemaVersion`, `region` (must equal the filename id),
     `label`, `currency:` (`code`, `symbol`, `locale`, `fxToEur` — EUR per 1
     local unit, a dated rate driving the comparison-only "≈ €" companion;
     use `1` for EUR regions), `lastUpdated`, `notes`
   - `climate:` block — `climateZone`, `monthlyAmbientC` (12 numbers), `supplementalLight` (12 bools)
   - `enclosure:` block — `type`, `heatLossFactor`
   - `economics:` block — all energy constants, `rentPerM2Month`, `wage`,
     `deprYears`, `horizonYears`, plus `fishPrices`/`cropPrices` overrides
     (partial — any omitted id falls back to the universal price). **All money
     in the region's local currency.**
   - `subsidies:` block — region-scoped capital grants (`rate`, `basis`, caps,
     eligibility gates, `source`/`sourceLabel`/`note`)
2. Run `pnpm run build:data`, then `pnpm test`, and commit the YAML + regenerated
   `generated.ts` together. The build validates currency, climate-array lengths,
   and that every price-map key references a real fish/crop id.

### Adding a new species or crop

1. Add an entry to `data/fish.yaml` or `data/crops.yaml` following the existing pattern. Add a comment citing your data source.
2. Add its price to every region file under `fishPrices:` or `cropPrices:`.
3. Run `pnpm run build:data`. The generated ID union type (`FishId`, `CropId`) updates automatically.
4. Run `pnpm test` to confirm the schema test passes.

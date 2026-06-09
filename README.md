# Aquaponics Profitability Calculator

Interactive feasibility model for commercial aquaponics. Pick a region, a fish, a
crop and a scale, tune the inputs, and the model live-computes whether the venture
pays back — and when. Vanilla TypeScript + Vite; the original single-file
prototype is kept as `aquaponics-calculator.html` for reference.

## What it does

- **Lease vs. rent, head to head.** Compares building your own structure on cheap
  land (lease) against renting an existing one — one aligned table, with the
  break-even date as the headline. The single green accent marks whichever option
  actually breaks even first (it moves with the numbers, or marks neither).
- **Time-to-payback, not just steady profit.** A monthly cash-flow model accounts
  for the grow-out ramp (no fish income until the fish reach market size, no crop
  income until the first cycle), so the chart shows the cash valley → payback
  J-curve, not an idealised flat year.
- **Three honest profit views.** Operating cash (before paying yourself), profit
  after paying yourself a wage, and accounting profit after depreciation — shown
  as parallel lenses, not a misleading running total.
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
  controlled YAML; your in-browser tweaks persist locally. Figures are dated point
  estimates — the UI says so, and rounds break-even to a range rather than feigning
  precision.

## Run

```sh
pnpm install
pnpm dev         # dev server
pnpm build       # typecheck + production build → dist/ (regenerates data first)
pnpm test        # golden-value + unit tests + YAML schema/staleness checks
pnpm build:data  # regenerate src/data/generated.ts after editing /data/*.yaml
```

A `pre-push` git hook runs the tests before every push. `pnpm dev` / `pnpm preview`
serve on all interfaces, port 5174 (override with `PORT=…`); Tailscale MagicDNS
hosts are allow-listed, so `http://bluefin:5174/` works from any device on the
tailnet.

## Architecture

Data, logic and UI are strictly separated:

```
data/              human-editable YAML reference data (the source of truth)
  fish.yaml  crops.yaml  scales.yaml  model.yaml  regions/*.yaml
scripts/
  build-data.ts    YAML → zod validation → src/data/generated.ts codegen
src/
  data/   generated artifact + shared types (read-only at runtime)
  core/   pure, DOM-free calculation functions — guarded by golden tests
  ui/     thin DOM layer: reads data, calls the core, renders
test/
  core.test.ts     golden values + unit tests
  schema.test.ts   YAML validation + generated.ts staleness guard
```

- **All economic assumptions live in `/data/*.yaml`** — nothing is hard-coded.
- `src/core/` is pure and DOM-free (`computeScenario`, `simulateMonthly`,
  `pairFishPlant`, `indexScore`, …) — the asset; changing it means re-pinning the
  golden tests.
- The UI re-renders live on any input. Tabs: Results · Scale & costs ·
  Fish & plants · Energy · Subsidies, under a sticky header with the key metrics.
- **Persistence:** the whole session (selections, toggles, every input) is stored
  in the browser via [TinyBase](https://tinybase.org/) (localStorage); the
  **Reset** button wipes it back to defaults. TinyBase is the only runtime
  dependency.

## Domain notes

- Lease and rent are mutually exclusive property scenarios — construction CAPEX
  belongs to *lease only*.
- The model **buys** juveniles; it does not breed (some species, e.g. African
  catfish and freshwater prawn, can't complete their lifecycle in the loop anyway).
- A "poor" fish↔crop pairing is not a hard block — it implies a decoupled
  (separate-loop) design.
- Per-species/per-crop feasibility research (grower forums, commercial cases,
  the model-corrections table behind the YAML values) lives in `docs/research/`.

## Known limitations

A feasibility estimate, not a business plan:

- **FCR is biological (optimistic)** — no survival rate, so real "economic" feed
  and juvenile costs run higher. Matters more for comparing species than for the
  break-even of any one.
- **Seasonal energy is flattened** to an annual self-consumption %, which flatters
  winter (heat demand peaks exactly as PV collapses).
- **All-cash financing** — year 0 is a single CAPEX outflow; no debt or interest.
- **Not modelled:** tax/VAT, working capital, and regulatory overhead (permits,
  effluent rules, food-hygiene registration) — all real time and money.
- **Figures are dated point estimates** with wide error bars; high-value niche
  species (pikeperch, prawn, noble crayfish) are especially soft.

## Working with the data

`scripts/build-data.ts` parses the YAML, validates every entity against a `zod`
schema (errors name the file, entity, field and expected unit), and emits
`src/data/generated.ts` — a deterministic, sorted, **checked-in** artifact so the
app imports data at zero runtime cost (`zod`/`yaml` stay devDeps). `pnpm build`
regenerates it; tests don't — instead a staleness guard regenerates in memory and
fails if the checked-in file is out of date (`run pnpm build:data and commit the
result`).

**Taxonomy.** Biology (`fish.yaml`, `crops.yaml`) is region-independent — no prices,
no display strings. Everything place-specific lives in a region file: climate,
enclosure, economics, per-species/-crop price overrides (a missing id falls back to
the universal price), the local currency, and that region's subsidy programmes.
Derived values (heat demand, suitability, mean ambient temp) are computed, never
stored.

**Editing data:** edit the YAML (cite the source in a comment), run `pnpm build:data`,
run `pnpm test`, and commit the YAML + regenerated `generated.ts` together.

**Adding a region:** drop a `data/regions/<id>.yaml` in (mirror
`berlin-brandenburg.yaml`) — the codegen auto-loads it into the `REGIONS` map, the
`RegionId` union and the region selector, no code changes. It needs `meta`
(incl. `currency` with `fxToEur` — EUR per local unit, `1` for EUR regions),
`climate` (12 monthly temps + supplemental-light flags), `enclosure`, `economics`
(all money in local currency, with `fishPrices`/`cropPrices` overrides) and
`subsidies`. **Only add a region with real, sourced numbers** — see `docs/research/`
for why fabricated zone data is the failure mode to avoid.

**Adding a species/crop:** add the entry to `fish.yaml`/`crops.yaml`, add its price
to each region's `fishPrices`/`cropPrices`, then `pnpm build:data` (the `FishId` /
`CropId` unions update automatically) and `pnpm test`.

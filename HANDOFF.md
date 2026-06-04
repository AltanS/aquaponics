# Aquaponics Profitability Calculator — Engineering Handoff

**Status:** working prototype as a single self-contained `aquaponics-calculator.html` (vanilla JS, no build step, no dependencies except Google Fonts).
**Goal of next phase:** move into a repository and turn it into a small, maintainable app with reference data in version-controlled YAML/JSON and (optionally) a local DB for saved user scenarios.
**Domain:** commercial aquaponics feasibility for the Berlin / Brandenburg region, Germany. All monetary defaults are anchored to **2026** figures (see *Data provenance*). They drift — treat them as dated, not eternal.

---

## 1. What this tool is

An interactive, single-page feasibility model. The user picks a **scale**, a **fish/crustacean species**, and a **crop**, toggles **solar** and **heat pump**, and the tool computes — live — a **lease-vs-rent** comparison, a **month-by-month cash-flow ramp**, a **break-even point**, and supporting breakdowns. Every assumption is editable; the species/crop/scale presets just seed sensible starting values.

The current build is the source of truth for behaviour. The rebuild should reproduce its outputs (capture golden values first — see §6).

---

## 2. Key decisions made (the "why", which must survive the rewrite)

These are domain choices, not implementation details. They encode the actual business logic.

1. **Grounded to Berlin/Brandenburg 2026.** Commercial grid power ~25 ct/kWh, on-site solar ~6–10 ct/kWh, EEG feed-in ~7 ct/kWh, statutory minimum wage €13.90/h (loaded ≈ €17/h). Defaults reflect **direct / restaurant sales channels**, not wholesale — wholesale roughly halves prices and makes the model hopeless, which is itself a finding.

2. **Energy is solar-first with an electric heat pump, and both are real CAPEX** (not amortised into a per-kWh LCOE). Self-consumed solar costs only a small O&M figure; surplus is exported at the feed-in tariff; the rest is grid import. Heat pump converts thermal demand to electricity via a seasonal COP (SCOP). Toggling either off removes its CAPEX and shifts the running bill (heat pump off → gas boiler at a gas price).

3. **Two property scenarios, mutually exclusive:**
   - **Lease & build** — cheap land lease + you build the structure (construction CAPEX, €/m²). Cold-winter spec for commercial tiers (insulated greenhouse ~€350/m²); hobby tier uses a polytunnel rate (~€90/m²).
   - **Rent existing** — no construction CAPEX, but real monthly commercial rent (€/m²/month).
   - Both share equipment, solar, and heat-pump CAPEX. **Do not** put construction in both — that double-counts the building.

4. **Scale ladder is honest and consistent:** `hobby → pilot → small → mid`. (Earlier naming `micro/small/mid` was misleading because "micro" was actually a €35k+ commercial pilot. Hobby is the genuinely lean DIY rig.) Build standard (€/m²) and land lease travel with the scale.

5. **Grow-out / crop-cycle ramp-up is modelled.** Fish earn nothing until the first cohort reaches market size (`growMonths`); crops earn nothing until the first cycle completes (`cycleDays`); **costs run from month 1.** This produces a realistic cash valley and pushes break-even well past the naive `CAPEX / annual-profit` figure. Continuous stocking is assumed (smooth ramp, not lumpy batches).

6. **The model assumes you BUY juveniles and grow them out — it does NOT breed.** The "juvenile cost (€/kg)" line is the fingerling/post-larvae purchase. This matters because most listed species can't realistically be bred on-site (African catfish needs hormone induction; *Macrobrachium* prawn larvae need brackish water and can't close their lifecycle in freshwater; pikeperch/perch have hard hatchery/weaning stages). Only tilapia and redclaw crayfish breed readily in-tank.

7. **Fish drive plant compatibility via water temperature.** In a coupled loop the fish set the temperature and the plant roots live in it. Each fish has a comfort band whose midpoint is the **loop temperature**; each crop has a preferred and a tolerable root-zone range. Pairing is rated good / workable / poor. "Poor" is not impossible — it implies a *decoupled* design (separate loops), which is a legitimate but costlier setup.

8. **FCR (feed-conversion ratio) is used** for feed cost: `feed = harvest_kg × FCR × feed_price`. **Open caveat:** current FCR defaults are biological (best-case, surviving fish). Real feasibility wants **economic FCR** (feed bought ÷ fish sold), which is 30–60% higher due to mortality and waste. A **survival-rate** input is recommended (see §5) — not yet built.

9. **Index scores** give a quick economic read: crops scored on revenue density (`yield × price`), fish on gross margin (`price − FCR×feed_price − juvenile_cost`), each normalised 0–100 across its set.

10. **All assumptions are centralised** in one `DB` object and surfaced via a collapsible "Config" accordion. This is the thing to externalise into data files.

---

## 3. Data model (what goes into YAML/JSON)

Current in-code shape, with units. Recommend one file per top-level entity. **Reference data is read-only and version-controlled** — it is NOT user data.

### `fish.yaml` — keyed by species id
```yaml
catfish:
  label: "African catfish"
  type: "Fish"            # Fish | Crustacean
  price: 9                # €/kg, direct-sale
  fcr: 1.1                # feed kg per kg live weight (BIOLOGICAL — see §5)
  stock_cost: 0.8         # €/kg produced — bought-in juveniles
  heat_factor: 1.0        # multiplier on a scale's base heat demand
  grow_months: 7          # grow-out to market size (revenue lag)
  fc_min: 25              # comfort water temp band °C (min)
  fc_max: 28              # comfort water temp band °C (max) — midpoint = loop temp
  temp: "25–28°C"         # display string
  growout: "6–9 mo"       # display string
  difficulty: "Easy"      # Easy | Medium | Hard
  notes: "…"
  # RECOMMENDED ADDITIONS:
  # sourcing: "buy fingerlings (hormone-induced hatchery)"
  # survival: 0.90        # see §5
  # fcr_basis: "biological"  # or "economic"
```
Full set: `catfish, tilapia, trout, carp, perch, pikeperch, archar, sturgeon, redclaw, prawn, noblecray`.

### `crops.yaml` — keyed by crop id
```yaml
greens_mix:
  label: "Mixed leafy greens"
  cat: "Leafy"            # Leafy | Herb | Microgreen
  yld: 28                 # kg / m² / yr  (NOTE: stored as `yld`, "yield" is reserved-ish)
  price: 4.5              # €/kg
  seed_cost: 9            # €/m²/yr
  cycle_days: 38          # days to first harvest (revenue lag)
  c_min: 14               # preferred root-zone °C (min)  → "good" pairing
  c_max: 22               # preferred root-zone °C (max)
  ca_min: 8               # tolerable root-zone °C (min)  → "workable" pairing
  ca_max: 26              # tolerable root-zone °C (max)
  temp: "15–22°C"; cycle: "30–45 d"; system: "Raft (DWC)"; difficulty: "Easy"; notes: "…"
```
Full set: `greens_mix, lettuce_head, lettuce_leaf, rocket, basil, spinach, chard, pakchoi, feldsalat, herbs, microgreens`.

### `scales.yaml` — keyed by scale id (`hobby, pilot, small, mid`)
```yaml
small:
  label: "Small commercial"
  fish_kg: 3000           # steady annual harvest, kg live
  grow_area: 400          # m²
  sys_kwh: 40000          # systems electricity kWh/yr (pumps/air/lights/controls)
  base_heat: 55000        # base thermal demand kWh/yr (× fish.heat_factor)
  pv_kwp: 50              # default PV array size
  labor_hrs: 30           # hours/week
  water_nut: 2000; distrib: 3500; maint: 4000  # €/yr each
  equipment_capex: 110000 # €, RAS/tanks/beds/pumps (both scenarios)
  construction_per_m2: 350# €/m² build (lease scenario only)
  land_lease_year: 3000   # €/yr (lease scenario)
```

### `economics.yaml` — global constants
```yaml
energy:
  feed_price: 1.6         # €/kg feed
  cop: 3.0                # heat-pump SCOP
  pv_yield: 950           # kWh/kWp/yr (Brandenburg)
  sc_rate: 55             # % of PV self-consumed
  grid_price: 0.25        # €/kWh import
  feed_in: 0.07           # €/kWh export
  gas_price: 0.11         # €/kWh thermal (heat pump OFF)
  om_solar: 0.015         # €/kWh self-used (PV O&M)
  pv_cost_per_kwp: 1200   # € installed
  hp_cost_per_kw: 1100    # €/kW thermal
  hp_full_load_hours: 2000# h/yr, for HP sizing
property:
  rent_per_m2_month: 4.5  # € (rent scenario)
finance:
  wage: 17                # €/h loaded
  depr_years: 12
  horizon_years: 15       # cash-flow chart/table horizon
```

**Recommendation:** add a `sources`/`provenance` block (value → citation + "last_verified" date) so price drift is auditable. Consider min/likely/max ranges per value to enable sensitivity analysis later.

---

## 4. Calculation reference (port these as pure, tested functions)

All in one place so the rebuild can mirror them exactly.

**Revenue (steady state, annual)**
```
fish_rev  = fish_kg * fish_price
plant_rev = grow_area * yield_m2 * plant_price
revenue   = fish_rev + plant_rev
```

**Variable inputs (annual)**
```
feed   = fish_kg * fcr * feed_price
stock  = fish_kg * stock_cost          # bought-in juveniles
seed   = grow_area * seed_cost
inputs = feed + stock + seed
```

**Energy (annual), depends on solar/heat-pump toggles**
```
heat_elec = heatpump ? heat_demand / cop : 0
gas_cost  = heatpump ? 0 : heat_demand * gas_price
demand    = sys_kwh + heat_elec
gen       = solar ? pv_kwp * pv_yield : 0
self_used = min(demand, gen * sc_rate/100)
imp       = max(0, demand - self_used)
exp       = max(0, gen - self_used)
elec_cost = imp*grid_price + self_used*om_solar - exp*feed_in
energy_opex   = elec_cost + gas_cost
effective_kwh = energy_opex / demand
```

**Energy CAPEX**
```
pv_capex = solar ? pv_kwp * pv_cost_per_kwp : 0
hp_capex = heatpump ? (heat_demand / hp_full_load_hours) * hp_cost_per_kw : 0
```

**Per scenario (`key` ∈ {lease, rent})**
```
labor        = labor_hrs * 52 * wage
rent         = key=="lease" ? land_lease_year : rent_per_m2_month * grow_area * 12
overheads    = water_nut + distrib + maint
opex         = inputs + energy_opex + labor + rent + overheads
ebitda       = revenue - opex                          # "steady profit/yr"
construction = key=="lease" ? construction_per_m2 * grow_area : 0
capex        = equipment_capex + construction + pv_capex + hp_capex
depreciation = capex / depr_years
net          = ebitda - depreciation                   # steady net after deprec.
```

**Ramp simulation (monthly, horizon×12 months)** — this is what makes break-even realistic
```
Lf = grow_months          # months
Lc = cycle_days / 30      # months
cum = -capex              # month 0
for m in 1..horizon*12:
    fish_m  = (m > Lf) ? fish_rev/12  : 0
    plant_m = (m > Lc) ? plant_rev/12 : 0
    cum += fish_m + plant_m - opex/12
break_even_year = first m where cum crosses 0, interpolated, /12   (else null)
```
Year-by-year table aggregates the same monthly stream into calendar years; year 0 row = `-capex`.

**Fish↔plant temperature pairing**
```
loop_temp = (fc_min + fc_max) / 2
good     if c_min  <= loop_temp <= c_max
workable if ca_min <= loop_temp <= ca_max   (and not good)
poor     otherwise   → implies decoupled design
```

**Index scores** (normalise across the respective set, clamp 0–100)
```
crop_value = yield_m2 * plant_price
fish_value = fish_price - fcr*feed_price - stock_cost
index(v, all) = round( (v - min(all)) / (max(all) - min(all)) * 100 )
```

---

## 5. Open challenges & known limitations

Ordered roughly by impact on the headline numbers.

1. **Biological vs economic FCR + survival rate (highest-value fix).** Defaults are biological/optimistic. Add a per-species `survival` (0.85–0.95). Then `economic_fcr ≈ biological_fcr / survival` (feed for dead fish is wasted), and `effective juvenile cost ≈ stock_cost / survival` (you stock more than you sell). This corrects both feed and stocking lines. Note: feed is a *small* slice of total OPEX here (German labour+energy dominate), so this matters more for species comparison than for break-even.

2. **Seasonal energy is flattened.** A single annual self-consumption % flatters winter, when heating demand peaks exactly as PV collapses. A monthly energy model (PV generation curve vs. heating-degree-day load) would compute realistic self-consumption and could justify battery storage or winter gas backup. Significant effort; high realism payoff.

3. **All-cash financing.** Year 0 is a single CAPEX outflow. Real projects use debt — add a loan (principal, rate, term) producing an annuity that hits annual cash flow, which changes the cash valley and break-even materially.

4. **Loop temperature is locked to the fish comfort midpoint.** A user can't model running a warm-water loop cooler to accommodate cool-season greens. A decoupled-loop mode (two independent temperatures, extra plumbing CAPEX) is the natural extension of decision #7.

5. **Continuous stocking assumed.** Real batch stocking gives lumpy, periodic harvests rather than the smooth ramp. Could add a batch/cohort scheduling mode.

6. **Full feed from month 1 is slightly conservative** — real feed tracks the growing biomass (lower early). Acceptable for feasibility (errs safe).

7. **Fingerling/juvenile sourcing not modelled as a constraint.** Niche species (pikeperch, perch, *Macrobrachium* post-larvae) are hard to source and pricey in Germany; some require specific hatcheries. Consider a `sourcing` attribute and availability flag.

8. **Not modelled at all:** tax, VAT, working capital, insurance nuances, and — importantly — **regulatory overhead** (fish-farming permits, effluent/water rules, food-hygiene registration), which is real time and money. Document as out-of-scope or add a coarse compliance-cost line.

9. **Data is indicative and dated.** Prices (electricity, feed-in, wage, rents, fish/produce) are 2026 point estimates with real uncertainty. High-value-species economics (pikeperch, prawn, noble crayfish) are especially soft.

---

## 6. Recommendations for the rebuild

### Architecture: separate data / logic / UI
- **Reference data** → `/data/*.yaml` (or JSON), version-controlled, validated by schema (zod for TS, pydantic for Python). This replaces the in-code `DB` object. Read-only at runtime.
- **Calculation core** → a dependency-free, DOM-free module of pure functions mirroring §4 (`computeScenario`, `simulateMonthly`, `breakEven`, `pairFish Plant`, `indexScores`). 100% unit-testable. This is the asset; guard it with tests.
- **UI** → thin layer that reads data + calls the core + renders. Keep charts simple (the current hand-rolled SVG is fine, or swap to Recharts/visx).

### Suggested stack (pick per team)
- **Pure static SPA:** Vite + React + TypeScript. Data shipped as JSON (compile YAML→JSON at build). No backend needed. Easiest deploy.
- If you want **saved user scenarios / sharing:** add persistence. **Keep reference data and user data separate.** Reference data stays in the repo; user scenarios go in a store:
  - Frontend-only: IndexedDB (e.g. via `idb`) or `localStorage` for a single user. (Note: the current artifact constraints forbade browser storage; that limit does **not** apply outside the artifact sandbox.)
  - With a backend: SQLite (via Prisma/Drizzle or SQLModel) — ideal for "small app with a local db". One table for `scenarios` (JSON blob of inputs + a label + timestamp). Backend only justified if multi-user or server-side compute is wanted; otherwise stay static.

### Proposed repo structure
```
/data
  fish.yaml  crops.yaml  scales.yaml  economics.yaml  sources.yaml
/src
  /core        # pure calc functions (no DOM)  + types
  /data        # loader + schema validation
  /ui          # components, charts
  /scenarios   # save/load (IndexedDB or API client)
/test
  core.test.ts # golden-master + unit tests
/docs
  ASSUMPTIONS.md  # every default + citation + last_verified date
  HANDOFF.md      # this file
```

### Testing — capture golden values FIRST
Before refactoring, open the current HTML, record outputs for a few fixed input sets, and pin them as regression tests so the port can't silently drift. Minimum set:
- **Default scenario:** scale=small, fish=catfish, crop=greens_mix, solar=on, heatpump=on. Record: lease CAPEX, lease steady EBITDA, lease net, lease break-even; same for rent; effective €/kWh.
- **Cold-water:** fish=trout, crop=lettuce_head — verify pairing = "good" and a deeper/later break-even from the 14-month grow-out.
- **Toggles off:** solar off, heat pump off — verify CAPEX drops and energy OPEX rises.
- **Edge:** a long grow-out species (noblecray, 30 mo) — verify break-even pushes out or returns "never".

### Other recommendations
- Centralise **units and currency**; never inline magic numbers — they belong in `/data`.
- Add a **data vintage** banner and a re-verification cadence; several inputs are time-sensitive (energy prices, feed-in, wage, rents).
- Plan for **i18n (DE/EN)** given the German market and audience.
- Future feature worth designing for now: **sensitivity / Monte-Carlo** over the min/likely/max ranges (esp. fish price, FCR/survival, energy price) — far more honest than point estimates for a feasibility tool.
- Keep the **"poor pairing → decoupled loop"** semantics; don't let a refactor turn it into a hard block.

---

## 7. Data provenance (carry into `ASSUMPTIONS.md`, re-verify dates)

All figures gathered ~mid-2026 for Berlin/Brandenburg. Re-verify before relying on them.

- **Grid electricity (commercial/Gewerbe):** ~25 ct/kWh — BDEW / Bundesnetzagentur.
- **Solar PV cost / LCOE (commercial rooftop):** ~6–10 ct/kWh self-generated — Fraunhofer ISE.
- **Feed-in tariff (EEG 2026):** ~7–8 ct/kWh for small surplus.
- **PV specific yield:** ~950 kWh/kWp/yr (Brandenburg).
- **Agricultural land lease:** ~168 €/ha/yr arable, Brandenburg (range ~100–290) — Amt für Statistik Berlin-Brandenburg / Destatis.
- **Commercial hall/production rent:** ~€3.5–5.7/m²/month, Berlin ring.
- **Minimum wage 2026:** €13.90/h gross; loaded ≈ €17/h with employer contributions.
- **Direct-sale fish (€/kg):** trout ~13–16, catfish ~9, tilapia ~11, perch ~16, pikeperch ~22, char ~17, sturgeon ~14; crustaceans redclaw ~25, prawn ~28, noble crayfish ~35 (last three indicative/niche).
- **Direct-sale produce (€/kg):** leafy mix ~4.5, head lettuce ~4, baby leaf ~6, rocket ~11, basil ~14, herbs ~12, lamb's lettuce ~13, microgreens ~40.
- **FCR (feed-conversion):** trout/char 1.0–1.2; tilapia 1.4–1.6; carp ~1.5; channel catfish biological ~1.8 but **economic ~2.5**; farmed fish & shrimp span ~1.0–2.4; freshwater prawns at the high end. Sources: MSU MAFES, FAO, ScienceDirect, sector references. **Distinguish biological vs economic FCR.**
- **Breeding biology:** African catfish (*Clarias*) does not spawn spontaneously in captivity — requires hormone induction. *Macrobrachium rosenbergii* larvae require brackish water (~12 ppt) and cannot complete their lifecycle in a freshwater aquaponics loop. Both imply buying juveniles, not breeding.

---

*End of handoff. The current `aquaponics-calculator.html` is the behavioural reference; when in doubt, match its output, then improve per §5.*

---

## 3. Climate-aware data layer (M1 implementation)

### 3.1 Climate-aware architecture overview

The data layer now models a **region** as the source of three correlated inputs:

- **Climate** — monthly ambient temperature profile (Jan–Dec °C), supplemental light schedule.
- **Economics** — all prices (fish, crops), energy rates, wage, rent/lease rates.
- **Enclosure spec** — type (e.g. insulated-greenhouse) and heat-loss factor (W/m²/°C).

Separating biology (universal) from economics (regional) makes it straightforward to add a second region: create one YAML file, and all derived values update automatically.

### 3.2 Data taxonomy

| Tier | Location | Contents |
|------|----------|----------|
| Universal biology | `data/fish.yaml`, `data/crops.yaml` | FCR, growMonths, temp bands, cycleDays, difficulty — **no prices** |
| Universal structure | `data/scales.yaml` | Scale ladder (hobby → mid), baseHeat, growArea, etc. |
| Regional | `data/regions/<id>.yaml` | All prices (fish + crop price maps), wage, grid/gas/feed rates, climate block, enclosure spec |
| Derived | Never stored | heatDemand, suitability, monthlyHeatDemand — computed in `src/core/derive.ts` |

The YAML files are the single source of truth. `pnpm run build:data` validates them with zod and emits `src/data/generated.ts` (checked in; zero runtime deps).

### 3.3 `derive.ts` function inventory

All functions are pure and DOM-free (`src/core/derive.ts`):

| Function | Description |
|----------|-------------|
| `deriveHeatDemand(species, region, enclosure, scale)` | Annual heat demand kWh/yr. Calibrated so catfish/small = 55000 kWh (= old baseHeat × 1.0 within 0.01%). Uses `REFERENCE_DT=20°C`, `REFERENCE_WATTS_PER_M2=54.608 W/m²`. |
| `deriveSuitability(species, region)` | Returns `'native' \| 'workable' \| 'costly'` based on ΔT (loop − annual mean): ≤5 → native, 5–15 → workable, >15 → costly. |
| `deriveMonthlyHeatDemand(species, region, enclosure, scale)` | 12-element kWh/month array. Sum matches annual within ±2% (calendar-month hours vary). |
| `deriveEffectiveGrowMonths(species, region)` | Nominal growMonths + count of months where ambient < fcMin ("heating off" sensitivity metric — not a hard override). |

### 3.4 Seasonal model

`CalcInputs.monthlyHeatOpex?: number[]` is an optional 12-element array of heat costs in €/month. When passed to `simulateMonthly`, heat is applied per-month rather than flat. Existing callers that omit the field are unaffected.

`inputs.ts` computes `monthlyHeatOpex` from `deriveMonthlyHeatDemand` when the active region is known, enabling a realistic seasonal cash-flow curve (heating costs peak in January, zero in July).

`deriveEffectiveGrowMonths` answers "if heating were off, how many extra months would grow-out take?" — useful for planning sensitivity, not for the main simulation (heating is assumed always on).

### 3.5 Suitability badges

Each fish tab shows a small inline badge: `native` (green), `workable` (amber), or `costly` (red), derived by `deriveSuitability(fish, activeRegion)`. CSS classes: `badge-native`, `badge-workable`, `badge-costly`. Badges are soft warnings — every tab is always selectable (no hard blocks; consistent with the pairing philosophy in §2.7).

### 3.6 Extending the model

**Adding a region:**
1. Create `data/regions/<id>.yaml` with `meta`, `climate`, `enclosure`, and `economics` blocks.
2. Add the id to the region enum in `scripts/build-data.ts`.
3. Add the `<option>` to `index.html` region selector.
4. Run `pnpm run build:data` and commit.

**Adding a species:**
1. Add the entry to `data/fish.yaml` (universal biology, no price).
2. Add `<id>: <price>` to every region's `fishPrices` map.
3. Run `pnpm run build:data`.

**Changing a research correction:**
1. Edit the value in the relevant YAML file.
2. Add or update the inline comment citing your source.
3. Run `pnpm run build:data`, then `pnpm test` — if a golden fails, recompute from the formula and re-pin with a comment showing the arithmetic.
4. Commit YAML + generated.ts + updated test.

---

*End of M1 addendum. The baseline prototype (`aquaponics-calculator.html`) remains the behavioural reference for the original 14 golden tests.*

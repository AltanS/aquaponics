---
status: Not Started
verified: 0/0
updated: 2026-06-04
depends_on:
  - .tracker/M1-M1-climate-data-layer/04-research-corrections-and-re-pin-goldens.md
agent: typescript-expert
template: generic
---

# Seasonal heating and winter-gated grow-out

## Goal

Extend `src/core/derive.ts` with monthly-granularity heat demand and effective grow-month derivations, and thread monthly heat opex into the existing simulate pipeline without breaking current goldens.

## Overview

Currently heating is modelled as a flat annual figure (`heatDemand` kWh/yr). T6 makes it seasonal:

**`deriveMonthlyHeatDemand(species, region, enclosure, scale): number[]`**
- Returns a 12-element array of monthly kWh heat demand.
- Formula: for each month m, `monthlyHeat[m] = max(0, (loopTemp - monthlyAmbientC[m]) / referenceΔT) × enclosure.heatLossFactor × scale.growArea × referenceWattsPerM2 × hoursInMonth / 1000`
- The sum of `deriveMonthlyHeatDemand` must equal `deriveHeatDemand` (annual) within ±2% (calibration consistency check).

**`deriveEffectiveGrowMonths(species, region): number`**
- Returns the effective grow-out duration in months, accounting for winter temperature gating.
- If heating is hypothetically off, in months where `monthlyAmbientC[m] < species.fcMin` the fish's growth rate is zero (below feeding threshold). Count the number of "cold months" and add them as a lag: `effectiveGrowMonths = species.growMonths + coldMonths`.
- `coldMonths` = count of months where `monthlyAmbientC[m] < species.fcMin`.
- For catfish (fcMin=25), in Berlin with an insulated greenhouse running heat, this function answers: "if heating were off, how many extra months would grow-out take?" — this is a model enrichment for planning, not a hard constraint.
- Note: in normal operation heating IS on, so this is a planning/sensitivity metric, not an override of the existing simulate flow.

**Simulation integration (minimal core change preferred):**
- Add an optional `monthlyHeatOpex?: number[]` field to `CalcInputs` (keep it optional so existing call sites and tests are unaffected).
- When `monthlyHeatOpex` is provided, `simulateMonthly` uses the per-month heat cost instead of computing from flat annual heatDemand. Monthly heat opex = `monthlyHeat[m] / COP / gridPrice` (heat pump) or `monthlyHeat[m] / gasPrice × gasPrice` (gas boiler). Implementation note: the existing `computeEnergy` returns annual opex — for monthly mode, distribute proportionally.
- When `monthlyHeatOpex` is absent, existing behaviour is unchanged (golden tests unaffected).
- `src/ui/inputs.ts` should compute and pass `monthlyHeatOpex` when the region is available (using `deriveMonthlyHeatDemand`).

**Tests to add:**
- `deriveMonthlyHeatDemand` returns 12 elements summing within 2% of annual.
- `deriveEffectiveGrowMonths('catfish', berlinRegion)` returns `species.growMonths + coldMonths` (compute coldMonths for catfish fcMin=25 vs Berlin monthly profile).
- `deriveEffectiveGrowMonths('trout', berlinRegion)` — trout fcMin=12, fewer cold months.
- Simulate test with `monthlyHeatOpex` provided produces valid monthly rows (non-regression).

## Requirements

- `deriveMonthlyHeatDemand` in `src/core/derive.ts` — 12-element array, sum matches annual within ±2%.
- `deriveEffectiveGrowMonths` in `src/core/derive.ts` — nominal growMonths + heating-off cold months.
- `CalcInputs.monthlyHeatOpex?: number[]` optional field (non-breaking).
- `simulateMonthly` uses monthly opex when provided, flat when not — no behavioural change for existing callers.
- All existing golden tests continue to pass (optional field means zero regression risk).
- New unit tests for both seasonal functions.
- `pnpm test` and `pnpm build` pass.

## Verification Checklist

### Implementation

- [x] `deriveMonthlyHeatDemand` exported from `src/core/derive.ts` returning number[]
  - Command: `grep "export function deriveMonthlyHeatDemand" src/core/derive.ts`
  - Expected: `stdout contains "deriveMonthlyHeatDemand"`
- [x] `deriveEffectiveGrowMonths` exported from `src/core/derive.ts`
  - Command: `grep "export function deriveEffectiveGrowMonths" src/core/derive.ts`
  - Expected: `stdout contains "deriveEffectiveGrowMonths"`
- [x] `CalcInputs` has optional `monthlyHeatOpex?: number[]` field
  - Command: `grep "monthlyHeatOpex" src/core/types.ts`
  - Expected: `stdout contains "monthlyHeatOpex"`
- [x] Unit tests for seasonal functions present
  - Command: `grep "deriveMonthlyHeatDemand\|deriveEffectiveGrowMonths" test/core.test.ts`
  - Expected: `stdout contains "deriveMonthlyHeatDemand"`

### Integration Tests

- [x] All tests pass including new seasonal tests
  - Command: `pnpm test 2>&1 | tail -5`
  - Expected: `exit 0`
- [x] Build passes
  - Command: `pnpm build 2>&1 | tail -5`
  - Expected: `exit 0`

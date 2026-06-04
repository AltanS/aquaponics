---
status: Not Started
verified: 0/0
updated: 2026-06-04
depends_on:
  - .tracker/M1-M1-climate-data-layer/02-region-entity-and-data-taxonomy-split.md
agent: typescript-expert
template: generic
---

# core/derive.ts heat demand and suitability

## Goal

Add `src/core/derive.ts` with pure `deriveHeatDemand` and `deriveSuitability` functions, calibrated to reproduce the old `baseHeat × heatFactor` values for the Berlin region, and kill `heatFactor` as stored species data.

## Overview

Currently `heatDemand = scale.baseHeat × fish.heatFactor` is computed in `src/ui/inputs.ts` (wrong layer — UI should not do physics). T4 moves this derivation into `src/core/derive.ts` as a pure function that takes species, region, enclosure, and scale data.

**Calibration target** (must match old values within ±5%):
- The old formula: `heatDemand = scale.baseHeat × fish.heatFactor`
- New formula: `deriveHeatDemand(species, region, enclosure, scale)` — use `(species.loopTemp - region.annualMeanAmbient) / referenceΔT × enclosure.heatLossFactor × scale.growArea × referenceWattsPerM2 × hoursPerYear / 1000`. Calibrate `referenceΔT` and `referenceWattsPerM2` so the small-scale catfish result (the golden value `heatDemand = Math.round(55000 × 1.0) = 55000 kWh`) is reproduced within 5%.
- `loopTemp = (species.fcMin + species.fcMax) / 2`
- Berlin annual mean ambient ≈ 9.7°C (use this constant or compute from the monthlyAmbientC array mean).

**`deriveSuitability`**: returns `'native' | 'workable' | 'costly'` based on species loopTemp vs region annual mean ambient:
- `'native'`: loopTemp within ±5°C of annual mean (species naturally comfortable in local climate).
- `'workable'`: loopTemp 5–15°C above annual mean (moderate heating needed).
- `'costly'`: loopTemp > 15°C above annual mean (significant heating cost burden).

**Kill `heatFactor`**: Remove it from `fish.yaml`, from the FishSpecies zod schema, from `src/data/types.ts`, and from generated.ts.

**Update call sites**:
- `src/ui/inputs.ts`: replace `Math.round(s.baseHeat * f.heatFactor)` with `deriveHeatDemand(f, region, enclosure, s)`. For now, hard-code the berlin-brandon region and its enclosure spec as defaults (T7 will connect the region selector).
- `src/core/index.ts`: export `derive.ts` functions.

**Golden tests to add** (in `test/core.test.ts`):
- `deriveHeatDemand('small', 'catfish', berlinRegion)` ≈ 55000 (within 5%)
- `deriveHeatDemand('small', 'trout', berlinRegion)` ≈ 33000 (old: 55000×0.6=33000, within 5%)
- `deriveSuitability('catfish', berlinRegion)` → `'costly'` (loopTemp 26.5, ΔT=16.8 > 15)
- `deriveSuitability('trout', berlinRegion)` → `'workable'` (loopTemp 14, ΔT=4.3 < 5 — actually 'native'; verify and adjust thresholds)
- `deriveSuitability('noblecray', berlinRegion)` → 'workable' (loopTemp 17.5, ΔT=7.8)

Note: compute actual expected suitability values from the formula, not from intuition. Document the computation in the test.

The existing 14 golden tests must continue to pass — the catfish/small/greens_mix heatDemand golden is `55000` and the new derivation must reproduce it within the existing `toBeCloseTo` tolerance used in those tests.

## Requirements

- `src/core/derive.ts` — pure, DOM-free, no runtime imports beyond `src/data/generated.ts` types.
- `deriveHeatDemand(species, region, enclosure, scale): number` — calibrated to reproduce old `baseHeat × heatFactor` within ±5%.
- `deriveSuitability(species, region): 'native' | 'workable' | 'costly'`.
- `heatFactor` removed from FishSpecies type, fish.yaml, zod schema, and generated.ts.
- `src/ui/inputs.ts` updated to call `deriveHeatDemand` (using berlin-brandon defaults).
- `src/core/index.ts` exports derive functions.
- Golden tests added for derivation; all 14 existing tests pass.
- `pnpm test` and `pnpm build` pass.

## Verification Checklist

### Implementation

- [x] `src/core/derive.ts` exists with `deriveHeatDemand` and `deriveSuitability` exports
  - Command: `grep "export function deriveHeatDemand\|export function deriveSuitability" src/core/derive.ts`
  - Expected: `stdout contains "deriveHeatDemand"`
- [x] `heatFactor` removed from fish.yaml and from generated types
  - Command: `grep -c "heatFactor" data/fish.yaml`
  - Expected: `stdout contains "0"`
- [x] `src/ui/inputs.ts` calls `deriveHeatDemand` not `baseHeat * heatFactor`
  - Command: `grep "heatFactor" src/ui/inputs.ts`
  - Expected: `stdout contains ""`
- [x] `src/core/index.ts` exports `deriveHeatDemand` and `deriveSuitability`
  - Command: `grep "derive" src/core/index.ts`
  - Expected: `stdout contains "derive"`
- [x] New golden tests for derive functions present in test/core.test.ts
  - Command: `grep "deriveHeatDemand\|deriveSuitability" test/core.test.ts`
  - Expected: `stdout contains "deriveHeatDemand"`

### Integration Tests

- [x] All tests pass (14 existing + new derive tests)
  - Command: `pnpm test 2>&1 | tail -5`
  - Expected: `exit 0`
- [x] Build passes
  - Command: `pnpm build 2>&1 | tail -5`
  - Expected: `exit 0`

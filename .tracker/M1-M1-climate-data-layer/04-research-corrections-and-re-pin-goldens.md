---
status: Not Started
verified: 0/0
updated: 2026-06-04
depends_on:
  - .tracker/M1-M1-climate-data-layer/03-core-derive-ts-heat-demand-and-suitability.md
agent: typescript-expert
template: generic
---

# Research corrections and re-pin goldens

## Goal

Apply the multi-source-evidenced research corrections to YAML data files, regenerate `src/data/generated.ts`, and re-pin all affected golden tests by computing expected values from formulas.

## Overview

The docs/research/README.md "Model corrections" table identifies species/crop values that are contradicted by multi-source evidence. Apply ONLY the corrections listed below (skip structural suggestions like channel splits and survival rates — out of scope). Add a YAML comment next to each changed value citing its research page.

**Corrections to apply:**
1. `catfish` — `growMonths: 7 → 5` (see `docs/research/fish-catfish.md`)
2. `noblecray` — `growMonths: 30 → 48` (see `docs/research/fish-noblecray.md`)
3. `feldsalat` — `price: 13 → 24` AND `yld: 12 → 8` (see `docs/research/crop-feldsalat.md`)
4. `pikeperch` — `fcr: 1.3 → 1.1` AND `growMonths: 20 → 16` (see `docs/research/fish-pikeperch.md`)
5. `tilapia` — `growMonths: 7 → 9` (see `docs/research/fish-tilapia.md`)
6. `pakchoi` — `yld: 28 → 18` (see `docs/research/crop-pakchoi.md`)
7. `chard` — `yld: 30 → 22` (see `docs/research/crop-chard.md`)

Note: `feldsalat.price` and `pakchoi.yld` / `chard.yld` are in their respective YAML files. But `feldsalat.price` is now in the region price map (from T3). Apply it there.

**Golden test re-pinning procedure:**
- For each affected test, recompute the expected value from the formula using the corrected input values.
- Do NOT copy output from running tests. Show the formula and the substituted numbers in a comment.
- The main affected scenario is `small / catfish / greens_mix` (catfish `growMonths` changes from 7 → 5).
- Re-check all scenario tests: `rev`, `inputs`, `labor`, `opex`, `ebitda`, `construction`, `capex`, `net`, `breakEven`, `simulateMonthly` first-non-negative month.
- Re-pin the `simulateMonthly` golden for catfish's new `growMonths: 5` (first revenue month shifts).

Note: energy goldens (demand, gen, imp, opex, eff) do NOT change — energy doesn't depend on growMonths.

## Requirements

- All 7 corrections applied in YAML; each has a YAML comment citing its `docs/research/` page.
- `pnpm run build:data` runs cleanly after corrections.
- Affected golden tests in `test/core.test.ts` updated with recomputed values (comments showing formula).
- `pnpm test` passes with the new expected values.
- `pnpm build` passes.

## Verification Checklist

### Implementation

- [x] catfish growMonths corrected to 5 in fish.yaml with research comment
  - Command: `grep -A1 "catfish:" data/fish.yaml | grep "growMonths: 5"`
  - Expected: `stdout contains "5"`
- [x] noblecray growMonths corrected to 48 in fish.yaml with research comment
  - Command: `grep -A5 "noblecray:" data/fish.yaml | grep "growMonths: 48"`
  - Expected: `stdout contains "48"`
- [x] pikeperch fcr corrected to 1.1 in fish.yaml
  - Command: `grep -A5 "pikeperch:" data/fish.yaml | grep "fcr: 1.1"`
  - Expected: `stdout contains "1.1"`
- [x] pakchoi yld corrected to 18 in crops.yaml
  - Command: `grep -A3 "pakchoi:" data/crops.yaml | grep "yld: 18"`
  - Expected: `stdout contains "18"`
- [x] chard yld corrected to 22 in crops.yaml
  - Command: `grep -A3 "chard:" data/crops.yaml | grep "yld: 22"`
  - Expected: `stdout contains "22"`
- [x] generated.ts regenerated after corrections
  - Command: `node --experimental-strip-types --no-warnings scripts/build-data.ts 2>&1`
  - Expected: `exit 0`

### Integration Tests

- [x] All golden tests pass (re-pinned values)
  - Command: `pnpm test 2>&1 | tail -5`
  - Expected: `exit 0`
- [x] Build passes
  - Command: `pnpm build 2>&1 | tail -5`
  - Expected: `exit 0`

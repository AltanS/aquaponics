---
status: Not Started
verified: 0/0
updated: 2026-06-04
depends_on:
  - .tracker/M1-M1-climate-data-layer/06-ui-additions-region-selector-vintage-banner-suitability-badges.md
agent: typescript-expert
template: generic
---

# Docs: README and HANDOFF addendum

## Goal

Update README.md and HANDOFF.md to document the climate-aware data layer architecture so future contributors can understand and extend the system.

## Overview

T8 is documentation only — no code changes. Both files must be accurate to the final implemented architecture.

**README.md additions** — add a "Data pipeline" section describing:
- The YAML file layout (`/data/fish.yaml`, `/data/crops.yaml`, `/data/scales.yaml`, `/data/regions/<id>.yaml`).
- How to run `pnpm run build:data` and what it does (parse → validate → emit `src/data/generated.ts`).
- Why `generated.ts` is checked in (zero runtime deps; fast imports; CI re-validates YAML via schema test).
- How to add a new region: create `/data/regions/<id>.yaml` with all required blocks, add the id to the region enum in the zod schema, run `build:data`.
- How to edit existing data: edit the YAML, run `build:data`, commit both files.

**HANDOFF.md §3 addendum** — add after the existing §2 (keep §2 intact):
- §3.1 Climate-aware architecture overview: region model, one region = climate + economics + enclosure spec.
- §3.2 Data taxonomy: universal biology files vs regional economics vs derived values (never stored).
- §3.3 `derive.ts` function inventory: `deriveHeatDemand`, `deriveSuitability`, `deriveMonthlyHeatDemand`, `deriveEffectiveGrowMonths` — one-line description of each + calibration note.
- §3.4 Seasonal model: what `monthlyHeatOpex` does in the simulate pipeline; what `deriveEffectiveGrowMonths` models.
- §3.5 Suitability badges: what native/workable/costly means; soft-warning philosophy (no hard blocks).
- §3.6 Extending the model: adding a region, adding a species, changing a correction.

## Requirements

- README.md has a "Data pipeline" section with all subsections listed above.
- HANDOFF.md §3 appended (§1 and §2 untouched).
- No code file changes.
- Accurate to the final implementation (T2–T7).

## Verification Checklist

### Implementation

- [x] README.md contains "Data pipeline" section
  - Command: `grep "Data pipeline" README.md`
  - Expected: `stdout contains "Data pipeline"`
- [x] README.md documents `pnpm run build:data`
  - Command: `grep "build:data" README.md`
  - Expected: `stdout contains "build:data"`
- [x] README.md explains how to add a new region
  - Command: `grep -i "new region\|add.*region" README.md`
  - Expected: `stdout contains "region"`
- [x] HANDOFF.md §3 section exists
  - Command: `grep "## 3\." HANDOFF.md`
  - Expected: `stdout contains "3."`
- [x] HANDOFF.md §2 still intact (key decisions not modified)
  - Command: `grep "Key decisions made" HANDOFF.md`
  - Expected: `stdout contains "Key decisions made"`

### Integration Tests

- [x] Build still passes (docs-only change should not affect it)
  - Command: `pnpm build 2>&1 | tail -5`
  - Expected: `exit 0`
- [x] Tests still pass
  - Command: `pnpm test 2>&1 | tail -5`
  - Expected: `exit 0`

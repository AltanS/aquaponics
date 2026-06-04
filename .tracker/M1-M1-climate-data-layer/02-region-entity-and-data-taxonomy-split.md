---
status: Not Started
verified: 0/0
updated: 2026-06-04
depends_on:
  - .tracker/M1-M1-climate-data-layer/01-yaml-files-zod-schemas-build-data-codegen.md
agent: typescript-expert
template: generic
---

# Region entity and data taxonomy split

## Goal

Complete the data taxonomy split: wire `src/data/index.ts` to re-export from `generated.ts`, delete the old TS const modules, populate the berlin-brandenburg region file with the full climate and enclosure blocks, and drop duplicated display strings from all YAML files.

## Overview

After T2, `generated.ts` exists but `src/data/index.ts` still re-exports from the old TS const modules. T3 completes the handover:

1. Update `src/data/index.ts` to re-export from `./generated` — all downstream imports (`src/core/`, `src/ui/`, `test/`) continue working unchanged.
2. Delete `src/data/fish.ts`, `crops.ts`, `scales.ts`, `economics.ts` (the old const modules).
3. Populate the berlin-brandenburg region YAML with the full climate block: `climateZone: cold-continental`, monthly ambient temperature profile (Jan–Dec, °C), supplemental-light bool array by month, and enclosure spec (`type: insulated-greenhouse`, `heatLossFactor: 0.35`).
4. Move ALL prices into the region file: fish price map (keyed by fish id), crop price map (keyed by crop id). Remove `price` fields from `fish.yaml` and `crops.yaml` — prices are regional, not biological. The region zod schema must validate that the price maps contain keys for all fish/crop ids.
5. Drop duplicated display strings (`temp`, `growout`, `cycle`, `system` strings) from `fish.yaml` and `crops.yaml` — these are derived in the UI format layer (T7). Remove them from the FishSpecies/Crop zod schemas and generated types.
6. Update `src/data/types.ts` to remove `temp: string`, `growout: string` from `FishSpecies` and `temp: string`, `cycle: string`, `system: string` from `Crop`.
7. Update any UI code that currently reads `.temp`/`.growout`/`.cycle`/`.system` from species/crop objects to call a format function instead (stub `formatTempRange(min, max)`, `formatGrowOut(months)`, `formatCycleDays(days)` in `src/ui/format.ts` if not already present — full derivation in T7).

Regional data taxonomy:
- Universal biology (fish.yaml, crops.yaml): biology-only — fcr, growMonths, temp bands, cycleDays, type/cat, difficulty, notes. No prices.
- Regional (regions/berlin-brandenburg.yaml): ALL prices, wage, gridPrice, feedIn, gasPrice, pvYield, rentPerM2Month, landLease, constructionPerM2 by enclosure, climate block, enclosure spec.
- Derived (never stored): heatDemand, suitability — computed in T4.

## Requirements

- `src/data/index.ts` re-exports everything from `./generated`; old TS const modules deleted.
- Berlin-brandon YAML climate block: `climateZone`, `monthlyAmbientC` (12-element array), `supplementalLight` (12-element bool array), enclosure `type` and `heatLossFactor`.
- Fish and crop prices moved to region file price maps; removed from biology YAML.
- Display strings (`temp`, `growout`, `cycle`, `system`) removed from YAML and from TypeScript type interfaces.
- Format stubs in `src/ui/format.ts` so UI does not break before T7 fully implements derived strings.
- All 14 golden tests continue to pass (test uses `heatDemand: Math.round(s.baseHeat * f.heatFactor)` — heatFactor still present, test must not regress).
- `pnpm build` passes.

## Verification Checklist

### Implementation

- [x] `src/data/index.ts` re-exports from `./generated`; fish.ts/crops.ts/scales.ts/economics.ts deleted
  - Command: `ls src/data/fish.ts 2>&1`
  - Expected: `stdout contains "No such file"`
- [x] Berlin-brandon YAML has `monthlyAmbientC` array (12 elements) and `heatLossFactor`
  - Command: `grep -c "monthlyAmbientC" data/regions/berlin-brandon.yaml`
  - Expected: `stdout contains "1"`
- [x] Fish prices moved to region file; `fish.yaml` has no top-level `price:` fields
  - Command: `grep -c "^  price:" data/fish.yaml`
  - Expected: `stdout contains "0"`
- [x] Display strings removed from fish.yaml/crops.yaml
  - Command: `grep -c "growout:" data/fish.yaml`
  - Expected: `stdout contains "0"`
- [x] Format stubs present in `src/ui/format.ts`
  - Command: `grep "formatTempRange\|formatGrowOut\|formatCycleDays" src/ui/format.ts`
  - Expected: `stdout contains "formatTempRange"`

### Integration Tests

- [x] All 14 golden tests pass
  - Command: `pnpm test 2>&1 | tail -5`
  - Expected: `stdout contains "14"`
- [x] Build passes
  - Command: `cd . && pnpm build 2>&1 | tail -5`
  - Expected: `exit 0`

---
status: Not Started
verified: 0/0
updated: 2026-06-04
depends_on: []
agent: typescript-expert
template: generic
---

# YAML files, zod schemas, build-data codegen

## Goal

Author all reference YAML files and a build-time codegen script that validates them with zod and emits `src/data/generated.ts` — the single typed artifact that Vite and vitest will import at zero runtime cost.

## Overview

Currently all reference data lives in TypeScript const modules (`src/data/fish.ts`, `crops.ts`, `scales.ts`, `economics.ts`). The goal is to move it into human-editable YAML files under `/data/` at repo root, validated at build time by zod, and emitted as a generated TS file.

Key constraints:
- Zero runtime dependencies: `zod` and `yaml` are devDeps only, never in the bundle.
- The literal ID union types (`FishId`, `CropId`, `ScaleId`) must be generated from the YAML keys so downstream type safety is preserved.
- YAML comments next to values carry units/caveats (replacing JSDoc for editors).
- Validation errors must name file, entity, field, and expected unit: `fish/tilapia → price must be a number in €/kg (got "9 EUR")`.
- Keep `heatFactor` in fish.yaml for now (T4 removes it).
- Keep duplicated display strings (`temp`, `growout`, `cycle`) in fish/crops YAML for now (T3 removes them after taxonomy split).
- A vitest schema test (`test/schema.test.ts`) re-validates all YAML so a bad edit fails CI.

Signal-cascade note: `generated.ts` replaces the existing const modules but keeps identical exports (`FISH`, `CROPS`, `SCALES`, `ENERGY`, `PROPERTY`, `FINANCE`) and the same ID union types — no call-site changes needed in this task (T3 handles that).

## Requirements

- `/data/fish.yaml`, `/data/crops.yaml`, `/data/scales.yaml` — universal biology / scale data.
- `/data/regions/berlin-brandenburg.yaml` — regional file with economics block (prices, wage, energy constants, property constants, finance constants) and placeholder climate/enclosure blocks (populated fully in T3).
- `meta:` header on every file: `schemaVersion`, `region` (`universal` or region id), `lastUpdated: 2026-06-04`, `notes`.
- `entities:` keyed map under `meta:` in each file.
- `scripts/build-data.ts` using `tsx` + `yaml` + `zod` devDeps: parse → validate → emit `src/data/generated.ts`.
- Generated file contains `FISH`, `CROPS`, `SCALES`, `ENERGY`, `PROPERTY`, `FINANCE` constants plus `FishId`, `CropId`, `ScaleId` literal union type exports.
- `pnpm run build:data` script added to `package.json`; also wired as `prebuild` and `pretest`.
- `test/schema.test.ts` — vitest test that runs `build-data` (or re-validates YAML inline) so a bad edit fails CI.
- All 14 existing golden tests continue to pass after this task (generated data values must match current TS values exactly).

## Verification Checklist

### Implementation

- [x] `/data/fish.yaml` authored with all 11 species; YAML comments carry units; `meta:` header present; values match `src/data/fish.ts` exactly
  - Command: `node --experimental-strip-types --no-warnings scripts/build-data.ts 2>&1 | head -5`
  - Expected: `exit 0`
- [x] `/data/crops.yaml` authored with all 11 crops; values match `src/data/crops.ts` exactly
  - Command: `node --experimental-strip-types --no-warnings scripts/build-data.ts 2>&1 | head -5`
  - Expected: `exit 0`
- [x] `/data/scales.yaml` authored with all 4 scales; values match `src/data/scales.ts` exactly
  - Command: `node --experimental-strip-types --no-warnings scripts/build-data.ts 2>&1 | head -5`
  - Expected: `exit 0`
- [x] `/data/regions/berlin-brandenburg.yaml` authored with full economics block (all ENERGY, PROPERTY, FINANCE constants from `src/data/economics.ts`), placeholder climate block, placeholder enclosure block
  - Command: `grep -c "climateZone" data/regions/berlin-brandenburg.yaml`
  - Expected: `stdout contains "1"`
- [x] `scripts/build-data.ts` implemented: parses all YAML, validates with zod, emits `src/data/generated.ts` with correct exports
  - Command: `node --experimental-strip-types --no-warnings scripts/build-data.ts && grep -c "export const FISH" src/data/generated.ts`
  - Expected: `stdout contains "1"`
- [x] Generated `src/data/generated.ts` exports `FishId`, `CropId`, `ScaleId` as literal union types derived from YAML keys
  - Command: `grep "export type FishId" src/data/generated.ts`
  - Expected: `stdout contains "FishId"`
- [x] `zod` and `yaml` added to devDependencies; `tsx` added if not present; zero new runtime deps
  - Command: `node -e "const p=require('./package.json'); const rd=Object.keys(p.dependencies||{}); console.log(rd.length===0?'ok':'FAIL: '+rd.join(','))"`
  - Expected: `stdout contains "ok"`
- [x] `pnpm run build:data` script present in package.json; `prebuild` and `pretest` wired
  - Command: `node -e "const p=require('package.json'); console.log(p.scripts['build:data']?'ok':'missing')"`
  - Expected: `stdout contains "ok"`
- [x] `test/schema.test.ts` authored and validates YAML structure
  - Command: `ls test/schema.test.ts`
  - Expected: `exit 0`

### Integration Tests

- [x] All 14 existing golden tests pass with generated data
  - Command: `pnpm test 2>&1 | tail -5`
  - Expected: `stdout contains "14"`
- [x] Build passes
  - Command: `cd . && pnpm build 2>&1 | tail -5`
  - Expected: `exit 0`

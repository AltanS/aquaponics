---
status: Not Started
verified: 0/0
updated: 2026-06-04
depends_on:
  - .tracker/M1-M1-climate-data-layer/05-seasonal-heating-and-winter-gated-grow-out.md
agent: typescript-expert
template: generic
---

# UI additions: region selector, vintage banner, suitability badges, derived display strings

## Goal

Add the four UI improvements that make the region model and suitability derivations visible to the user: region selector, data-vintage banner, suitability badges on fish tabs, and derived display strings replacing hardcoded ones.

## Overview

T7 completes the user-facing surface of the climate-aware data layer:

1. **Region selector** (`src/ui/state.ts` + `src/ui/inputs.ts`): A dropdown near the top of the UI with a single option "Berlin / Brandenburg". Selecting it sets the active region in app state. On load, defaults to `berlin-brandon`. When the region changes, re-derive heatDemand and reload economics into `CalcInputs`.

2. **Data-vintage banner** (`src/ui/render.ts` or `src/ui/panels.ts`): A persistent banner near the results section reading: "Berlin/Brandenburg figures, compiled 2026-06 — prices drift". Style it as a muted info banner (CSS class `vintage-banner`). It should always be visible when results are shown.

3. **Suitability badges** (`src/ui/tabs.ts` or wherever fish tabs are rendered): Each fish tab shows a small badge (`native` / `workable` / `costly`) derived by calling `deriveSuitability(fish, activeRegion)`. Badge color: native = green, workable = amber, costly = red (CSS classes `badge-native`, `badge-workable`, `badge-costly`). These are soft warnings — the tab is always selectable regardless of badge (consistent with pairing philosophy: no hard blocks).

4. **Derived display strings** (`src/ui/format.ts`): Implement the format functions stubbed in T3:
   - `formatTempRange(min: number, max: number): string` → `"${min}–${max}°C"`
   - `formatGrowOut(months: number): string` → e.g. `"5 mo"` or `"24 mo (2 yr)"` for ≥ 24
   - `formatCycleDays(days: number): string` → e.g. `"38 d"`
   Replace any remaining hardcoded display strings in tabs/panels with calls to these format functions.

CSS: add required styles (badge colors, vintage-banner) to `src/style.css`.

## Requirements

- Region selector rendered in UI; defaults to berlin-brandon; changing it triggers recalculation.
- Data-vintage banner visible near results with exact text "Berlin/Brandenburg figures, compiled 2026-06 — prices drift".
- Suitability badges on fish tabs, non-blocking, color-coded.
- `formatTempRange`, `formatGrowOut`, `formatCycleDays` implemented in `src/ui/format.ts`.
- All hardcoded `.temp`, `.growout`, `.cycle` display strings replaced with format calls.
- `pnpm build` passes; no TypeScript errors.

## Verification Checklist

### Implementation

- [x] Region selector element present in rendered HTML (id or data-attribute)
  - Command: `grep -r "region.*selector\|select.*region\|regionSelect\|region-select" src/ --include="*.ts" -l`
  - Expected: `stdout contains "src"`
- [x] Vintage banner text present in source
  - Command: `grep -r "compiled 2026-06" src/`
  - Expected: `stdout contains "compiled 2026-06"`
- [x] Suitability badge CSS classes defined in style.css
  - Command: `grep "badge-native\|badge-workable\|badge-costly" src/style.css`
  - Expected: `stdout contains "badge-native"`
- [x] `formatTempRange`, `formatGrowOut`, `formatCycleDays` implemented in format.ts
  - Command: `grep "export function formatTempRange\|export function formatGrowOut\|export function formatCycleDays" src/ui/format.ts`
  - Expected: `stdout contains "formatTempRange"`
- [x] No remaining `.temp` / `.growout` / `.cycle` property accesses in UI source
  - Command: `grep -r "\.growout\b\|\.cycle\b" src/ui/ --include="*.ts"`
  - Expected: `stdout contains ""`

### Integration Tests

- [x] Build passes (no TS errors, vite build succeeds)
  - Command: `pnpm build 2>&1 | tail -5`
  - Expected: `exit 0`
- [x] All tests pass
  - Command: `pnpm test 2>&1 | tail -5`
  - Expected: `exit 0`

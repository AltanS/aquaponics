/**
 * Berlin/Brandenburg region/enclosure extract — the minimal shapes the pure
 * `derive.*` heat functions consume (DeriveRegion / DeriveEnclosure).
 *
 * These are NOT authored here: they project the single source of truth,
 * `REGION` in generated.ts (built from data/regions/berlin-brandenburg.yaml).
 * Kept as a tiny named adapter so callers read intent ("the Berlin region")
 * and so the derive layer never imports the full generated data shape.
 */

import { REGION } from './generated';

export const BERLIN_REGION = {
  annualMeanAmbientC: REGION.annualMeanAmbientC,
  monthlyAmbientC: REGION.monthlyAmbientC,
} as const;

export const BERLIN_ENCLOSURE = {
  heatLossFactor: REGION.enclosure.heatLossFactor,
} as const;

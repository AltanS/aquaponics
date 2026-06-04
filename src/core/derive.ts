/**
 * src/core/derive.ts — Pure physics-based derivations for heat demand and suitability.
 *
 * Design notes:
 * - All functions are pure, DOM-free, deterministic.
 * - No runtime imports beyond local type shapes.
 * - Calibration: referenceΔT=20°C and referenceWattsPerM2=54.61 W/m² are chosen
 *   so that deriveHeatDemand('catfish', berlinRegion, berlinEnclosure, smallScale)
 *   returns exactly 55000 kWh (= old baseHeat × heatFactor for small/catfish).
 *   Other species diverge from their old heatFactor values — that is correct;
 *   physics replaces the coarse heatFactor multiplier.
 */

/** Minimal shape of a FishSpecies needed for derivation (no heatFactor). */
export interface DeriveSpecies {
  fcMin: number;
  fcMax: number;
}

/** Minimal region shape needed for derivation. */
export interface DeriveRegion {
  annualMeanAmbientC: number;
  monthlyAmbientC: number[];
}

/** Minimal enclosure shape. */
export interface DeriveEnclosure {
  heatLossFactor: number;
}

/** Minimal scale shape. */
export interface DeriveScale {
  growArea: number;
}

// ── Constants (calibrated) ──────────────────────────────────────────────────

/**
 * Reference temperature differential for heat demand calibration.
 * Chosen so catfish/small → exactly 55000 kWh with Berlin region data.
 */
const REFERENCE_DT = 20; // °C

/**
 * Reference heat-loss per m² per °C-differential per year.
 * Derived: 55000 kWh / (16.425/20 × 0.35 × 400m² × 8760h/1000) = 54.608 W/m²
 *
 * Calibration check (catfish/small):
 *   loopTemp = (25+28)/2 = 26.5°C
 *   berlinMean ≈ 10.075°C  (mean of monthlyAmbientC Jan–Dec)
 *   ΔT = 26.5 - 10.075 = 16.425°C
 *   demand = 16.425/20 × 0.35 × 400 × 54.608 × 8760/1000 = 55000 kWh ✓
 */
const REFERENCE_WATTS_PER_M2 = 54.608; // W/m²
const HOURS_PER_YEAR = 8760;

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Fish comfort-band midpoint — the target loop temperature °C. */
export function loopTempFromBand(species: DeriveSpecies): number {
  return (species.fcMin + species.fcMax) / 2;
}

/** Berlin annual mean from the 12-element monthly array. */
export function annualMean(monthlyC: number[]): number {
  return monthlyC.reduce((a, b) => a + b, 0) / monthlyC.length;
}

// ── Public functions ─────────────────────────────────────────────────────────

/**
 * Annual heat demand in kWh/yr.
 *
 * Formula:
 *   (loopTemp − annualMeanAmbient) / REFERENCE_DT
 *   × enclosure.heatLossFactor
 *   × scale.growArea
 *   × REFERENCE_WATTS_PER_M2
 *   × HOURS_PER_YEAR / 1000
 *
 * Returns 0 when loopTemp ≤ annualMeanAmbient (no heating needed).
 */
export function deriveHeatDemand(
  species: DeriveSpecies,
  region: DeriveRegion,
  enclosure: DeriveEnclosure,
  scale: DeriveScale,
): number {
  const lt = loopTempFromBand(species);
  const ambient = region.annualMeanAmbientC;
  const deltaT = Math.max(0, lt - ambient);
  return (deltaT / REFERENCE_DT) * enclosure.heatLossFactor * scale.growArea * REFERENCE_WATTS_PER_M2 * HOURS_PER_YEAR / 1000;
}

/**
 * Suitability of a species in a region, based on loop temperature vs annual mean ambient.
 *
 * Thresholds (vs annual mean ambient):
 *   'native'   — loopTemp within +5°C of annual mean (species naturally comfortable)
 *   'workable' — loopTemp 5–15°C above annual mean (moderate heating needed)
 *   'costly'   — loopTemp > 15°C above annual mean (significant heating burden)
 *
 * Note: below-ambient species (cold-water fish in warm climates) are rare in this
 * context; the function returns 'native' for them (cooling is a separate concern).
 */
export function deriveSuitability(
  species: DeriveSpecies,
  region: DeriveRegion,
): 'native' | 'workable' | 'costly' {
  const lt = loopTempFromBand(species);
  const deltaT = lt - region.annualMeanAmbientC;
  if (deltaT > 15) return 'costly';
  if (deltaT > 5) return 'workable';
  return 'native';
}

/**
 * Monthly heat demand array (12 elements, kWh/month).
 *
 * For each month m:
 *   monthlyHeat[m] = max(0, loopTemp − monthlyAmbientC[m]) / REFERENCE_DT
 *                    × enclosure.heatLossFactor × scale.growArea
 *                    × REFERENCE_WATTS_PER_M2 × hoursInMonth / 1000
 *
 * Sum of monthlyHeat matches deriveHeatDemand (annual) within ±2%
 * (calendar months have 28–31 days; total ≠ exactly 8760h).
 */
export function deriveMonthlyHeatDemand(
  species: DeriveSpecies,
  region: DeriveRegion,
  enclosure: DeriveEnclosure,
  scale: DeriveScale,
): number[] {
  const lt = loopTempFromBand(species);
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return region.monthlyAmbientC.map((ambient, m) => {
    const deltaT = Math.max(0, lt - ambient);
    const hours = daysPerMonth[m]! * 24;
    return (deltaT / REFERENCE_DT) * enclosure.heatLossFactor * scale.growArea * REFERENCE_WATTS_PER_M2 * hours / 1000;
  });
}

/**
 * Effective grow-out months accounting for winter temperature gating.
 *
 * If heating were hypothetically off, months where monthlyAmbientC[m] < species.fcMin
 * would yield zero growth. This function returns:
 *   effectiveGrowMonths = species.growMonths + coldMonths
 *
 * where coldMonths = count of months with ambient < fcMin.
 *
 * This is a planning/sensitivity metric — in normal operation heating IS on.
 */
export function deriveEffectiveGrowMonths(
  species: DeriveSpecies & { growMonths: number },
  region: DeriveRegion,
): number {
  const coldMonths = region.monthlyAmbientC.filter((t) => t < species.fcMin).length;
  return species.growMonths + coldMonths;
}

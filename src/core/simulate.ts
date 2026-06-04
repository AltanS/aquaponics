/** The slice of a scenario the ramp simulation needs. */
export interface RampScenario {
  fishRev: number;
  plantRev: number;
  opex: number;
  capex: number;
}

/** Revenue lags: fish earn nothing until the first cohort reaches market size,
 * crops until the first cycle completes. Costs run from month 1. */
export interface RampLags {
  growMonths: number;
  cycleDays: number;
  /**
   * Optional monthly heat opex (12-element array, €/month).
   * When provided, simulateMonthly uses per-month heat cost instead of the
   * flat annual heatDemand encoded in the scenario's opex.
   * When absent, behaviour is unchanged — opex is distributed flat over 12 months.
   * Non-breaking: existing callers omitting this field work as before.
   */
  monthlyHeatOpex?: number[];
}

export interface SeriesPoint {
  /** years */
  x: number;
  /** cumulative cash € */
  y: number;
}

export interface RampSeries {
  pts: SeriesPoint[];
  /** years until cumulative cash crosses 0 (interpolated), or null if never within horizon */
  breakEven: number | null;
}

/**
 * Month-by-month cash-flow ramp (HANDOFF.md §4). Continuous stocking is
 * assumed (smooth ramp, not lumpy batches); year 0 is the CAPEX outflow.
 * This produces the realistic cash valley that pushes break-even well past
 * the naive CAPEX / annual-profit figure.
 *
 * When `lags.monthlyHeatOpex` is provided, the scenario's annual heat component
 * is replaced by the per-month array. The non-heat portion of opex is still
 * distributed flat; only heat becomes seasonal.
 */
export function simulateMonthly(s: RampScenario, lags: RampLags, horizonYears: number): RampSeries {
  const months = horizonYears * 12;
  const fishM = s.fishRev / 12;
  const plantM = s.plantRev / 12;
  const lagFish = lags.growMonths;
  const lagCrop = lags.cycleDays / 30;

  // If monthlyHeatOpex provided, compute the annual heat portion from the 12-element array
  // and use per-month costs; otherwise distribute opex flat.
  const monthlyHeat = lags.monthlyHeatOpex;
  const annualHeatFromMonthly = monthlyHeat ? monthlyHeat.reduce((a, b) => a + b, 0) : 0;

  // Flat opex per month (non-heat portion when monthlyHeatOpex is active)
  const opexFlat = monthlyHeat
    ? (s.opex - annualHeatFromMonthly) / 12  // deduct annual heat; distribute rest flat
    : s.opex / 12;

  let cum = -s.capex;
  const pts: SeriesPoint[] = [{ x: 0, y: cum }];
  let breakEven: number | null = null;
  let prev = cum;

  for (let m = 1; m <= months; m++) {
    // Month-of-year index (0-based, cycling): 0=Jan, 11=Dec
    const moy = (m - 1) % 12;
    const heatCost = monthlyHeat ? (monthlyHeat[moy] ?? 0) : 0;
    const cash = (m > lagFish ? fishM : 0) + (m > lagCrop ? plantM : 0) - opexFlat - heatCost;
    cum += cash;
    pts.push({ x: m / 12, y: cum });
    if (breakEven === null && prev < 0 && cum >= 0) {
      breakEven = (m - 1 + (0 - prev) / (cum - prev)) / 12;
    }
    prev = cum;
  }
  return { pts, breakEven };
}

export interface YearRow {
  year: number;
  fish: number;
  plant: number;
  cost: number;
  cash: number;
  cum: number;
}

/** Aggregates the same monthly stream into calendar years; year 0 row = −CAPEX. */
export function yearRows(s: RampScenario, lags: RampLags, horizonYears: number): YearRow[] {
  const fishM = s.fishRev / 12;
  const plantM = s.plantRev / 12;
  const lagFish = lags.growMonths;
  const lagCrop = lags.cycleDays / 30;

  const monthlyHeat = lags.monthlyHeatOpex;
  const annualHeatFromMonthly = monthlyHeat ? monthlyHeat.reduce((a, b) => a + b, 0) : 0;
  const opexFlat = monthlyHeat
    ? (s.opex - annualHeatFromMonthly) / 12
    : s.opex / 12;

  let cum = -s.capex;
  const rows: YearRow[] = [{ year: 0, fish: 0, plant: 0, cost: 0, cash: -s.capex, cum }];

  for (let y = 1; y <= horizonYears; y++) {
    let fish = 0;
    let plant = 0;
    let cost = 0;
    for (let mm = 1; mm <= 12; mm++) {
      const m = (y - 1) * 12 + mm;
      const moy = (m - 1) % 12;
      const heatCost = monthlyHeat ? (monthlyHeat[moy] ?? 0) : 0;
      fish += m > lagFish ? fishM : 0;
      plant += m > lagCrop ? plantM : 0;
      cost += opexFlat + heatCost;
    }
    const cash = fish + plant - cost;
    cum += cash;
    rows.push({ year: y, fish, plant, cost, cash, cum });
  }
  return rows;
}

import { describe, expect, it } from 'vitest';
import { CROPS, ENERGY, FINANCE, FISH, PROPERTY, SCALES } from '../src/data';
import {
  computeEnergy,
  computeScenario,
  loopTemp,
  pairFishPlant,
  indexScore,
  simulateMonthly,
  yearRows,
  type CalcInputs,
  type Toggles,
} from '../src/core';
import {
  deriveHeatDemand,
  deriveSuitability,
  deriveMonthlyHeatDemand,
  deriveEffectiveGrowMonths,
} from '../src/core/derive';

// ── Shared Berlin region constants ────────────────────────────────────────────

/** Berlin/Brandenburg region for all derive tests and makeInputs. */
const BERLIN_REGION = {
  annualMeanAmbientC: 10.075, // mean of monthlyAmbientC
  monthlyAmbientC: [0.3, 1.2, 5.2, 9.7, 15.1, 18.2, 20.1, 19.8, 15.3, 9.8, 4.7, 1.5],
};
const BERLIN_ENCLOSURE = { heatLossFactor: 0.35 };

// ── makeInputs helper ─────────────────────────────────────────────────────────

/**
 * Build CalcInputs exactly the way the UI seeds them from the presets.
 * heatDemand now uses deriveHeatDemand (spec-03: heatFactor removed from data).
 * Calibrated so catfish/small → 55000 kWh (= old baseHeat × 1.0, within 0.01%).
 */
function makeInputs(scale: keyof typeof SCALES, fish: keyof typeof FISH, crop: keyof typeof CROPS): CalcInputs {
  const s = SCALES[scale];
  const f = FISH[fish];
  const c = CROPS[crop];
  return {
    fishKg: s.fishKg, fishPrice: f.price, fcr: f.fcr, feedPrice: ENERGY.feedPrice,
    stockCost: f.stockCost, growMonths: f.growMonths,
    growArea: s.growArea, yieldM2: c.yld, plantPrice: c.price, seedCost: c.seedCost, cycleDays: c.cycleDays,
    sysKwh: s.sysKwh,
    heatDemand: Math.round(deriveHeatDemand(f, BERLIN_REGION, BERLIN_ENCLOSURE, s)),
    cop: ENERGY.cop, pvKwp: s.pvKwp, pvYield: ENERGY.pvYield, scRate: ENERGY.scRate,
    gridPrice: ENERGY.gridPrice, feedIn: ENERGY.feedIn, gasPrice: ENERGY.gasPrice, omSolar: ENERGY.omSolar,
    pvCostPerKwp: ENERGY.pvCostPerKwp, hpCostPerKw: ENERGY.hpCostPerKw, hpFullLoadHours: ENERGY.hpFullLoadHours,
    constructionPerM2: s.constructionPerM2, rentPerM2Month: PROPERTY.rentPerM2Month,
    landLeaseYear: s.landLeaseYear, equipmentCapex: s.equipmentCapex,
    laborHrs: s.laborHrs, wage: FINANCE.wage, waterNut: s.waterNut, distrib: s.distrib, maint: s.maint,
    deprYears: FINANCE.deprYears, horizon: FINANCE.horizonYears,
  };
}

const BOTH_ON: Toggles = { solar: true, heatpump: true };
const BOTH_OFF: Toggles = { solar: false, heatpump: false };

// ── Original 14 golden tests ─────────────────────────────────────────────────

describe('golden: default scenario (small / catfish / greens_mix, solar+HP on)', () => {
  const i = makeInputs('small', 'catfish', 'greens_mix');

  it('matches the prototype energy figures', () => {
    const E = computeEnergy(i, BOTH_ON);
    expect(E.demand).toBeCloseTo(58333.333, 2); // 40000 + 55000/3
    expect(E.gen).toBe(47500); // 50 kWp × 950
    expect(E.imp).toBeCloseTo(32208.333, 2);
    expect(E.opex).toBeCloseTo(6947.708, 2);
    expect(E.eff).toBeCloseTo(0.11910, 4);
  });

  it('matches the prototype lease scenario', () => {
    const L = computeScenario('lease', i, BOTH_ON);
    expect(L.rev).toBe(77400); // 3000×9 + 400×28×4.5
    expect(L.inputs).toBeCloseTo(11280, 6); // feed 5280 + stock 2400 + seed 3600
    expect(L.labor).toBe(26520); // 30×52×17
    expect(L.opex).toBeCloseTo(57247.708, 2);
    expect(L.ebitda).toBeCloseTo(20152.292, 2);
    expect(L.construction).toBe(140000); // 350 €/m² × 400 m²
    expect(L.capex).toBe(340250); // 110000 + 140000 + 60000 PV + 30250 HP
    expect(L.net).toBeCloseTo(-8201.875, 2);
  });

  it('matches the prototype rent scenario', () => {
    const R = computeScenario('rent', i, BOTH_ON);
    expect(R.construction).toBe(0);
    expect(R.capex).toBe(200250);
    expect(R.rent).toBe(21600); // 4.5 × 400 × 12
    expect(R.ebitda).toBeCloseTo(1552.292, 2);
  });
});

describe('golden: toggles off remove CAPEX and shift the energy bill', () => {
  const i = makeInputs('small', 'catfish', 'greens_mix');

  it('drops PV+HP CAPEX and switches heat to gas', () => {
    const on = computeScenario('lease', i, BOTH_ON);
    const off = computeScenario('lease', i, BOTH_OFF);
    expect(off.energyCapex).toBe(0);
    expect(off.capex).toBe(250000); // 110000 + 140000
    expect(off.energy).toBeCloseTo(16050, 6); // 40000×0.25 grid + 55000×0.11 gas
    expect(off.energy).toBeGreaterThan(on.energy);
    expect(off.capex).toBeLessThan(on.capex);
  });
});

describe('ramp simulation & break-even', () => {
  it('interpolates the zero-crossing month', () => {
    // capex 1000, income 100/mo from month 1 → crosses 0 exactly at month 10
    const r = simulateMonthly(
      { fishRev: 1200, plantRev: 0, opex: 0, capex: 1000 },
      { growMonths: 0, cycleDays: 0 },
      5,
    );
    expect(r.breakEven).toBeCloseTo(10 / 12, 10);
    expect(r.pts).toHaveLength(61); // month 0 + 60 months
    expect(r.pts[0]).toEqual({ x: 0, y: -1000 });
  });

  it('delays fish income past the grow-out lag', () => {
    const r = simulateMonthly(
      { fishRev: 1200, plantRev: 0, opex: 0, capex: 0 },
      { growMonths: 7, cycleDays: 0 },
      1,
    );
    // months 1–7 earn nothing, months 8–12 earn 100 each
    expect(r.pts[7]!.y).toBe(0);
    expect(r.pts[12]!.y).toBeCloseTo(500, 8);
  });

  it('long grow-out (noble crayfish, 48 mo) pushes break-even well past the no-lag case', () => {
    const i = makeInputs('small', 'noblecray', 'greens_mix');
    const L = computeScenario('lease', i, BOTH_ON);
    const withLag = simulateMonthly(L, i, i.horizon);
    const noLag = simulateMonthly(L, { growMonths: 0, cycleDays: i.cycleDays }, i.horizon);
    // golden re-pinned for spec-04: noblecray growMonths corrected 30→48 (docs/research/fish-noblecray.md)
    // Also spec-03: heatDemand uses deriveHeatDemand (physics-based, ΔT=7.425)
    // formula: 48-month grow lag + lower heat cost → breakEven shifts out further
    expect(withLag.breakEven).toBeCloseTo(8.527, 2); // re-pinned golden (spec-04)
    expect(noLag.breakEven).not.toBeNull();
    expect(withLag.breakEven! - noLag.breakEven!).toBeGreaterThan(2.5); // 48-mo lag + deeper valley
  });

  it('default catfish lease does not pay back within the 15-yr horizon (despite positive EBITDA)', () => {
    const i = makeInputs('small', 'catfish', 'greens_mix');
    const L = computeScenario('lease', i, BOTH_ON);
    const r = simulateMonthly(L, i, i.horizon);
    expect(L.ebitda).toBeGreaterThan(0);
    expect(r.breakEven).toBeNull(); // the UI shows "> 15 yr"
  });

  it('year table aggregates the same monthly stream', () => {
    const i = makeInputs('small', 'catfish', 'greens_mix');
    const L = computeScenario('lease', i, BOTH_ON);
    const rows = yearRows(L, i, i.horizon);
    const sim = simulateMonthly(L, i, i.horizon);
    expect(rows).toHaveLength(i.horizon + 1);
    expect(rows[0]!.cum).toBe(-L.capex);
    expect(rows[i.horizon]!.cum).toBeCloseTo(sim.pts[i.horizon * 12]!.y, 6);
  });
});

describe('fish↔plant temperature pairing', () => {
  it('loop temperature is the comfort-band midpoint', () => {
    expect(loopTemp(FISH.catfish)).toBe(26.5);
    expect(loopTemp(FISH.trout)).toBe(14);
  });

  it('trout + head lettuce is a good cold-water pairing', () => {
    expect(pairFishPlant(FISH.trout, CROPS.lettuce_head).cls).toBe('good');
  });

  it('catfish runs too warm for mixed greens (poor → decoupled design)', () => {
    const p = pairFishPlant(FISH.catfish, CROPS.greens_mix);
    expect(p.cls).toBe('poor');
    expect(p.dir).toBe('warm');
  });

  it('catfish + basil share a warm loop happily', () => {
    expect(pairFishPlant(FISH.catfish, CROPS.basil).cls).toBe('good');
  });
});

describe('index scores', () => {
  it('normalises 0–100 across the set and clamps', () => {
    expect(indexScore(1, [1, 2, 3])).toBe(0);
    expect(indexScore(3, [1, 2, 3])).toBe(100);
    expect(indexScore(2, [1, 2, 3])).toBe(50);
    expect(indexScore(99, [1, 2, 3])).toBe(100);
    expect(indexScore(5, [5, 5])).toBe(50); // degenerate set
  });
});

// ── Spec-03: derive.ts tests ─────────────────────────────────────────────────

describe('deriveHeatDemand — calibration', () => {
  it('catfish/small reproduces old baseHeat×heatFactor (55000 kWh) within 5%', () => {
    // loopTemp = (25+28)/2 = 26.5°C; ΔT = 26.5-10.075 = 16.425°C
    // formula: 16.425/20 × 0.35 × 400 × 54.608 × 8760/1000 = 55000 kWh
    const result = deriveHeatDemand(FISH.catfish, BERLIN_REGION, BERLIN_ENCLOSURE, SCALES.small);
    expect(result).toBeCloseTo(55000, -2); // within ±100 kWh (0.2%)
    expect(Math.abs(result - 55000) / 55000).toBeLessThan(0.05);
  });

  it('trout/small returns a value proportional to its lower ΔT vs catfish', () => {
    // trout loopTemp = (12+16)/2 = 14°C; ΔT = 14-10.075 = 3.925°C
    // expected ≈ 55000 × (3.925/16.425) = 13143 kWh (physics-based, not old heatFactor)
    const result = deriveHeatDemand(FISH.trout, BERLIN_REGION, BERLIN_ENCLOSURE, SCALES.small);
    const expected = 55000 * (3.925 / 16.425);
    expect(result).toBeCloseTo(expected, -1);
  });

  it('returns 0 for a species where loopTemp ≤ annualMean', () => {
    // Hypothetical cold fish with loopTemp=8°C in Berlin (mean=10.075)
    const coldFish = { fcMin: 6, fcMax: 10 }; // loopTemp=8
    const result = deriveHeatDemand(coldFish, BERLIN_REGION, BERLIN_ENCLOSURE, SCALES.small);
    expect(result).toBe(0);
  });
});

describe('deriveSuitability — Berlin region', () => {
  it('catfish → costly (loopTemp=26.5, ΔT=16.425 > 15)', () => {
    // ΔT = 26.5 - 10.075 = 16.425 > 15 → costly
    expect(deriveSuitability(FISH.catfish, BERLIN_REGION)).toBe('costly');
  });

  it('trout → native (loopTemp=14, ΔT=3.925 < 5)', () => {
    // ΔT = 14 - 10.075 = 3.925 < 5 → native
    // Note: spec draft said 'workable' but correct formula gives 'native'
    expect(deriveSuitability(FISH.trout, BERLIN_REGION)).toBe('native');
  });

  it('noblecray → workable (loopTemp=17.5, ΔT=7.425 in 5–15 range)', () => {
    // ΔT = 17.5 - 10.075 = 7.425; 5 < 7.425 < 15 → workable
    expect(deriveSuitability(FISH.noblecray, BERLIN_REGION)).toBe('workable');
  });
});

describe('deriveMonthlyHeatDemand — seasonal', () => {
  it('returns 12-element array', () => {
    const monthly = deriveMonthlyHeatDemand(FISH.catfish, BERLIN_REGION, BERLIN_ENCLOSURE, SCALES.small);
    expect(monthly).toHaveLength(12);
  });

  it('sum matches annual deriveHeatDemand within ±2%', () => {
    const monthly = deriveMonthlyHeatDemand(FISH.catfish, BERLIN_REGION, BERLIN_ENCLOSURE, SCALES.small);
    const annual = deriveHeatDemand(FISH.catfish, BERLIN_REGION, BERLIN_ENCLOSURE, SCALES.small);
    const sum = monthly.reduce((a: number, b: number) => a + b, 0);
    expect(Math.abs(sum - annual) / annual).toBeLessThan(0.02);
  });

  it('summer months have zero heat demand for cold-water trout', () => {
    // trout loopTemp=14°C; in July/Aug ambient=20.1/19.8°C > 14 → 0 heat
    const monthly = deriveMonthlyHeatDemand(FISH.trout, BERLIN_REGION, BERLIN_ENCLOSURE, SCALES.small);
    expect(monthly[6]).toBe(0); // July
    expect(monthly[7]).toBe(0); // August
  });
});

describe('deriveEffectiveGrowMonths — winter gating', () => {
  it('catfish (fcMin=25): all 12 Berlin months below 25°C → adds 12 cold months', () => {
    // Berlin monthlyAmbientC max = 20.1°C < 25 → all 12 months are cold
    // effectiveGrowMonths = 5 (catfish growMonths, corrected spec-04) + 12 = 17
    const result = deriveEffectiveGrowMonths(FISH.catfish, BERLIN_REGION);
    expect(result).toBe(FISH.catfish.growMonths + 12);
  });

  it('trout (fcMin=12): counts months with ambient < 12°C', () => {
    // Berlin monthly: [0.3,1.2,5.2,9.7,15.1,18.2,20.1,19.8,15.3,9.8,4.7,1.5]
    // months < 12°C: Jan(0.3), Feb(1.2), Mar(5.2), Apr(9.7), Oct(9.8), Nov(4.7), Dec(1.5) = 7 months
    const coldMonths = BERLIN_REGION.monthlyAmbientC.filter((t: number) => t < FISH.trout.fcMin).length;
    const result = deriveEffectiveGrowMonths(FISH.trout, BERLIN_REGION);
    expect(result).toBe(FISH.trout.growMonths + coldMonths);
  });
});

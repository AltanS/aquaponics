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

/** Build CalcInputs exactly the way the UI seeds them from the presets. */
function makeInputs(scale: keyof typeof SCALES, fish: keyof typeof FISH, crop: keyof typeof CROPS): CalcInputs {
  const s = SCALES[scale];
  const f = FISH[fish];
  const c = CROPS[crop];
  return {
    fishKg: s.fishKg, fishPrice: f.price, fcr: f.fcr, feedPrice: ENERGY.feedPrice,
    stockCost: f.stockCost, growMonths: f.growMonths,
    growArea: s.growArea, yieldM2: c.yld, plantPrice: c.price, seedCost: c.seedCost, cycleDays: c.cycleDays,
    sysKwh: s.sysKwh, heatDemand: Math.round(s.baseHeat * f.heatFactor),
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

  it('long grow-out (noble crayfish, 30 mo) pushes break-even well past the no-lag case', () => {
    const i = makeInputs('small', 'noblecray', 'greens_mix');
    const L = computeScenario('lease', i, BOTH_ON);
    const withLag = simulateMonthly(L, i, i.horizon);
    const noLag = simulateMonthly(L, { growMonths: 0, cycleDays: i.cycleDays }, i.horizon);
    expect(withLag.breakEven).toBeCloseTo(6.871, 2); // golden value
    expect(noLag.breakEven).not.toBeNull();
    expect(withLag.breakEven! - noLag.breakEven!).toBeGreaterThan(2.5); // 30-mo lag + deeper valley
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

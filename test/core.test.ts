import { describe, expect, it } from 'vitest';
import { CROPS, ENERGY, FINANCE, FISH, MODEL, PROPERTY, SCALES } from '../src/data';
import {
  computeEnergy,
  computeScenario,
  cropValue,
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
import { BERLIN_REGION, BERLIN_ENCLOSURE } from '../src/data/berlin-defaults';

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
    growArea: s.growArea, cropAreaFraction: MODEL.cropAreaFraction, stackFactor: 1,
    yieldM2: c.yld, plantPrice: c.price, seedCost: c.seedCost, cycleDays: c.cycleDays,
    sysKwh: s.sysKwh,
    heatDemand: Math.round(deriveHeatDemand(f, BERLIN_REGION, BERLIN_ENCLOSURE, s)),
    cop: ENERGY.cop, pvKwp: s.pvKwp, pvYield: ENERGY.pvYield, scRate: ENERGY.scRate,
    gridPrice: ENERGY.gridPrice, feedIn: ENERGY.feedIn, gasPrice: ENERGY.gasPrice, omSolar: ENERGY.omSolar,
    pvCostPerKwp: ENERGY.pvCostPerKwp, hpCostPerKw: ENERGY.hpCostPerKw, hpFullLoadHours: ENERGY.hpFullLoadHours,
    constructionPerM2: s.constructionPerM2, rentPerM2Month: PROPERTY.rentPerM2Month,
    landLeaseYear: s.landLeaseYear, equipmentCapex: s.equipmentCapex,
    laborHrs: s.laborHrs, ownerHrs: s.ownerHrs, wage: FINANCE.wage, waterNut: s.waterNut, distrib: s.distrib, maint: s.maint,
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
    // canopy = 400 m² × 0.6 = 240 m²; greens_mix yld 28→20 (conservative)
    expect(L.rev).toBe(48600); // fish 3000×9=27000 + plants 240×20×4.5=21600
    expect(L.inputs).toBeCloseTo(9840, 6); // feed 5280 + stock 2400 + seed 240×9=2160
    // small tier is owner-run (ownerHrs 30 = laborHrs 30) → hired labour = €0 cash
    expect(L.labor).toBe(0);
    expect(L.ownerLabor).toBe(26520); // 30×52×17 owner opportunity cost (memo, below EBITDA)
    expect(L.opex).toBeCloseTo(29287.708, 2);
    expect(L.ebitda).toBeCloseTo(19312.292, 2); // cash EBITDA (owner unpaid)
    expect(L.ebitda - L.ownerLabor).toBeCloseTo(-7207.708, 2); // economic profit if owner paid market wage
    expect(L.construction).toBe(140000); // 350 €/m² × 400 m² footprint (unchanged)
    expect(L.capex).toBe(340250); // 110000 + 140000 + 60000 PV + 30250 HP
    expect(L.net).toBeCloseTo(-9041.875, 2); // cash EBITDA − depreciation
  });

  it('matches the prototype rent scenario', () => {
    const R = computeScenario('rent', i, BOTH_ON);
    expect(R.construction).toBe(0);
    expect(R.capex).toBe(200250);
    expect(R.rent).toBe(21600); // 4.5 × 400 m² footprint × 12 (unchanged)
    expect(R.ebitda).toBeCloseTo(712.292, 2); // cash EBITDA (owner unpaid): rev 48600 − opex 47887.708
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

describe('plant-area levers: canopy fraction & vertical stacking', () => {
  it('vertical stacking scales plant revenue & seed cost linearly', () => {
    const base = makeInputs('small', 'catfish', 'greens_mix');
    const flat = computeScenario('lease', base, BOTH_ON);
    const stacked = computeScenario('lease', { ...base, stackFactor: 2 }, BOTH_ON);
    expect(stacked.plantRev).toBeCloseTo(flat.plantRev * 2, 6);
    // fish revenue is untouched by stacking
    expect(stacked.fishRev).toBe(flat.fishRev);
  });

  it('premium mix carries a higher revenue density than the staple greens mix', () => {
    expect(cropValue(CROPS.premium_mix.yld, CROPS.premium_mix.price)).toBeGreaterThan(
      cropValue(CROPS.greens_mix.yld, CROPS.greens_mix.price),
    );
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
    // golden re-pinned: conservative plant model pushed break-even out, but the
    // owner-labour split (small is owner-run → €0 hired labour in opex) pulls it
    // back in to 8.582 yr.
    expect(withLag.breakEven).toBeCloseTo(8.582, 2); // re-pinned golden (canopy + conservative yields + owner-labour)
    expect(noLag.breakEven).not.toBeNull();
    expect(withLag.breakEven! - noLag.breakEven!).toBeGreaterThan(2.5); // 48-mo lag + deeper valley
  });

  it('default catfish/greens has positive cash EBITDA (owner unpaid) but still does not pay back the CAPEX within the horizon', () => {
    const i = makeInputs('small', 'catfish', 'greens_mix');
    const L = computeScenario('lease', i, BOTH_ON);
    const r = simulateMonthly(L, i, i.horizon);
    // Owner-run → cash EBITDA positive, but it's too thin against €340k CAPEX
    // (and the grow-out ramp) to break even inside the horizon.
    expect(L.ebitda).toBeGreaterThan(0);
    expect(r.breakEven).toBeNull();
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

// ── Spec-05: simulateMonthly with monthlyHeatOpex ────────────────────────────

describe('simulateMonthly with monthlyHeatOpex (seasonal mode)', () => {
  it('produces valid monthly rows when monthlyHeatOpex is provided', () => {
    const i = makeInputs('small', 'catfish', 'greens_mix');
    // Compute monthly heat opex: 12-element array (catfish: all 12 months heated)
    const monthlyHeat = deriveMonthlyHeatDemand(FISH.catfish, BERLIN_REGION, BERLIN_ENCLOSURE, SCALES.small);
    const monthlyHeatOpex = monthlyHeat.map((kwhHeat: number) => (kwhHeat / ENERGY.cop) * ENERGY.gridPrice);

    const L = computeScenario('lease', i, BOTH_ON);
    // Simulate WITH monthly heat opex
    const withMonthly = simulateMonthly(L, { ...i, monthlyHeatOpex }, i.horizon);
    // Simulate WITHOUT (baseline — flat heat distribution)
    const withFlat = simulateMonthly(L, i, i.horizon);

    // Both produce the same number of points
    expect(withMonthly.pts).toHaveLength(withFlat.pts.length);
    // Start point is identical (capex outflow)
    expect(withMonthly.pts[0]).toEqual({ x: 0, y: -L.capex });
    // Seasonal mode must diverge from flat mode (different monthly heat distribution)
    // catfish has full-year heating, so the curves differ by calendar-month variance
    expect(withMonthly.pts).not.toEqual(withFlat.pts);
    // Annual sum of monthlyHeatOpex should approximately equal the flat-annual heat cost
    const annualMonthly = monthlyHeatOpex.reduce((a: number, b: number) => a + b, 0);
    // flat heat cost: heatDemand kWh / cop * gridPrice (but heatDemand is rounded, so close enough)
    const flatAnnual = (i.heatDemand / ENERGY.cop) * ENERGY.gridPrice;
    expect(Math.abs(annualMonthly - flatAnnual) / flatAnnual).toBeLessThan(0.02);
  });
});

// ── Per-enterprise contribution split (fish vs plants) ──────────────────────

import { enterpriseContribution } from '../src/core';

describe('enterprise contribution', () => {
  // Synthetic, hand-computed case: both enterprises earn €10,000/yr.
  const i = {
    ...makeInputs('small', 'catfish', 'greens_mix'),
    fishKg: 1000, fishPrice: 10, fcr: 1, feedPrice: 1, stockCost: 1,
    growArea: 100, cropAreaFraction: 1, yieldM2: 20, plantPrice: 5, seedCost: 10,
    laborHrs: 10, wage: 20,
  };
  const shares = { laborShareFish: 0.35, laborSharePlants: 0.45, energyShareFish: 0.7 };

  it('splits labour, energy and direct costs and computes contribution profit', () => {
    const c = enterpriseContribution(i, 1000, shares, 0.5, 0.4);
    // hoursTotal 520; revenue share 50/50 → fish gets 0.35 + 0.2×0.5 = 0.45
    expect(c.fish.laborHours).toBeCloseTo(234, 8);
    expect(c.plants.laborHours).toBeCloseTo(286, 8);
    expect(c.fish.revenue).toBe(10000);
    expect(c.plants.revenue).toBe(10000);
    expect(c.fish.direct).toBe(2000); // feed 1000 + juveniles 1000
    expect(c.plants.direct).toBe(1000); // seedlings
    expect(c.fish.energy).toBeCloseTo(700, 8);
    expect(c.plants.energy).toBeCloseTo(300, 8);
    expect(c.fish.profit).toBeCloseTo(10000 - 2000 - 4680 - 700, 6); // 2620
    expect(c.plants.profit).toBeCloseTo(10000 - 1000 - 5720 - 300, 6); // 2980
    expect(c.fish.profitPerHour).toBeCloseTo(2620 / 234, 6);
    expect(c.plants.profitPerHour).toBeCloseTo(2980 / 286, 6);
  });

  it('converts kg to sellable units via market/unit weights', () => {
    const c = enterpriseContribution(i, 1000, shares, 0.5, 0.4);
    expect(c.fish.kgPerYear).toBe(1000);
    expect(c.fish.unitsPerYear).toBeCloseTo(2000, 8); // 1000 kg ÷ 0.5 kg/fish
    expect(c.plants.kgPerYear).toBe(2000); // 100 m² × 20 kg/m²
    expect(c.plants.unitsPerYear).toBeCloseTo(5000, 8); // ÷ 0.4 kg/head
    const noUnits = enterpriseContribution(i, 1000, shares, 0.5, null);
    expect(noUnits.plants.unitsPerYear).toBeNull();
  });

  it('enterprise totals sum to the venture-level lines (rev, inputs, labour, energy)', () => {
    const c = enterpriseContribution(i, 1000, shares, 0.5, 0.4);
    expect(c.fish.revenue + c.plants.revenue).toBeCloseTo(i.fishKg * i.fishPrice + i.growArea * i.cropAreaFraction * i.yieldM2 * i.plantPrice, 6);
    expect(c.fish.labor + c.plants.labor).toBeCloseTo(i.laborHrs * 52 * i.wage, 6);
    expect(c.fish.energy + c.plants.energy).toBeCloseTo(1000, 6);
  });
});

// ── Subsidies / grants eligibility ──────────────────────────────────────────

import { computeSubsidies } from '../src/core';
import { SUBSIDIES } from '../src/data';

describe('subsidies — eligibility-gated grants', () => {
  // small/lease CAPEX components (from the golden): construction 140000,
  // equipment 110000, PV 60000, HP 30250, total 340250.
  const smallLease = { construction: 140000, equipment: 110000, pv: 60000, hp: 30250, total: 340250 };

  it('applies both grants to a commercial lease with a heat pump', () => {
    const r = computeSubsidies({ scaleTier: 'small', capex: smallLease, heatpump: true, solar: true }, SUBSIDIES);
    const byId = Object.fromEntries(r.applied.map((a) => [a.id, a]));
    // Brandenburg aquaculture: 40% of min(250000, 200000 cap) = 80000
    expect(byId['bb_aquaculture']!.amount).toBeCloseTo(80000, 6);
    expect(byId['bb_aquaculture']!.eligibleBase).toBe(200000); // capped
    // KfW heat pump: 30% of 30250 = 9075
    expect(byId['kfw_beg_heatpump']!.amount).toBeCloseTo(9075, 6);
    expect(r.total).toBeCloseTo(89075, 6);
    expect(r.ineligible).toHaveLength(0);
  });

  it('excludes the aquaculture grant for a hobby setup, with a reason', () => {
    const r = computeSubsidies({ scaleTier: 'hobby', capex: smallLease, heatpump: true, solar: true }, SUBSIDIES);
    expect(r.applied.map((a) => a.id)).not.toContain('bb_aquaculture');
    const why = r.ineligible.find((x) => x.id === 'bb_aquaculture');
    expect(why?.reason).toMatch(/commercial/i);
    // heat-pump grant still applies regardless of tier
    expect(r.applied.map((a) => a.id)).toContain('kfw_beg_heatpump');
  });

  it('excludes the heat-pump grant when no heat pump is installed', () => {
    const r = computeSubsidies({ scaleTier: 'small', capex: smallLease, heatpump: false, solar: true }, SUBSIDIES);
    expect(r.applied.map((a) => a.id)).not.toContain('kfw_beg_heatpump');
    expect(r.ineligible.find((x) => x.id === 'kfw_beg_heatpump')?.reason).toMatch(/heat pump/i);
  });

  it('shrinks the aquaculture base to equipment-only when renting (no construction)', () => {
    const rentCapex = { ...smallLease, construction: 0, total: 200250 };
    const r = computeSubsidies({ scaleTier: 'small', capex: rentCapex, heatpump: true, solar: true }, SUBSIDIES);
    const bb = r.applied.find((a) => a.id === 'bb_aquaculture');
    // base = equipment 110000 only (< 200000 cap) → 40% = 44000
    expect(bb?.eligibleBase).toBe(110000);
    expect(bb?.amount).toBeCloseTo(44000, 6);
  });
});

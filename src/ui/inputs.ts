import { CROPS, FISH, MODEL, REGIONS, SCALES } from '../data';
import { deriveHeatDemand, deriveMonthlyHeatDemand } from '../core/derive';
import type { CalcInputs } from '../core';
import { num, setVal } from './dom';
import type { AppState } from './state';

/** Every editable numeric input id — drives reading, and the persisted snapshot. */
export const INPUT_IDS = [
  'fishKg', 'fishPrice', 'fcr', 'feedPrice', 'stockCost', 'growMonths',
  'growArea', 'canopyPct', 'stackFactor', 'yieldM2', 'plantPrice', 'seedCost', 'cycleDays',
  'sysKwh', 'heatDemand', 'cop', 'pvKwp', 'pvYield', 'scRate',
  'gridPrice', 'feedIn', 'gasPrice', 'omSolar',
  'pvCostPerKwp', 'hpCostPerKw', 'hpFullLoadHours',
  'constructionPerM2', 'rentPerM2Month', 'landLeaseYear', 'equipmentCapex',
  'laborHrs', 'ownerHrs', 'wage', 'waterNut', 'distrib', 'maint',
  'deprYears', 'horizonYears',
] as const;

/** Seed the fish-related inputs from the selected species (preset behaviour). */
export function applyFishPreset(state: AppState): void {
  const f = FISH[state.species];
  const s = SCALES[state.scale];
  const R = REGIONS[state.region];
  setVal('fishPrice', R.fishPrices[state.species] ?? f.price);
  setVal('fcr', f.fcr);
  setVal('stockCost', f.stockCost);
  setVal('growMonths', f.growMonths);
  const heat = Math.round(deriveHeatDemand(f, R, R.enclosure, s));
  setVal('heatDemand', heat);
}

/** Seed the crop-related inputs from the selected crop (regional price override). */
export function applyCropPreset(state: AppState): void {
  const c = CROPS[state.crop];
  const R = REGIONS[state.region];
  setVal('yieldM2', c.yld);
  setVal('plantPrice', R.cropPrices[state.crop] ?? c.price);
  setVal('seedCost', c.seedCost);
  setVal('cycleDays', c.cycleDays);
}

/**
 * Seed the scale-owned inputs from the selected tier (preset behaviour).
 * Deliberately does NOT touch prices/economics the user may have adjusted —
 * a scale click only overwrites what the scale owns, plus the derived heat
 * demand (it depends on grow area).
 */
export function applyScalePreset(state: AppState): void {
  const s = SCALES[state.scale];
  const f = FISH[state.species];
  const R = REGIONS[state.region];
  setVal('fishKg', s.fishKg);
  setVal('growArea', s.growArea);
  setVal('sysKwh', s.sysKwh);
  setVal('pvKwp', s.pvKwp);
  setVal('laborHrs', s.laborHrs);
  setVal('ownerHrs', s.ownerHrs);
  setVal('waterNut', s.waterNut);
  setVal('distrib', s.distrib);
  setVal('maint', s.maint);
  setVal('equipmentCapex', s.equipmentCapex);
  setVal('constructionPerM2', s.constructionPerM2);
  setVal('landLeaseYear', s.landLeaseYear);
  setVal('heatDemand', Math.round(deriveHeatDemand(f, R, R.enclosure, s)));
}

/** Seed every input from the current scale + species + crop + global defaults. */
export function fillAll(state: AppState): void {
  const E = REGIONS[state.region].economics;
  applyScalePreset(state);
  applyFishPreset(state);
  applyCropPreset(state);

  setVal('feedPrice', E.feedPrice);
  setVal('cop', E.cop);
  setVal('pvYield', E.pvYield);
  setVal('scRate', E.scRate);
  setVal('gridPrice', E.gridPrice);
  setVal('feedIn', E.feedIn);
  setVal('gasPrice', E.gasPrice);
  setVal('omSolar', E.omSolar);
  setVal('pvCostPerKwp', E.pvCostPerKwp);
  setVal('hpCostPerKw', E.hpCostPerKw);
  setVal('hpFullLoadHours', E.hpFullLoadHours);

  setVal('canopyPct', Math.round(MODEL.cropAreaFraction * 100));
  setVal('stackFactor', 1);
  setVal('rentPerM2Month', E.rentPerM2Month);
  setVal('wage', E.wage);
  setVal('deprYears', E.deprYears);
  setVal('horizonYears', E.horizonYears);
}

/** Read every editable assumption from the form. */
export function readInputs(state?: AppState): CalcInputs {
  const base: CalcInputs = {
    fishKg: num('fishKg'),
    fishPrice: num('fishPrice'),
    fcr: num('fcr'),
    feedPrice: num('feedPrice'),
    stockCost: num('stockCost'),
    growMonths: Math.max(0, num('growMonths')),
    growArea: num('growArea'),
    cropAreaFraction: Math.min(1, Math.max(0.05, num('canopyPct') / 100)),
    stackFactor: Math.max(1, num('stackFactor')),
    yieldM2: num('yieldM2'),
    plantPrice: num('plantPrice'),
    seedCost: num('seedCost'),
    cycleDays: Math.max(0, num('cycleDays')),
    sysKwh: num('sysKwh'),
    heatDemand: num('heatDemand'),
    cop: Math.max(1, num('cop')),
    pvKwp: num('pvKwp'),
    pvYield: num('pvYield'),
    scRate: num('scRate'),
    gridPrice: num('gridPrice'),
    feedIn: num('feedIn'),
    gasPrice: num('gasPrice'),
    omSolar: num('omSolar'),
    pvCostPerKwp: num('pvCostPerKwp'),
    hpCostPerKw: num('hpCostPerKw'),
    hpFullLoadHours: Math.max(100, num('hpFullLoadHours')),
    constructionPerM2: num('constructionPerM2'),
    rentPerM2Month: num('rentPerM2Month'),
    landLeaseYear: num('landLeaseYear'),
    equipmentCapex: num('equipmentCapex'),
    laborHrs: num('laborHrs'),
    ownerHrs: Math.max(0, num('ownerHrs')),
    wage: num('wage'),
    waterNut: num('waterNut'),
    distrib: num('distrib'),
    maint: num('maint'),
    deprYears: Math.max(1, num('deprYears')),
    horizon: Math.max(3, num('horizonYears')),
  };

  // Compute monthly heat opex when region is available (used by simulateMonthly for seasonal mode)
  if (state) {
    const fish = FISH[state.species];
    const scale = SCALES[state.scale];
    const R = REGIONS[state.region];
    const gridPrice = base.gridPrice;
    const cop = base.cop;
    const gasPrice = base.gasPrice;
    const monthlyHeat = deriveMonthlyHeatDemand(fish, R, R.enclosure, scale);
    // Heat pump on → electricity at gridPrice/COP; heat pump off → gas at gasPrice per kWh thermal
    base.monthlyHeatOpex = state.heatpump
      ? monthlyHeat.map((kwhHeat) => (kwhHeat / cop) * gridPrice)
      : monthlyHeat.map((kwhHeat) => kwhHeat * gasPrice);
  }

  return base;
}

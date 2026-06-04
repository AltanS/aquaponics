import { CROPS, ENERGY, FINANCE, FISH, PROPERTY, SCALES } from '../data';
import { deriveHeatDemand, deriveMonthlyHeatDemand } from '../core/derive';
import type { CalcInputs } from '../core';
import { num, setVal } from './dom';
import type { AppState } from './state';

/**
 * Berlin/Brandenburg default region for heat derivation.
 * Hard-coded until T7 connects the region selector.
 * monthlyAmbientC: Jan–Dec °C, Brandenburg (Potsdam/DWD).
 */
const BERLIN_REGION = {
  annualMeanAmbientC: 10.075, // mean of monthlyAmbientC array
  monthlyAmbientC: [0.3, 1.2, 5.2, 9.7, 15.1, 18.2, 20.1, 19.8, 15.3, 9.8, 4.7, 1.5],
};

/** Default insulated-greenhouse enclosure spec for Berlin. */
const BERLIN_ENCLOSURE = {
  heatLossFactor: 0.35,
};

/** Seed the fish-related inputs from the selected species (preset behaviour). */
export function applyFishPreset(state: AppState): void {
  const f = FISH[state.species];
  const s = SCALES[state.scale];
  setVal('fishPrice', f.price);
  setVal('fcr', f.fcr);
  setVal('stockCost', f.stockCost);
  setVal('growMonths', f.growMonths);
  const heat = Math.round(deriveHeatDemand(f, BERLIN_REGION, BERLIN_ENCLOSURE, s));
  setVal('heatDemand', heat);
}

/** Seed the crop-related inputs from the selected crop. */
export function applyCropPreset(state: AppState): void {
  const c = CROPS[state.crop];
  setVal('yieldM2', c.yld);
  setVal('plantPrice', c.price);
  setVal('seedCost', c.seedCost);
  setVal('cycleDays', c.cycleDays);
}

/** Seed every input from the current scale + species + crop + global defaults. */
export function fillAll(state: AppState): void {
  const s = SCALES[state.scale];
  setVal('fishKg', s.fishKg);
  setVal('growArea', s.growArea);
  setVal('sysKwh', s.sysKwh);
  setVal('pvKwp', s.pvKwp);
  setVal('laborHrs', s.laborHrs);
  setVal('waterNut', s.waterNut);
  setVal('distrib', s.distrib);
  setVal('maint', s.maint);
  setVal('equipmentCapex', s.equipmentCapex);
  setVal('constructionPerM2', s.constructionPerM2);
  setVal('landLeaseYear', s.landLeaseYear);

  applyFishPreset(state);
  applyCropPreset(state);

  setVal('feedPrice', ENERGY.feedPrice);
  setVal('cop', ENERGY.cop);
  setVal('pvYield', ENERGY.pvYield);
  setVal('scRate', ENERGY.scRate);
  setVal('gridPrice', ENERGY.gridPrice);
  setVal('feedIn', ENERGY.feedIn);
  setVal('gasPrice', ENERGY.gasPrice);
  setVal('omSolar', ENERGY.omSolar);
  setVal('pvCostPerKwp', ENERGY.pvCostPerKwp);
  setVal('hpCostPerKw', ENERGY.hpCostPerKw);
  setVal('hpFullLoadHours', ENERGY.hpFullLoadHours);

  setVal('rentPerM2Month', PROPERTY.rentPerM2Month);
  setVal('wage', FINANCE.wage);
  setVal('deprYears', FINANCE.deprYears);
  setVal('horizonYears', FINANCE.horizonYears);
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
    const gridPrice = base.gridPrice;
    const cop = base.cop;
    // Monthly heat demand → monthly opex: heat pump uses electricity at gridPrice/COP
    const monthlyHeat = deriveMonthlyHeatDemand(fish, BERLIN_REGION, BERLIN_ENCLOSURE, scale);
    base.monthlyHeatOpex = monthlyHeat.map((kwhHeat) => (kwhHeat / cop) * gridPrice);
  }

  return base;
}

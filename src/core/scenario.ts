import { computeEnergy, energyCapex, type EnergyResult } from './energy';
import type { CalcInputs, ScenarioKey, Toggles } from './types';

export interface ScenarioResult {
  rev: number;
  fishRev: number;
  plantRev: number;
  /** feed + bought-in juveniles + seedlings, €/yr */
  inputs: number;
  /** net energy OPEX €/yr */
  energy: number;
  labor: number;
  /** land lease (lease) or structure rent (rent), €/yr */
  rent: number;
  /** water+nutrients, distribution, maintenance, €/yr */
  over: number;
  opex: number;
  /** revenue − OPEX, "steady profit/yr" */
  ebitda: number;
  capex: number;
  /** construction share of CAPEX (lease scenario only) */
  construction: number;
  /** PV + heat-pump share of CAPEX */
  energyCapex: number;
  depr: number;
  /** EBITDA − depreciation */
  net: number;
  E: EnergyResult;
}

/**
 * Steady-state annual economics for one property scenario (HANDOFF.md §4).
 * Equipment, solar and heat-pump CAPEX are shared between scenarios;
 * construction belongs to lease ONLY — putting it in both double-counts
 * the building.
 */
export function computeScenario(key: ScenarioKey, i: CalcInputs, t: Toggles): ScenarioResult {
  // Productive canopy is a fraction of the heated footprint; tanks, sump,
  // filtration, nursery and aisles take the rest. Plant output & seed cost
  // scale with canopy, while construction/heat/rent use the full footprint.
  const canopy = i.growArea * i.cropAreaFraction;
  const fishRev = i.fishKg * i.fishPrice;
  const plantRev = canopy * i.yieldM2 * i.plantPrice;
  const rev = fishRev + plantRev;

  const inputs = i.fishKg * i.fcr * i.feedPrice + i.fishKg * i.stockCost + canopy * i.seedCost;

  const E = computeEnergy(i, t);
  const labor = i.laborHrs * 52 * i.wage;
  const rent = key === 'lease' ? i.landLeaseYear : i.rentPerM2Month * i.growArea * 12;
  const over = i.waterNut + i.distrib + i.maint;
  const opex = inputs + E.opex + labor + rent + over;
  const ebitda = rev - opex;

  const EC = energyCapex(i, t);
  const construction = key === 'lease' ? i.constructionPerM2 * i.growArea : 0;
  const capex = i.equipmentCapex + construction + EC.pv + EC.hp;
  const depr = capex / i.deprYears;

  return {
    rev, fishRev, plantRev, inputs, energy: E.opex, labor, rent, over,
    opex, ebitda, capex, construction, energyCapex: EC.pv + EC.hp,
    depr, net: ebitda - depr, E,
  };
}

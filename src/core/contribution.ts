import type { CalcInputs } from './types';

/**
 * Attribution shares for splitting shared costs between the fish and plant
 * enterprises — sourced from data/model.yaml (see ModelAssumptions).
 */
export interface AttributionShares {
  laborShareFish: number;
  laborSharePlants: number;
  energyShareFish: number;
}

export interface EnterpriseTotals {
  /** kg sold per year (steady state) */
  kgPerYear: number;
  /** sellable units per year (kg ÷ unit weight), or null when no unit weight applies */
  unitsPerYear: number | null;
  /** €/yr */
  revenue: number;
  /** direct inputs €/yr — feed+juveniles (fish) or seedlings (plants) */
  direct: number;
  /** attributed labour cost €/yr (direct share + revenue-weighted general share) */
  labor: number;
  /** attributed hours per year */
  laborHours: number;
  /** attributed net energy cost €/yr */
  energy: number;
  /** contribution profit €/yr = revenue − direct − labour − energy.
   * BEFORE property rent, other overheads and depreciation. */
  profit: number;
  /** contribution profit per attributed labour hour, or null if no hours */
  profitPerHour: number | null;
}

export interface ContributionResult {
  fish: EnterpriseTotals;
  plants: EnterpriseTotals;
}

/**
 * Split the joint operation into fish and plant enterprises so each gets an
 * honest contribution-profit estimate including the work involved.
 *
 * Labour: each enterprise carries its direct share; the remaining "general"
 * share (admin/sales) is attributed pro-rata to revenue. Energy: split by the
 * configured share (heating + pumps serve the fish loop; lights the plants).
 * Property rent, other overheads and depreciation are deliberately NOT
 * attributed — they belong to the venture, not an enterprise.
 */
export function enterpriseContribution(
  i: CalcInputs,
  energyOpex: number,
  shares: AttributionShares,
  fishMarketWeightKg: number,
  cropUnitWeightKg: number | null,
): ContributionResult {
  const canopy = i.growArea * i.cropAreaFraction;
  const fishRev = i.fishKg * i.fishPrice;
  const plantKg = canopy * i.yieldM2;
  const plantRev = plantKg * i.plantPrice;
  const rev = fishRev + plantRev;
  const revShareFish = rev > 0 ? fishRev / rev : 0.5;

  const generalShare = Math.max(0, 1 - shares.laborShareFish - shares.laborSharePlants);
  const hoursTotal = i.laborHrs * 52;
  const hoursFish = hoursTotal * (shares.laborShareFish + generalShare * revShareFish);
  const hoursPlants = hoursTotal - hoursFish;
  const laborFish = hoursFish * i.wage;
  const laborPlants = hoursPlants * i.wage;

  const energyFish = energyOpex * shares.energyShareFish;
  const energyPlants = energyOpex - energyFish;

  const directFish = i.fishKg * i.fcr * i.feedPrice + i.fishKg * i.stockCost;
  const directPlants = canopy * i.seedCost;

  const make = (
    kgPerYear: number,
    unitWeight: number | null,
    revenue: number,
    direct: number,
    labor: number,
    laborHours: number,
    energy: number,
  ): EnterpriseTotals => {
    const profit = revenue - direct - labor - energy;
    return {
      kgPerYear,
      unitsPerYear: unitWeight !== null && unitWeight > 0 ? kgPerYear / unitWeight : null,
      revenue,
      direct,
      labor,
      laborHours,
      energy,
      profit,
      profitPerHour: laborHours > 0 ? profit / laborHours : null,
    };
  };

  return {
    fish: make(i.fishKg, fishMarketWeightKg > 0 ? fishMarketWeightKg : null, fishRev, directFish, laborFish, hoursFish, energyFish),
    plants: make(plantKg, cropUnitWeightKg, plantRev, directPlants, laborPlants, hoursPlants, energyPlants),
  };
}

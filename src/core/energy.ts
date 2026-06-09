import type { CalcInputs, Toggles } from './types';

export interface EnergyResult {
  /** net annual energy cost € (grid import + PV O&M + gas − feed-in revenue) */
  opex: number;
  /** total electricity demand kWh/yr (systems + heat-pump electricity) */
  demand: number;
  /** PV generation kWh/yr */
  gen: number;
  /** grid import kWh/yr */
  imp: number;
  /** effective €/kWh across total demand */
  eff: number;
  /** grid import cost €/yr */
  gridCost: number;
  /** PV O&M on self-consumed kWh €/yr */
  omCost: number;
  /** feed-in revenue for exported surplus €/yr (positive number, credited) */
  exportCredit: number;
  /** gas boiler cost €/yr (heat pump OFF) */
  gasCost: number;
}

/**
 * Solar-first energy model with an electric heat pump.
 * Heat pump converts thermal demand to electricity via SCOP; toggled off it
 * falls back to a gas boiler. Self-consumed solar costs only O&M; surplus is
 * exported at the feed-in tariff; the rest is grid import.
 */
export function computeEnergy(i: CalcInputs, t: Toggles): EnergyResult {
  const heatElec = t.heatpump ? i.heatDemand / i.cop : 0;
  const gasCost = t.heatpump ? 0 : i.heatDemand * i.gasPrice;
  const demand = i.sysKwh + heatElec;
  const gen = t.solar ? i.pvKwp * i.pvYield : 0;
  const selfUsed = Math.min(demand, (gen * i.scRate) / 100);
  const imp = Math.max(0, demand - selfUsed);
  const exp = Math.max(0, gen - selfUsed);
  const gridCost = imp * i.gridPrice;
  const omCost = selfUsed * i.omSolar;
  const exportCredit = exp * i.feedIn;
  const opex = gridCost + omCost - exportCredit + gasCost;
  return { opex, demand, gen, imp, eff: demand > 0 ? opex / demand : 0, gridCost, omCost, exportCredit, gasCost };
}

export interface EnergyCapex {
  pv: number;
  hp: number;
}

/** Solar and heat pump are real CAPEX, not amortised into a per-kWh LCOE. */
export function energyCapex(i: CalcInputs, t: Toggles): EnergyCapex {
  return {
    pv: t.solar ? i.pvKwp * i.pvCostPerKwp : 0,
    hp: t.heatpump ? (i.heatDemand / i.hpFullLoadHours) * i.hpCostPerKw : 0,
  };
}

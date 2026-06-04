/** Inputs to the calculation core — every assumption the UI lets the user edit. */
export interface CalcInputs {
  // fish
  fishKg: number;
  fishPrice: number;
  fcr: number;
  feedPrice: number;
  stockCost: number;
  growMonths: number;
  // crop
  growArea: number;
  yieldM2: number;
  plantPrice: number;
  seedCost: number;
  cycleDays: number;
  // energy
  sysKwh: number;
  heatDemand: number;
  cop: number;
  pvKwp: number;
  pvYield: number;
  scRate: number;
  gridPrice: number;
  feedIn: number;
  gasPrice: number;
  omSolar: number;
  pvCostPerKwp: number;
  hpCostPerKw: number;
  hpFullLoadHours: number;
  // property & capital
  constructionPerM2: number;
  rentPerM2Month: number;
  landLeaseYear: number;
  equipmentCapex: number;
  // labour & overheads
  laborHrs: number;
  wage: number;
  waterNut: number;
  distrib: number;
  maint: number;
  // finance
  deprYears: number;
  horizon: number;
  /**
   * Optional monthly heat opex (12-element array, €/month).
   * When provided, simulateMonthly uses per-month heat costs instead of
   * the flat annual heatDemand. Absent → existing behaviour unchanged.
   */
  monthlyHeatOpex?: number[];
}

export interface Toggles {
  solar: boolean;
  heatpump: boolean;
}

/**
 * The two mutually exclusive property scenarios:
 * lease = cheap land lease + you build the structure (construction CAPEX);
 * rent  = no construction CAPEX, but real monthly commercial rent.
 */
export type ScenarioKey = 'lease' | 'rent';

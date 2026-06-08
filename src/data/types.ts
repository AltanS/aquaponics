/**
 * Reference-data shapes (see HANDOFF.md §3).
 * These files are version-controlled, read-only at runtime — edit them to
 * update the model's defaults; never mutate them from code.
 * All monetary defaults are Berlin/Brandenburg 2026 point estimates.
 */

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface FishSpecies {
  label: string;
  type: 'Fish' | 'Crustacean';
  /** €/kg, direct-sale / restaurant channel */
  price: number;
  /** feed kg per kg live weight — BIOLOGICAL FCR (see HANDOFF.md §5.1) */
  fcr: number;
  /** €/kg produced — bought-in juveniles (the model does NOT breed) */
  stockCost: number;
  /** kg per market-size animal — used for per-unit breakdowns (fish/month) */
  marketWeightKg: number;
  /** grow-out to market size, months — first-revenue lag */
  growMonths: number;
  /** comfort water-temp band °C (min) — band midpoint sets the loop temperature */
  fcMin: number;
  /** comfort water-temp band °C (max) */
  fcMax: number;
  difficulty: Difficulty;
  notes: string;
}

export interface Crop {
  label: string;
  cat: 'Leafy' | 'Herb' | 'Microgreen' | 'Mixed';
  /** kg / m² / yr (named `yld` — "yield" is reserved-ish) */
  yld: number;
  /** €/kg, direct-sale */
  price: number;
  /** €/m²/yr */
  seedCost: number;
  /** kg per sellable unit (e.g. a head of lettuce) — enables per-unit breakdowns */
  unitWeightKg?: number;
  /** label for one sellable unit, e.g. "head" */
  unitLabel?: string;
  /** days to first harvest — revenue lag */
  cycleDays: number;
  /** preferred root-zone °C (min) → "good" pairing */
  cMin: number;
  /** preferred root-zone °C (max) */
  cMax: number;
  /** tolerable root-zone °C (min) → "workable" pairing */
  caMin: number;
  /** tolerable root-zone °C (max) */
  caMax: number;
  difficulty: Difficulty;
  notes: string;
}

export interface Scale {
  label: string;
  /** steady annual harvest, kg live */
  fishKg: number;
  /** m² */
  growArea: number;
  /** systems electricity kWh/yr (pumps/air/lights/controls) */
  sysKwh: number;
  /** base thermal demand kWh/yr — used in old heatFactor formula; kept for reference */
  baseHeat: number;
  /** default PV array size, kWp */
  pvKwp: number;
  /** total hours/week of labour */
  laborHrs: number;
  /** of which worked by the owner unpaid (opportunity cost, not cash); hired = laborHrs − ownerHrs */
  ownerHrs: number;
  /** €/yr */
  waterNut: number;
  /** €/yr */
  distrib: number;
  /** €/yr */
  maint: number;
  /** €, RAS/tanks/beds/pumps (both property scenarios) */
  equipmentCapex: number;
  /** €/m² build (lease scenario only) */
  constructionPerM2: number;
  /** €/yr (lease scenario) */
  landLeaseYear: number;
}

export interface EnergyDefaults {
  /** €/kg feed */
  feedPrice: number;
  /** heat-pump seasonal COP */
  cop: number;
  /** kWh/kWp/yr (Brandenburg) */
  pvYield: number;
  /** % of PV self-consumed */
  scRate: number;
  /** €/kWh import */
  gridPrice: number;
  /** €/kWh export (EEG feed-in) */
  feedIn: number;
  /** €/kWh thermal (heat pump OFF → gas boiler) */
  gasPrice: number;
  /** €/kWh self-used (PV O&M) */
  omSolar: number;
  /** € installed per kWp */
  pvCostPerKwp: number;
  /** €/kW thermal */
  hpCostPerKw: number;
  /** h/yr, for HP sizing */
  hpFullLoadHours: number;
}

export interface PropertyDefaults {
  /** €/m²/month (rent scenario) */
  rentPerM2Month: number;
}

export interface FinanceDefaults {
  /** €/h loaded */
  wage: number;
  deprYears: number;
  /** cash-flow chart/table horizon */
  horizonYears: number;
}

/**
 * Attribution assumptions for per-enterprise (fish vs plants) breakdowns —
 * sourced from data/model.yaml. Coarse planning shares, not measurements.
 */
/** The cost base a subsidy's rate applies to. */
export type SubsidyBasis = 'construction' | 'equipment' | 'eligibleCapex' | 'heatpump' | 'pv' | 'totalCapex';

/**
 * A one-off capital grant (not a loan), with the eligibility gates that decide
 * whether a given scenario can claim it. Sourced from data/subsidies.yaml.
 */
export interface Subsidy {
  label: string;
  description: string;
  /** fraction of the eligible cost base (0–1) */
  rate: number;
  /** which CAPEX component the rate applies to */
  basis: SubsidyBasis;
  /** € cap on the eligible cost base */
  capEligible?: number;
  /** € cap on the grant amount itself */
  capGrant?: number;
  /** excludes the hobby/DIY tier (needs a registered commercial enterprise) */
  commercialOnly?: boolean;
  /** only applies when a heat pump is installed */
  requiresHeatpump?: boolean;
  /** only applies when PV is installed */
  requiresSolar?: boolean;
  /** minimum total CAPEX (€) to qualify */
  minInvestment?: number;
  /** source URL */
  source: string;
  /** short human citation */
  sourceLabel?: string;
  /** caveat shown with the grant */
  note?: string;
}

export interface ModelAssumptions {
  /** share of weekly labour spent directly on fish husbandry (0–1) */
  laborShareFish: number;
  /** share spent directly on plant production (0–1); remainder = general, split by revenue */
  laborSharePlants: number;
  /** share of net energy cost attributed to the fish loop (0–1) */
  energyShareFish: number;
  /** productive plant canopy as a fraction of the heated footprint (0–1);
   * plant harvest/revenue/seed cost scale with canopy, build/heat/rent with footprint */
  cropAreaFraction: number;
}

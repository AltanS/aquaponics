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
  /** multiplier on a scale's base heat demand (removed in spec-03) */
  heatFactor: number;
  /** grow-out to market size, months — first-revenue lag */
  growMonths: number;
  /** comfort water-temp band °C (min) — band midpoint sets the loop temperature */
  fcMin: number;
  /** comfort water-temp band °C (max) */
  fcMax: number;
  /** display string, e.g. "25–28°C" — removed in spec-02 (derived in format.ts) */
  temp?: string;
  /** display string, e.g. "6–9 mo" — removed in spec-02 (derived in format.ts) */
  growout?: string;
  difficulty: Difficulty;
  notes: string;
}

export interface Crop {
  label: string;
  cat: 'Leafy' | 'Herb' | 'Microgreen';
  /** kg / m² / yr (named `yld` — "yield" is reserved-ish) */
  yld: number;
  /** €/kg, direct-sale */
  price: number;
  /** €/m²/yr */
  seedCost: number;
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
  /** display string, e.g. "15–22°C" — removed in spec-02 (derived in format.ts) */
  temp?: string;
  /** display string, e.g. "30–45 d" — removed in spec-02 (derived in format.ts) */
  cycle?: string;
  /** display string, e.g. "Raft (DWC)" — removed in spec-02 (derived in format.ts) */
  system?: string;
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
  /** base thermal demand kWh/yr (× fish.heatFactor) */
  baseHeat: number;
  /** default PV array size, kWp */
  pvKwp: number;
  /** hours/week */
  laborHrs: number;
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

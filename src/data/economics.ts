import type { EnergyDefaults, FinanceDefaults, PropertyDefaults } from './types';

/**
 * Global economic constants — Berlin/Brandenburg, 2026 figures.
 * Provenance: HANDOFF.md §7 (BDEW/Bundesnetzagentur grid prices, Fraunhofer ISE
 * PV cost, EEG 2026 feed-in, Amt für Statistik Berlin-Brandenburg land lease,
 * statutory minimum wage 2026). These drift — treat them as dated, not eternal.
 */
export const ENERGY: EnergyDefaults = {
  feedPrice: 1.6,
  cop: 3.0,
  pvYield: 950,
  scRate: 55,
  gridPrice: 0.25,
  feedIn: 0.07,
  gasPrice: 0.11,
  omSolar: 0.015,
  pvCostPerKwp: 1200,
  hpCostPerKw: 1100,
  hpFullLoadHours: 2000,
};

export const PROPERTY: PropertyDefaults = {
  rentPerM2Month: 4.5,
};

export const FINANCE: FinanceDefaults = {
  wage: 17,
  deprYears: 12,
  horizonYears: 15,
};

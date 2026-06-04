import type { Scale } from './types';

/**
 * Scale ladder: hobby → pilot → small → mid (HANDOFF.md §2.4).
 * Build standard (€/m²) and land lease travel with the scale —
 * commercial tiers use insulated-greenhouse rates, hobby uses a polytunnel.
 */
export const SCALES = {
  hobby: {
    label: 'Hobby / DIY',
    fishKg: 150, growArea: 40, sysKwh: 5000, baseHeat: 8000, pvKwp: 5, laborHrs: 8,
    waterNut: 300, distrib: 400, maint: 500,
    equipmentCapex: 9000, constructionPerM2: 90, landLeaseYear: 600,
  },
  pilot: {
    label: 'Commercial pilot',
    fishKg: 600, growArea: 100, sysKwh: 12000, baseHeat: 18000, pvKwp: 15, laborHrs: 15,
    waterNut: 800, distrib: 1500, maint: 1500,
    equipmentCapex: 35000, constructionPerM2: 350, landLeaseYear: 1500,
  },
  small: {
    label: 'Small commercial',
    fishKg: 3000, growArea: 400, sysKwh: 40000, baseHeat: 55000, pvKwp: 50, laborHrs: 30,
    waterNut: 2000, distrib: 3500, maint: 4000,
    equipmentCapex: 110000, constructionPerM2: 350, landLeaseYear: 3000,
  },
  mid: {
    label: 'Mid commercial',
    fishKg: 12000, growArea: 1500, sysKwh: 130000, baseHeat: 180000, pvKwp: 180, laborHrs: 80,
    waterNut: 7000, distrib: 14000, maint: 12000,
    equipmentCapex: 380000, constructionPerM2: 350, landLeaseYear: 8000,
  },
} satisfies Record<string, Scale>;

export type ScaleId = keyof typeof SCALES;

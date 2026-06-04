import type { Crop } from './types';

/** Crop reference data — Berlin/Brandenburg 2026, direct-sale prices. */
export const CROPS = {
  greens_mix: {
    label: 'Mixed leafy greens', cat: 'Leafy', yld: 28, price: 4.5, seedCost: 9, cycleDays: 38,
    cMin: 14, cMax: 22, caMin: 8, caMax: 26,
    temp: '15–22°C', cycle: '30–45 d', system: 'Raft (DWC)', difficulty: 'Easy',
    notes: 'A forgiving staple blend with steady year-round turnover under supplementary light.',
  },
  lettuce_head: {
    label: 'Head lettuce', cat: 'Leafy', yld: 30, price: 4.0, seedCost: 8, cycleDays: 35,
    cMin: 13, cMax: 20, caMin: 8, caMax: 24,
    temp: '15–20°C', cycle: '30–40 d', system: 'Raft / NFT', difficulty: 'Easy',
    notes: 'The classic aquaponics crop; loves cool water and bolts in heat.',
  },
  lettuce_leaf: {
    label: 'Baby leaf', cat: 'Leafy', yld: 25, price: 6.0, seedCost: 10, cycleDays: 25,
    cMin: 13, cMax: 20, caMin: 8, caMax: 24,
    temp: '15–20°C', cycle: '21–30 d', system: 'Raft / NFT', difficulty: 'Easy',
    notes: 'Fast cut-and-come-again leaf with a high cycle count and good margins.',
  },
  rocket: {
    label: 'Rocket / Rucola', cat: 'Leafy', yld: 22, price: 11, seedCost: 9, cycleDays: 25,
    cMin: 12, cMax: 22, caMin: 6, caMax: 26,
    temp: '12–20°C', cycle: '21–30 d', system: 'Raft / NFT', difficulty: 'Easy',
    notes: 'Peppery, fast and premium-priced; several cuts per sowing.',
  },
  basil: {
    label: 'Basil', cat: 'Herb', yld: 18, price: 14, seedCost: 12, cycleDays: 40,
    cMin: 20, cMax: 28, caMin: 17, caMax: 31,
    temp: '20–26°C', cycle: '30–50 d', system: 'Raft / NFT', difficulty: 'Medium',
    notes: 'Top €/kg herb that loves warmth but is prone to cold damage and root rot.',
  },
  spinach: {
    label: 'Spinach', cat: 'Leafy', yld: 24, price: 7, seedCost: 8, cycleDays: 35,
    cMin: 10, cMax: 18, caMin: 5, caMax: 22,
    temp: '10–18°C', cycle: '30–40 d', system: 'Raft / Media', difficulty: 'Medium',
    notes: 'Cool-season crop that struggles and gets root disease in warm water.',
  },
  chard: {
    label: 'Swiss chard', cat: 'Leafy', yld: 30, price: 5, seedCost: 7, cycleDays: 48,
    cMin: 14, cMax: 24, caMin: 9, caMax: 28,
    temp: '15–24°C', cycle: '40–55 d', system: 'Media / Raft', difficulty: 'Easy',
    notes: 'Robust, high-biomass, with a long continuous harvest window.',
  },
  pakchoi: {
    label: 'Pak choi', cat: 'Leafy', yld: 28, price: 6, seedCost: 8, cycleDays: 38,
    cMin: 14, cMax: 22, caMin: 8, caMax: 26,
    temp: '15–22°C', cycle: '30–45 d', system: 'Raft / NFT', difficulty: 'Easy',
    notes: 'Fast Asian green with reliable restaurant demand.',
  },
  feldsalat: {
    label: "Lamb's lettuce", cat: 'Leafy', yld: 12, price: 13, seedCost: 10, cycleDays: 50,
    cMin: 8, cMax: 16, caMin: 4, caMax: 20,
    temp: '8–16°C', cycle: '40–60 d', system: 'Media / Raft', difficulty: 'Medium',
    notes: 'Cold-hardy winter premium — slow and low-yielding but high-priced.',
  },
  herbs: {
    label: 'Cutting herbs', cat: 'Herb', yld: 20, price: 12, seedCost: 12, cycleDays: 45,
    cMin: 16, cMax: 24, caMin: 12, caMax: 28,
    temp: '16–24°C', cycle: '30–60 d', system: 'Raft / NFT', difficulty: 'Medium',
    notes: 'Mint, parsley and coriander mix; high value with steady demand from chefs.',
  },
  microgreens: {
    label: 'Microgreens', cat: 'Microgreen', yld: 20, price: 40, seedCost: 25, cycleDays: 14,
    cMin: 18, cMax: 24, caMin: 15, caMax: 30,
    temp: '18–24°C', cycle: '7–21 d', system: 'Trays / Media', difficulty: 'Medium',
    notes: 'Extremely high €/kg and very fast cycles, but labour-heavy with a short shelf life.',
  },
} satisfies Record<string, Crop>;

export type CropId = keyof typeof CROPS;

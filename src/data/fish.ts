import type { FishSpecies } from './types';

/** Fish & crustacean reference data — Berlin/Brandenburg 2026, direct-sale prices. */
export const FISH = {
  catfish: {
    label: 'African catfish', type: 'Fish', price: 9, fcr: 1.1, stockCost: 0.8,
    heatFactor: 1.0, growMonths: 7, fcMin: 25, fcMax: 28,
    temp: '25–28°C', growout: '6–9 mo', difficulty: 'Easy',
    notes: 'Air-breathing and extremely hardy — tolerates high density and low oxygen. The classic aquaponics workhorse.',
  },
  tilapia: {
    label: 'Tilapia', type: 'Fish', price: 11, fcr: 1.4, stockCost: 1.0,
    heatFactor: 1.15, growMonths: 7, fcMin: 27, fcMax: 30,
    temp: '26–30°C', growout: '6–8 mo', difficulty: 'Easy',
    notes: 'Fast and robust, but needs warm water year-round — expensive to hold through a Brandenburg winter.',
  },
  trout: {
    label: 'Trout', type: 'Fish', price: 14, fcr: 1.1, stockCost: 1.2,
    heatFactor: 0.6, growMonths: 14, fcMin: 12, fcMax: 16,
    temp: '10–16°C', growout: '12–16 mo', difficulty: 'Medium',
    notes: 'Premium cold-water fish — little heating, but demands high dissolved oxygen and clean, cool water.',
  },
  carp: {
    label: 'Carp', type: 'Fish', price: 7, fcr: 1.5, stockCost: 0.6,
    heatFactor: 0.7, growMonths: 18, fcMin: 20, fcMax: 24,
    temp: '18–25°C', growout: '12–24 mo', difficulty: 'Easy',
    notes: 'Very hardy and cheap to stock, but low value and slow to size. Traditional German festive fish.',
  },
  perch: {
    label: 'European perch', type: 'Fish', price: 16, fcr: 1.4, stockCost: 1.8,
    heatFactor: 0.85, growMonths: 15, fcMin: 21, fcMax: 24,
    temp: '20–25°C', growout: '12–18 mo', difficulty: 'Medium',
    notes: 'Good value and a growing RAS species in Europe; steady restaurant demand, fussier than catfish.',
  },
  pikeperch: {
    label: 'Pikeperch (Zander)', type: 'Fish', price: 22, fcr: 1.3, stockCost: 2.5,
    heatFactor: 0.9, growMonths: 20, fcMin: 22, fcMax: 25,
    temp: '22–26°C', growout: '16–24 mo', difficulty: 'Hard',
    notes: 'Top of the German freshwater market, prized in gastronomy. Demanding — sensitive fry, exacting water.',
  },
  archar: {
    label: 'Arctic char', type: 'Fish', price: 17, fcr: 1.1, stockCost: 1.5,
    heatFactor: 0.55, growMonths: 16, fcMin: 10, fcMax: 14,
    temp: '8–15°C', growout: '14–18 mo', difficulty: 'Medium',
    notes: 'Premium cold-water salmonid needing even less heating than trout. Strong direct-sale and chef appeal.',
  },
  sturgeon: {
    label: 'Sturgeon', type: 'Fish', price: 14, fcr: 1.2, stockCost: 3.0,
    heatFactor: 0.7, growMonths: 24, fcMin: 16, fcMax: 20,
    temp: '15–22°C', growout: 'meat 18–30 mo', difficulty: 'Hard',
    notes: 'Meat plus long-term caviar potential. High stock cost and a very long horizon — a patient niche play.',
  },
  redclaw: {
    label: 'Redclaw crayfish', type: 'Crustacean', price: 25, fcr: 1.6, stockCost: 3.0,
    heatFactor: 1.2, growMonths: 10, fcMin: 25, fcMax: 28,
    temp: '24–30°C', growout: '9–12 mo', difficulty: 'Medium',
    notes: 'Tropical crayfish well-suited to aquaponics — warm water plus hiding structure, no migration needs.',
  },
  prawn: {
    label: 'Giant river prawn', type: 'Crustacean', price: 28, fcr: 2.0, stockCost: 3.5,
    heatFactor: 1.25, growMonths: 7, fcMin: 27, fcMax: 30,
    temp: '26–30°C', growout: '6–8 mo', difficulty: 'Hard',
    notes: 'High value but cannibalistic and warmth-hungry — heating-intensive, lower density, careful management.',
  },
  noblecray: {
    label: 'Noble crayfish (Edelkrebs)', type: 'Crustacean', price: 35, fcr: 1.8, stockCost: 4.0,
    heatFactor: 0.65, growMonths: 30, fcMin: 16, fcMax: 19,
    temp: '15–20°C', growout: '2–3 yr', difficulty: 'Hard',
    notes: 'Native, very high value, but slow-growing and protection-regulated. A long-horizon premium niche.',
  },
} satisfies Record<string, FishSpecies>;

export type FishId = keyof typeof FISH;

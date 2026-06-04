import type { Crop, FishSpecies } from '../data/types';

/**
 * good     — loop temp within the crop's preferred root-zone range
 * work     — within the tolerable range (a workable compromise)
 * poor     — outside both; NOT impossible — it implies a decoupled design
 *            with separate water loops (legitimate but costlier).
 */
export type PairClass = 'good' | 'work' | 'poor';

export interface Pairing {
  cls: PairClass;
  /** shared-loop temperature °C (fish comfort-band midpoint) */
  loop: number;
  /** which way the loop misses the crop's preferred range */
  dir: 'warm' | 'cool' | '';
}

/** In a coupled loop the fish set the temperature: comfort-band midpoint. */
export function loopTemp(fish: FishSpecies): number {
  return (fish.fcMin + fish.fcMax) / 2;
}

/** Rate a fish↔crop pairing by whether the loop temp fits the crop's root zone. */
export function pairFishPlant(fish: FishSpecies, crop: Crop): Pairing {
  const lt = loopTemp(fish);
  const cls: PairClass =
    lt >= crop.cMin && lt <= crop.cMax ? 'good'
    : lt >= crop.caMin && lt <= crop.caMax ? 'work'
    : 'poor';
  const dir = lt > crop.cMax ? 'warm' : lt < crop.cMin ? 'cool' : '';
  return { cls, loop: lt, dir };
}

import type { CropId, FishId, ScaleId } from '../data';
import type { ScenarioKey } from '../core';

/** Available region IDs */
export type RegionId = 'berlin-brandon';

export interface AppState {
  scale: ScaleId;
  species: FishId;
  crop: CropId;
  solar: boolean;
  heatpump: boolean;
  /** which scenario the year table & breakdown follow */
  focus: ScenarioKey;
  /** active region (defaults to Berlin/Brandenburg) */
  region: RegionId;
}

export const state: AppState = {
  scale: 'small',
  species: 'catfish',
  crop: 'greens_mix',
  solar: true,
  heatpump: true,
  focus: 'lease',
  region: 'berlin-brandon',
};

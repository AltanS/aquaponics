import type { CropId, FishId, ScaleId } from '../data';
import type { ScenarioKey } from '../core';

/** Available region IDs */
export type RegionId = 'berlin-brandenburg';

/** Main content tabs — sticky header stays visible while tabbing around. */
export type TabId = 'results' | 'setup' | 'fish' | 'plants' | 'energy';
export const TAB_IDS: readonly TabId[] = ['results', 'setup', 'fish', 'plants', 'energy'];

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
  /** active main tab */
  tab: TabId;
}

export const state: AppState = {
  scale: 'small',
  species: 'catfish',
  crop: 'greens_mix',
  solar: true,
  heatpump: true,
  focus: 'lease',
  region: 'berlin-brandenburg',
  tab: 'results',
};

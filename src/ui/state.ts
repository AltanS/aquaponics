import type { CropId, FishId, RegionId, ScaleId } from '../data';
import type { ScenarioKey } from '../core';

/** Region IDs come from the data layer (one per data/regions/*.yaml). */
export type { RegionId };

/** Main content tabs — sticky header stays visible while tabbing around.
 * Fish & plants share one "production" pane: in a coupled system they are
 * inseparable, so they're tuned and compared side by side. */
export type TabId = 'results' | 'setup' | 'production' | 'energy' | 'subsidies';
export const TAB_IDS: readonly TabId[] = ['results', 'setup', 'production', 'energy', 'subsidies'];

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

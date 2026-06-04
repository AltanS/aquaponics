export type { CalcInputs, ScenarioKey, Toggles } from './types';
export { computeEnergy, energyCapex, type EnergyCapex, type EnergyResult } from './energy';
export { computeScenario, type ScenarioResult } from './scenario';
export {
  simulateMonthly,
  yearRows,
  type RampLags,
  type RampScenario,
  type RampSeries,
  type SeriesPoint,
  type YearRow,
} from './simulate';
export { loopTemp, pairFishPlant, type PairClass, type Pairing } from './pairing';
export { cropValue, fishValue, indexScore } from './indices';

/**
 * Berlin/Brandenburg region defaults — shared across derive, UI, and tests.
 * Sourced from: DWD Potsdam station 30-year normals; zod-validated in build-data.ts.
 *
 * Extract kept here (not in generated.ts) so the UI can import before code-split;
 * generated.ts has the full region YAML data for reference.
 */

export const BERLIN_REGION = {
  annualMeanAmbientC: 10.075, // mean([0.3,1.2,5.2,9.7,15.1,18.2,20.1,19.8,15.3,9.8,4.7,1.5])
  monthlyAmbientC: [0.3, 1.2, 5.2, 9.7, 15.1, 18.2, 20.1, 19.8, 15.3, 9.8, 4.7, 1.5] as const,
} as const;

export const BERLIN_ENCLOSURE = {
  heatLossFactor: 0.35,
} as const;

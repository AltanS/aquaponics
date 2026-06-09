#!/usr/bin/env tsx
/**
 * build-data.ts — Parse YAML reference data, validate with zod, emit src/data/generated.ts
 *
 * Usage:
 *   pnpm run build:data
 *   node --experimental-strip-types --no-warnings scripts/build-data.ts
 *
 * Design decisions (settled in counsel gate):
 * - generated.ts is checked in; no pretest codegen needed (vitest imports it directly)
 * - pure generate(dataDir) function for testability from any cwd
 * - deterministic sorted output; byte-reproducible artifact
 * - line endings normalized to \n
 * - no zod imports in generated.ts (zero runtime deps)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod/v4';

// ── Zod schemas ────────────────────────────────────────────────────────────────

const Difficulty = z.enum(['Easy', 'Medium', 'Hard']);

const FishSpeciesSchema = z.object({
  label: z.string(),
  wiki: z.string().url(),
  type: z.enum(['Fish', 'Crustacean']),
  price: z.number({ error: 'price must be a number in €/kg' }),
  fcr: z.number({ error: 'fcr must be a number in kg/kg' }),
  stockCost: z.number({ error: 'stockCost must be a number in €/kg' }),
  marketWeightKg: z.number({ error: 'marketWeightKg must be a number in kg per market-size animal' }).positive(),
  growMonths: z.number({ error: 'growMonths must be a number in months' }),
  fcMin: z.number({ error: 'fcMin must be a number in °C' }),
  fcMax: z.number({ error: 'fcMax must be a number in °C' }),
  difficulty: Difficulty,
  notes: z.string(),
});

const CropSchema = z.object({
  label: z.string(),
  wiki: z.string().url(),
  cat: z.enum(['Leafy', 'Herb', 'Microgreen', 'Mixed']),
  yld: z.number({ error: 'yld must be a number in kg/m²/yr' }),
  price: z.number({ error: 'price must be a number in €/kg' }),
  seedCost: z.number({ error: 'seedCost must be a number in €/m²/yr' }),
  unitWeightKg: z.number({ error: 'unitWeightKg must be a number in kg per sellable unit' }).positive().optional(),
  unitLabel: z.string().optional(),
  cycleDays: z.number({ error: 'cycleDays must be a number in days' }),
  cMin: z.number({ error: 'cMin must be a number in °C' }),
  cMax: z.number({ error: 'cMax must be a number in °C' }),
  caMin: z.number({ error: 'caMin must be a number in °C' }),
  caMax: z.number({ error: 'caMax must be a number in °C' }),
  difficulty: Difficulty,
  notes: z.string(),
});

const ScaleSchema = z.object({
  label: z.string(),
  fishKg: z.number({ error: 'fishKg must be a number in kg/yr' }),
  growArea: z.number({ error: 'growArea must be a number in m²' }),
  sysKwh: z.number({ error: 'sysKwh must be a number in kWh/yr' }),
  baseHeat: z.number({ error: 'baseHeat must be a number in kWh/yr' }),
  pvKwp: z.number({ error: 'pvKwp must be a number in kWp' }),
  laborHrs: z.number({ error: 'laborHrs must be a number in h/week' }),
  ownerHrs: z.number({ error: 'ownerHrs must be a number in h/week' }).min(0),
  waterNut: z.number({ error: 'waterNut must be a number in €/yr' }),
  distrib: z.number({ error: 'distrib must be a number in €/yr' }),
  maint: z.number({ error: 'maint must be a number in €/yr' }),
  equipmentCapex: z.number({ error: 'equipmentCapex must be a number in €' }),
  constructionPerM2: z.number({ error: 'constructionPerM2 must be a number in €/m²' }),
  landLeaseYear: z.number({ error: 'landLeaseYear must be a number in €/yr' }),
});

const EconomicsSchema = z.object({
  feedPrice: z.number(),
  cop: z.number(),
  pvYield: z.number(),
  scRate: z.number(),
  gridPrice: z.number(),
  feedIn: z.number(),
  gasPrice: z.number(),
  omSolar: z.number(),
  pvCostPerKwp: z.number(),
  hpCostPerKw: z.number(),
  hpFullLoadHours: z.number(),
  rentPerM2Month: z.number(),
  wage: z.number(),
  deprYears: z.number(),
  horizonYears: z.number(),
  fishPrices: z.record(z.string(), z.number()),
  cropPrices: z.record(z.string(), z.number()),
});

const ModelSchema = z
  .object({
    laborShareFish: z.number({ error: 'laborShareFish must be a share 0–1' }).min(0).max(1),
    laborSharePlants: z.number({ error: 'laborSharePlants must be a share 0–1' }).min(0).max(1),
    energyShareFish: z.number({ error: 'energyShareFish must be a share 0–1' }).min(0).max(1),
    cropAreaFraction: z.number({ error: 'cropAreaFraction must be a fraction 0–1' }).gt(0).max(1),
  })
  .refine((m) => m.laborShareFish + m.laborSharePlants <= 1, {
    message: 'laborShareFish + laborSharePlants must not exceed 1 (remainder = general labour)',
  });

const RegionMetaSchema = z.object({
  region: z.string(),
  label: z.string(),
  lastUpdated: z.string(),
  schemaVersion: z.string().optional(),
  notes: z.string().optional(),
});

const ClimateSchema = z.object({
  climateZone: z.string(),
  monthlyAmbientC: z.array(z.number()).length(12, { error: 'monthlyAmbientC must list 12 months' }),
  supplementalLight: z.array(z.boolean()).length(12, { error: 'supplementalLight must list 12 months' }),
});

const EnclosureSchema = z.object({
  type: z.string(),
  heatLossFactor: z.number({ error: 'heatLossFactor must be a number (W/m²/°C)' }).positive(),
});

const SubsidySchema = z.object({
  label: z.string(),
  description: z.string(),
  rate: z.number({ error: 'rate must be a fraction 0–1' }).gt(0).max(1),
  basis: z.enum(['construction', 'equipment', 'eligibleCapex', 'heatpump', 'pv', 'totalCapex']),
  capEligible: z.number().positive().optional(),
  capGrant: z.number().positive().optional(),
  commercialOnly: z.boolean().optional(),
  requiresHeatpump: z.boolean().optional(),
  requiresSolar: z.boolean().optional(),
  minInvestment: z.number().nonnegative().optional(),
  source: z.string().url(),
  sourceLabel: z.string().optional(),
  note: z.string().optional(),
});

const IdPattern = /^[a-z][a-z0-9_]*$/;

function validateId(id: string, file: string): void {
  if (!IdPattern.test(id)) {
    throw new Error(`${file} → entity key "${id}" must match ^[a-z][a-z0-9_]*$`);
  }
}

function parseAndValidateFile<T>(
  filePath: string,
  fileName: string,
  entitySchema: z.ZodType<T>,
): Record<string, T> {
  const raw = readFileSync(filePath, 'utf-8');
  const parsed = parseYaml(raw) as { entities?: Record<string, unknown> };

  if (!parsed || typeof parsed !== 'object' || !parsed.entities) {
    throw new Error(`${fileName} → missing "entities:" map`);
  }

  const result: Record<string, T> = {};
  for (const [id, value] of Object.entries(parsed.entities)) {
    validateId(id, fileName);
    const validation = entitySchema.safeParse(value);
    if (!validation.success) {
      const issues = validation.error.issues
        .map((i) => `  ${i.path.join('.')}: ${i.message}`)
        .join('\n');
      throw new Error(`${fileName}/${id} validation failed:\n${issues}`);
    }
    result[id] = validation.data;
  }
  return result;
}

interface ParsedRegion {
  meta: z.infer<typeof RegionMetaSchema>;
  climate: z.infer<typeof ClimateSchema>;
  enclosure: z.infer<typeof EnclosureSchema>;
  economics: z.infer<typeof EconomicsSchema>;
}

/** Validate one block of the region file and throw a contextual error on failure. */
function parseBlock<T>(schema: z.ZodType<T>, value: unknown, block: string): T {
  const validation = schema.safeParse(value);
  if (!validation.success) {
    const issues = validation.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`berlin-brandenburg.yaml/${block} validation failed:\n${issues}`);
  }
  return validation.data;
}

function parseRegionFile(filePath: string): ParsedRegion {
  const raw = readFileSync(filePath, 'utf-8');
  const parsed = parseYaml(raw) as { meta?: unknown; climate?: unknown; enclosure?: unknown; economics?: unknown };

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('berlin-brandenburg.yaml → not an object');
  }
  for (const block of ['meta', 'climate', 'enclosure', 'economics'] as const) {
    if (!parsed[block]) throw new Error(`berlin-brandenburg.yaml → missing "${block}:" block`);
  }

  return {
    meta: parseBlock(RegionMetaSchema, parsed.meta, 'meta'),
    climate: parseBlock(ClimateSchema, parsed.climate, 'climate'),
    enclosure: parseBlock(EnclosureSchema, parsed.enclosure, 'enclosure'),
    economics: parseBlock(EconomicsSchema, parsed.economics, 'economics'),
  };
}

// ── Codegen ────────────────────────────────────────────────────────────────────

function toTsLiteral(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent);
  const innerPad = '  '.repeat(indent + 1);

  if (value === null || value === undefined) return 'undefined';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => toTsLiteral(v, indent + 1)).join(', ');
    return `[${items}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${innerPad}${k}: ${toTsLiteral(v, indent + 1)}`)
      .join(',\n');
    return `{\n${entries},\n${pad}}`;
  }

  return String(value);
}

function buildEntityBlock<T extends object>(
  constName: string,
  typeParam: string,
  entities: Record<string, T>,
): string {
  // Preserve YAML authoring order — it is intentional (e.g. the scale ladder
  // hobby → pilot → small → mid) and deterministic, since the YAML file is the
  // source of truth. Do NOT sort alphabetically: that scrambles the UI tabs.
  const entries = Object.keys(entities)
    .map((key) => `  ${key}: ${toTsLiteral(entities[key], 1)},`)
    .join('\n');
  return `export const ${constName} = {\n${entries}\n} as const satisfies Record<string, ${typeParam}>;\n`;
}

/**
 * Pure generate function — accepts dataDir so it works from any cwd.
 * The dataDir should contain fish.yaml, crops.yaml, scales.yaml, and regions/berlin-brandenburg.yaml.
 */
export function generate(dataDir: string): string {
  const fish = parseAndValidateFile(
    join(dataDir, 'fish.yaml'),
    'fish/yaml',
    FishSpeciesSchema,
  );
  const crops = parseAndValidateFile(
    join(dataDir, 'crops.yaml'),
    'crops/yaml',
    CropSchema,
  );
  const scales = parseAndValidateFile(
    join(dataDir, 'scales.yaml'),
    'scales/yaml',
    ScaleSchema,
  );
  const subsidies = parseAndValidateFile(
    join(dataDir, 'subsidies.yaml'),
    'subsidies/yaml',
    SubsidySchema,
  );
  const region = parseRegionFile(join(dataDir, 'regions/berlin-brandenburg.yaml'));
  const economics = region.economics;

  // Annual mean ambient is derived from the monthly climate array — not a
  // separately-maintained constant — so the two can never drift apart.
  const monthly = region.climate.monthlyAmbientC;
  const annualMeanAmbientC = Math.round((monthly.reduce((a, b) => a + b, 0) / monthly.length) * 1e4) / 1e4;
  const REGION = {
    id: region.meta.region,
    label: region.meta.label,
    dataVintage: region.meta.lastUpdated,
    climateZone: region.climate.climateZone,
    annualMeanAmbientC,
    monthlyAmbientC: monthly,
    supplementalLight: region.climate.supplementalLight,
    enclosure: { type: region.enclosure.type, heatLossFactor: region.enclosure.heatLossFactor },
  };

  const modelRaw = parseYaml(readFileSync(join(dataDir, 'model.yaml'), 'utf-8')) as { model?: unknown };
  if (!modelRaw || typeof modelRaw !== 'object' || !modelRaw.model) {
    throw new Error('model.yaml → missing "model:" block');
  }
  const modelValidation = ModelSchema.safeParse(modelRaw.model);
  if (!modelValidation.success) {
    const issues = modelValidation.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`model.yaml/model validation failed:\n${issues}`);
  }
  const model = modelValidation.data;

  const fishIds = Object.keys(fish);
  const cropIds = Object.keys(crops);
  const scaleIds = Object.keys(scales);

  const { fishPrices: _fp, cropPrices: _cp, rentPerM2Month, wage, deprYears, horizonYears, ...energyFields } = economics;

  const energy = energyFields;
  const property = { rentPerM2Month };
  const finance = { wage, deprYears, horizonYears };

  const lines: string[] = [
    '// AUTO-GENERATED — do not edit by hand.',
    '// Run `pnpm run build:data` to regenerate from /data/*.yaml',
    '// run `pnpm run build:data` and commit the result',
    '//',
    '// Zero runtime dependencies — zod and yaml are devDeps only.',
    '',
    "import type { Crop, EnergyDefaults, FinanceDefaults, FishSpecies, ModelAssumptions, PropertyDefaults, Region, Scale, Subsidy } from './types';",
    '',
    buildEntityBlock('FISH', 'FishSpecies', fish),
    `export type FishId = ${fishIds.map((id) => JSON.stringify(id)).join(' | ')};`,
    '',
    buildEntityBlock('CROPS', 'Crop', crops),
    `export type CropId = ${cropIds.map((id) => JSON.stringify(id)).join(' | ')};`,
    '',
    buildEntityBlock('SCALES', 'Scale', scales),
    `export type ScaleId = ${scaleIds.map((id) => JSON.stringify(id)).join(' | ')};`,
    '',
    `export const ENERGY: EnergyDefaults = ${toTsLiteral(energy)};`,
    '',
    `export const PROPERTY: PropertyDefaults = ${toTsLiteral(property)};`,
    '',
    `export const FINANCE: FinanceDefaults = ${toTsLiteral(finance)};`,
    '',
    `export const MODEL: ModelAssumptions = ${toTsLiteral(model)};`,
    '',
    `export const REGION: Region = ${toTsLiteral(REGION)};`,
    '',
    buildEntityBlock('SUBSIDIES', 'Subsidy', subsidies),
    '',
  ];

  // Normalize line endings to \n
  return lines.join('\n').replace(/\r\n/g, '\n');
}

// ── CLI entry point ────────────────────────────────────────────────────────────

if (import.meta.url === `file://${process.argv[1]}`) {
  const dataDir = resolve(
    new URL('..', import.meta.url).pathname,
    'data',
  );
  const outputPath = resolve(
    new URL('..', import.meta.url).pathname,
    'src/data/generated.ts',
  );

  try {
    const content = generate(dataDir);
    writeFileSync(outputPath, content, 'utf-8');
    console.log(`✓ src/data/generated.ts written (${content.length} bytes)`);
  } catch (err) {
    console.error('build-data failed:', (err as Error).message);
    process.exit(1);
  }
}

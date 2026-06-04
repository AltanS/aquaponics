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
  type: z.enum(['Fish', 'Crustacean']),
  price: z.number({ error: 'price must be a number in €/kg' }),
  fcr: z.number({ error: 'fcr must be a number in kg/kg' }),
  stockCost: z.number({ error: 'stockCost must be a number in €/kg' }),
  growMonths: z.number({ error: 'growMonths must be a number in months' }),
  fcMin: z.number({ error: 'fcMin must be a number in °C' }),
  fcMax: z.number({ error: 'fcMax must be a number in °C' }),
  difficulty: Difficulty,
  notes: z.string(),
});

const CropSchema = z.object({
  label: z.string(),
  cat: z.enum(['Leafy', 'Herb', 'Microgreen']),
  yld: z.number({ error: 'yld must be a number in kg/m²/yr' }),
  price: z.number({ error: 'price must be a number in €/kg' }),
  seedCost: z.number({ error: 'seedCost must be a number in €/m²/yr' }),
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

function parseRegionFile(filePath: string): z.infer<typeof EconomicsSchema> {
  const raw = readFileSync(filePath, 'utf-8');
  const parsed = parseYaml(raw) as { economics?: unknown };

  if (!parsed || typeof parsed !== 'object' || !parsed.economics) {
    throw new Error(`berlin-brandenburg.yaml → missing "economics:" block`);
  }

  const validation = EconomicsSchema.safeParse(parsed.economics);
  if (!validation.success) {
    const issues = validation.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`berlin-brandenburg.yaml/economics validation failed:\n${issues}`);
  }
  return validation.data;
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
  const sortedKeys = Object.keys(entities).sort();
  const entries = sortedKeys
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
  const economics = parseRegionFile(join(dataDir, 'regions/berlin-brandenburg.yaml'));

  const fishIds = Object.keys(fish).sort();
  const cropIds = Object.keys(crops).sort();
  const scaleIds = Object.keys(scales).sort();

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
    "import type { Crop, EnergyDefaults, FinanceDefaults, FishSpecies, PropertyDefaults, Scale } from './types';",
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

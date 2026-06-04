/**
 * Schema test — re-validates all YAML files using the build-data generate() function.
 * A bad YAML edit will fail CI here before anything else runs.
 *
 * Design note: we call generate(dataDir) directly (pure function) rather than
 * spawning a subprocess, so the test runs fast and works from any cwd.
 */
import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { generate } from '../scripts/build-data';

const DATA_DIR = resolve(import.meta.dirname ?? new URL('.', import.meta.url).pathname, '../data');

describe('YAML schema validation', () => {
  it('generate() succeeds and returns non-empty output', () => {
    const result = generate(DATA_DIR);
    expect(result.length).toBeGreaterThan(100);
  });

  it('generated output contains all expected exports', () => {
    const result = generate(DATA_DIR);
    expect(result).toContain('export const FISH');
    expect(result).toContain('export const CROPS');
    expect(result).toContain('export const SCALES');
    expect(result).toContain('export const ENERGY');
    expect(result).toContain('export const PROPERTY');
    expect(result).toContain('export const FINANCE');
    expect(result).toContain('export type FishId');
    expect(result).toContain('export type CropId');
    expect(result).toContain('export type ScaleId');
  });

  it('generated output has all 11 fish species', () => {
    const result = generate(DATA_DIR);
    const fishIds = ['archar', 'carp', 'catfish', 'noblecray', 'perch', 'pikeperch', 'prawn', 'redclaw', 'sturgeon', 'tilapia', 'trout'];
    for (const id of fishIds) {
      expect(result).toContain(id);
    }
  });

  it('generated output has all 11 crops', () => {
    const result = generate(DATA_DIR);
    const cropIds = ['basil', 'chard', 'feldsalat', 'greens_mix', 'herbs', 'lettuce_head', 'lettuce_leaf', 'microgreens', 'pakchoi', 'rocket', 'spinach'];
    for (const id of cropIds) {
      expect(result).toContain(id);
    }
  });

  it('generated output has all 4 scales', () => {
    const result = generate(DATA_DIR);
    for (const id of ['hobby', 'mid', 'pilot', 'small']) {
      expect(result).toContain(id);
    }
  });

  it('generated output normalizes line endings to \\n only', () => {
    const result = generate(DATA_DIR);
    expect(result).not.toContain('\r\n');
  });

  it('generated output has no zod imports (zero runtime deps)', () => {
    const result = generate(DATA_DIR);
    // The generated file should not import zod
    expect(result).not.toContain("from 'zod'");
    expect(result).not.toContain('from "zod"');
  });
});

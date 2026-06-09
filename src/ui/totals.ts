import { CROPS, FISH, MODEL, type Crop } from '../data';
import {
  enterpriseContribution,
  loopTemp,
  pairFishPlant,
  type CalcInputs,
  type EnergyResult,
  type EnterpriseTotals,
} from '../core';
import { el } from './dom';
import { eur } from './format';
import type { AppState } from './state';

const nf = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });

function kg(v: number): string {
  return `${nf.format(Math.round(v))} kg`;
}

/** A signed money cell: positive cost values render as a deduction (−€…). */
function money(v: number, deduct = false): string {
  if (deduct && v > 0) return `−${eur(v)}`;
  return eur(v);
}

// ── Merged fish/plants comparison table ─────────────────────────────────────

type Cell = string;
interface Trow {
  label: string;
  fish: Cell;
  plant: Cell;
  both: Cell;
  cls?: 'cp' | 'cn' | '';
  bold?: boolean;
  /** render a thin divider above this row */
  sep?: boolean;
}

function signClass(v: number): 'cp' | 'cn' {
  return v >= 0 ? 'cp' : 'cn';
}

function prodTable(rows: Trow[]): string {
  let h =
    '<table class="tt tt3"><thead><tr>' +
    '<th></th>' +
    '<th><span class="hdot" style="background:var(--teal)"></span>Fish</th>' +
    '<th><span class="hdot" style="background:var(--blue)"></span>Plants</th>' +
    '<th>Together</th>' +
    '</tr></thead><tbody>';
  for (const r of rows) {
    const td = (v: Cell): string => {
      const c = r.cls ? ` class="${r.cls}"` : '';
      return `<td${c}>${r.bold ? `<b>${v}</b>` : v}</td>`;
    };
    const lab = r.bold ? `<b>${r.label}</b>` : r.label;
    h += `<tr${r.sep ? ' class="sep"' : ''}><td>${lab}</td>${td(r.fish)}${td(r.plant)}${td(r.both)}</tr>`;
  }
  return h + '</tbody></table>';
}

function unitsCell(t: EnterpriseTotals, label: string | null): Cell {
  if (t.unitsPerYear === null || !label) return '—';
  return `${nf.format(Math.round(t.unitsPerYear))} ${label}`;
}

function perHourCell(t: EnterpriseTotals): Cell {
  return t.profitPerHour !== null ? eur(t.profitPerHour) : '—';
}

/** Render the merged fish/plant production table and the energy cost table. */
export function renderTotals(state: AppState, i: CalcInputs, E: EnergyResult): void {
  const fish = FISH[state.species];
  // Widen to the interface: optional fields (unitWeightKg/unitLabel) are absent
  // from the generated literal types of crops that don't define them.
  const crop: Crop = CROPS[state.crop];

  const c = enterpriseContribution(i, E.opex, MODEL, fish.marketWeightKg, crop.unitWeightKg ?? null);
  const F = c.fish;
  const P = c.plants;

  const fishUnit = `fish · ≈${nf1.format(fish.marketWeightKg)} kg`;
  const plantUnit = crop.unitLabel ? `${crop.unitLabel}s · ≈${nf1.format(crop.unitWeightKg ?? 0)} kg` : null;

  const bothKg = F.kgPerYear + P.kgPerYear;
  const bothRev = F.revenue + P.revenue;
  const bothDirect = F.direct + P.direct;
  const bothLabor = F.labor + P.labor;
  const bothEnergy = F.energy + P.energy;
  const bothProfit = F.profit + P.profit;
  const bothHours = F.laborHours + P.laborHours;
  const fEurKg = F.kgPerYear > 0 ? F.revenue / F.kgPerYear : 0;
  const pEurKg = P.kgPerYear > 0 ? P.revenue / P.kgPerYear : 0;
  const bEurKg = bothKg > 0 ? bothRev / bothKg : 0;
  const bPerHour = bothHours > 0 ? bothProfit / bothHours : null;

  const rows: Trow[] = [
    { label: 'Harvest / yr', fish: kg(F.kgPerYear), plant: kg(P.kgPerYear), both: kg(bothKg) },
    { label: 'Harvest / mo', fish: kg(F.kgPerYear / 12), plant: kg(P.kgPerYear / 12), both: kg(bothKg / 12) },
    { label: '≈ units / yr', fish: unitsCell(F, fishUnit), plant: unitsCell(P, plantUnit), both: '—' },

    { label: 'Revenue / yr', fish: money(F.revenue), plant: money(P.revenue), both: money(bothRev), sep: true },
    { label: '− Direct inputs', fish: money(F.direct, true), plant: money(P.direct, true), both: money(bothDirect, true) },
    {
      label: `− Labour (<span class="n">${Math.round(F.laborHours)}</span> / <span class="n">${Math.round(P.laborHours)}</span> h)`,
      fish: money(F.labor, true),
      plant: money(P.labor, true),
      both: money(bothLabor, true),
    },
    { label: '− Energy share', fish: money(F.energy, true), plant: money(P.energy, true), both: money(bothEnergy, true) },

    { label: 'Profit / yr', fish: money(F.profit), plant: money(P.profit), both: money(bothProfit), bold: true, cls: signClass(bothProfit), sep: true },
    { label: 'Profit / mo', fish: money(F.profit / 12), plant: money(P.profit / 12), both: money(bothProfit / 12), bold: true, cls: signClass(bothProfit) },

    { label: '€ / kg sold', fish: eur(fEurKg), plant: eur(pEurKg), both: eur(bEurKg), sep: true },
    {
      label: '€ / worked hour',
      fish: perHourCell(F),
      plant: perHourCell(P),
      both: bPerHour !== null ? eur(bPerHour) : '—',
      cls: bPerHour !== null && bPerHour < 0 ? 'cn' : '',
    },
  ];

  const generalShare = Math.max(0, 1 - MODEL.laborShareFish - MODEL.laborSharePlants);
  const pct = (v: number): string => `<span class="n">${Math.round(v * 100)}%</span>`;

  el('prod-totals').innerHTML =
    prodTable(rows) +
    `<p class="ttnote">Per-unit sizes from <code>data/fish.yaml</code> / <code>data/crops.yaml</code>. ` +
    `Labour split ${pct(MODEL.laborShareFish)} fish · ${pct(MODEL.laborSharePlants)} plants · ` +
    `${pct(generalShare)} general (by revenue); energy ${pct(MODEL.energyShareFish)} fish · ` +
    `${pct(1 - MODEL.energyShareFish)} plants — all in <code>data/model.yaml</code>. ` +
    `Excludes rent, other overheads &amp; depreciation (venture-level, see Results).</p>`;

  // ── Energy cost table (single enterprise, year/month) ─────────────────────
  let eh =
    '<table class="tt"><thead><tr><th></th><th>per year</th><th>per month</th></tr></thead><tbody>';
  const erow = (label: string, perYear: number, deduct = false, bold = false): string => {
    const fmt = (x: number): string => money(x, deduct);
    const cls = bold ? signClass(perYear) : '';
    const wrap = (s: string): string => (bold ? `<b>${s}</b>` : s);
    return `<tr><td>${wrap(label)}</td><td class="${cls}">${wrap(fmt(perYear))}</td><td class="${cls}">${wrap(fmt(perYear / 12))}</td></tr>`;
  };
  eh += erow('Grid import', E.gridCost, true);
  eh += erow('Solar O&M', E.omCost, true);
  eh += erow('Feed-in credit', -E.exportCredit);
  eh += erow('Gas boiler', E.gasCost, true);
  eh += erow('Net energy cost', E.opex, true, true);
  eh += '</tbody></table>';
  el('energy-totals').innerHTML =
    eh +
    `<p class="ttnote">Split ${pct(MODEL.energyShareFish)} to the fish loop · ${pct(1 - MODEL.energyShareFish)} to plants — see <code>data/model.yaml</code>.</p>`;
}

// ── Overview selection summary (sticky header) ──────────────────────────────

const PAIR_LABEL: Record<'good' | 'work' | 'poor', string> = {
  good: 'good pairing',
  work: 'workable pairing',
  poor: 'decoupled (poor pairing)',
};
const PAIR_DOT: Record<'good' | 'work' | 'poor', string> = {
  good: 'c-good',
  work: 'c-work',
  poor: 'c-poor',
};

/** Render the current fish × crop selection into the sticky overview. */
export function renderSelection(state: AppState): void {
  const fish = FISH[state.species];
  const crop = CROPS[state.crop];
  const lt = Math.round(loopTemp(fish));
  const p = pairFishPlant(fish, crop);
  el('selection').innerHTML =
    `<span class="selitem"><span class="dot" style="background:var(--teal)"></span>` +
    `<b>${fish.label}</b><small>loop ≈${lt}°C</small></span>` +
    `<span class="selx">+</span>` +
    `<span class="selitem"><span class="cdot ${PAIR_DOT[p.cls]}"></span>` +
    `<b>${crop.label}</b><small>${PAIR_LABEL[p.cls]}</small></span>`;
}

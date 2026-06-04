import { CROPS, FISH, MODEL, type Crop } from '../data';
import { enterpriseContribution, type CalcInputs, type EnergyResult, type EnterpriseTotals } from '../core';
import { el } from './dom';
import { eur } from './format';
import type { AppState } from './state';

const nf = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });

function kg(v: number): string {
  return `${nf.format(Math.round(v))} kg`;
}

type Row = [label: string, year: string, month: string, cls?: 'cp' | 'cn' | ''];

function table(rows: Row[]): string {
  let h = '<table class="tt"><thead><tr><th></th><th>per year</th><th>per month</th></tr></thead><tbody>';
  for (const [label, year, month, cls] of rows) {
    h += `<tr><td>${label}</td><td class="${cls ?? ''}">${year}</td><td class="${cls ?? ''}">${month}</td></tr>`;
  }
  return h + '</tbody></table>';
}

function moneyRow(label: string, perYear: number, sign: 1 | -1 = 1, bold = false): Row {
  const v = sign * perYear;
  const fmt = (x: number) => (sign === -1 && perYear > 0 ? `−${eur(Math.abs(x))}` : eur(x));
  const cls = bold ? (v >= 0 ? 'cp' : 'cn') : '';
  const wrap = (s: string) => (bold ? `<b>${s}</b>` : s);
  return [wrap(label), wrap(fmt(v)), wrap(fmt(v / 12)), cls];
}

function enterpriseTable(t: EnterpriseTotals, unitLabel: string | null, shareNote: string): string {
  const rows: Row[] = [
    ['Harvest', kg(t.kgPerYear), kg(t.kgPerYear / 12)],
  ];
  if (t.unitsPerYear !== null && unitLabel) {
    rows.push([`≈ ${unitLabel}`, nf.format(Math.round(t.unitsPerYear)), nf.format(Math.round(t.unitsPerYear / 12))]);
  }
  rows.push(
    moneyRow('Revenue', t.revenue),
    moneyRow('Direct inputs', t.direct, -1),
    moneyRow(`Labour (${shareNote})`, t.labor, -1),
    moneyRow('Energy share', t.energy, -1),
    moneyRow('Contribution profit', t.profit, 1, true),
  );
  let h = table(rows);
  const hrs = Math.round(t.laborHours);
  const perHour = t.profitPerHour !== null ? `${eur(t.profitPerHour)} per worked hour` : 'no labour attributed';
  h += `<p class="ttnote">≈ ${nf.format(hrs)} h/yr of work attributed → <b class="${t.profitPerHour !== null && t.profitPerHour >= 0 ? 'cp' : 'cn'}">${perHour}</b></p>`;
  return h;
}

/** Render the fish/plant enterprise totals and the energy cost table. */
export function renderTotals(state: AppState, i: CalcInputs, E: EnergyResult): void {
  const fish = FISH[state.species];
  // Widen to the interface: optional fields (unitWeightKg/unitLabel) are absent
  // from the generated literal types of crops that don't define them.
  const crop: Crop = CROPS[state.crop];

  const c = enterpriseContribution(
    i,
    E.opex,
    MODEL,
    fish.marketWeightKg,
    crop.unitWeightKg ?? null,
  );

  const generalShare = Math.max(0, 1 - MODEL.laborShareFish - MODEL.laborSharePlants);
  const pct = (v: number) => `${Math.round(v * 100)}%`;

  el('fish-totals').innerHTML = enterpriseTable(
    c.fish,
    `fish · ≈${String(fish.marketWeightKg).replace('.', ',')} kg each`,
    `${pct(MODEL.laborShareFish)} + general`,
  );
  el('plant-totals').innerHTML = enterpriseTable(
    c.plants,
    crop.unitLabel ? `${crop.unitLabel}s` : null,
    `${pct(MODEL.laborSharePlants)} + general`,
  );

  const energyRows: Row[] = [
    moneyRow('Grid import', E.gridCost, -1),
    moneyRow('Solar O&M', E.omCost, -1),
    moneyRow('Feed-in credit', E.exportCredit, 1),
    moneyRow('Gas boiler', E.gasCost, -1),
    moneyRow('Net energy cost', -E.opex, 1, true),
  ];
  el('energy-totals').innerHTML =
    table(energyRows) +
    `<p class="ttnote">Attribution: ${pct(MODEL.energyShareFish)} fish loop · ${pct(1 - MODEL.energyShareFish)} plants · general labour ${pct(generalShare)} split by revenue — assumptions in <code>data/model.yaml</code></p>`;
}

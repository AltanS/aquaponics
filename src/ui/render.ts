import { CROPS, FISH } from '../data';
import {
  computeScenario,
  cropValue,
  fishValue,
  indexScore,
  simulateMonthly,
  yearRows,
  type CalcInputs,
  type ScenarioResult,
  type Toggles,
} from '../core';
import { el } from './dom';
import { ct, eur, kwh } from './format';
import { INPUT_IDS, readInputs } from './inputs';
import { renderChart } from './chart';
import { renderSpark } from './spark';
import { renderTable } from './table';
import { renderPairs, updateCropDots } from './panels';
import { snapshot } from './persist';
import type { AppState } from './state';

/** Data-vintage banner text — always visible near results per spec-06. */
const VINTAGE_BANNER_TEXT = 'Berlin/Brandenburg figures, compiled 2026-06 — prices drift';

function beText(be: number | null, ebitda: number, horizon: number): string {
  if (be !== null) return `${be.toFixed(1)} yr`;
  return ebitda > 0 ? `> ${horizon} yr` : 'never';
}

function setScenarioCard(prefix: 'L' | 'R', s: ScenarioResult, be: number | null, horizon: number): void {
  el(`${prefix}-capex`).textContent = eur(s.capex);
  el(`${prefix}-con`).textContent = eur(s.construction);
  el(`${prefix}-eq`).textContent = eur(s.energyCapex);
  el(`${prefix}-rent`).textContent = eur(s.rent);
  const ebitda = el(`${prefix}-ebitda`);
  ebitda.textContent = eur(s.ebitda);
  ebitda.style.color = s.ebitda >= 0 ? 'var(--good)' : 'var(--bad)';
  const net = el(`${prefix}-net`);
  net.textContent = eur(s.net);
  net.style.color = s.net >= 0 ? 'var(--good)' : 'var(--bad)';
  el(`${prefix}-be`).textContent = beText(be, s.ebitda, horizon);
}

/** Distribute segment widths of a stacked bar proportionally to their values. */
function setBarWidths(parts: { id: string; v: number }[]): void {
  const total = parts.reduce((a, p) => a + Math.max(0, p.v), 0);
  for (const p of parts) {
    el(p.id).style.width = `${total > 0 ? (Math.max(0, p.v) / total) * 100 : 0}%`;
  }
}

function renderCompare(L: ScenarioResult, R: ScenarioResult): void {
  const grp = (title: string, leaseVal: number, rentVal: number) => {
    const mx = Math.max(Math.abs(leaseVal), Math.abs(rentVal), 1);
    const bar = (tag: string, val: number, col: string) =>
      `<div class="b"><span class="tag">${tag}</span><span class="bar" style="width:${(Math.abs(val) / mx) * 100}%;background:${col}"></span><span class="num">${eur(val)}</span></div>`;
    return `<div class="grp"><div class="gl">${title}</div>${bar('Lease', leaseVal, 'var(--teal)')}${bar('Rent', rentVal, 'var(--blue)')}</div>`;
  };
  el('cmp').innerHTML =
    grp('Upfront investment', L.capex, R.capex) + grp('Steady profit / yr', L.ebitda, R.ebitda);
}

function renderIndices(i: CalcInputs): void {
  const cropVals = Object.values(CROPS).map((c) => cropValue(c.yld, c.price));
  const fishVals = Object.values(FISH).map((f) => fishValue(f.price, f.fcr, i.feedPrice, f.stockCost));
  const cv = cropValue(i.yieldM2, i.plantPrice);
  const fv = fishValue(i.fishPrice, i.fcr, i.feedPrice, i.stockCost);
  const cScore = indexScore(cv, cropVals);
  const fScore = indexScore(fv, fishVals);
  el('crop-score').innerHTML = `${cScore}<small>/100</small>`;
  el('crop-fill').style.width = `${cScore}%`;
  el('crop-raw').textContent = `${eur(cv)} /m²/yr`;
  el('fish-score').innerHTML = `${fScore}<small>/100</small>`;
  el('fish-fill').style.width = `${fScore}%`;
  el('fish-raw').textContent = `${eur(fv)} /kg`;
}

function renderBreakdown(s: ScenarioResult): void {
  el('v-fish').textContent = eur(s.fishRev);
  el('v-plant').textContent = eur(s.plantRev);
  setBarWidths([
    { id: 's-fish', v: s.fishRev },
    { id: 's-plant', v: s.plantRev },
  ]);
  el('v-inp').textContent = eur(s.inputs);
  el('v-energy').textContent = eur(s.energy);
  el('v-lab').textContent = eur(s.labor);
  el('v-rent').textContent = eur(s.rent);
  el('v-over').textContent = eur(s.over);
  setBarWidths([
    { id: 's-inp', v: s.inputs },
    { id: 's-energy', v: s.energy },
    { id: 's-lab', v: s.labor },
    { id: 's-rent', v: s.rent },
    { id: 's-over', v: s.over },
  ]);
}

function renderVerdict(
  L: ScenarioResult, R: ScenarioResult,
  beL: number | null, beR: number | null,
  s: ScenarioResult, horizon: number,
): void {
  const winner =
    beL !== null && beR !== null ? (beL < beR ? 'Lease' : 'Rent')
    : beL !== null ? 'Lease'
    : beR !== null ? 'Rent'
    : null;
  let v = `<b>${winner ? `${winner} breaks even first</b>` : `Neither pays back within ${horizon} years</b>`}. `;
  v += `Lease ties up <b>${eur(L.capex)}</b> upfront; renting needs ${eur(R.capex)} but ${eur(R.rent)}/yr in rent. `;
  v += `Plants carry <b>${Math.round((s.plantRev / Math.max(1, s.rev)) * 100)}%</b> of steady revenue.`;
  el('verdict').innerHTML = v;
}

/** Recompute everything from the form and repaint all outputs. */
export function render(state: AppState): void {
  // Update vintage banner (ensures DOM text matches source constant)
  const bannerEl = document.getElementById('vintage-banner');
  if (bannerEl) bannerEl.textContent = VINTAGE_BANNER_TEXT;
  const i = readInputs(state);
  const t: Toggles = { solar: state.solar, heatpump: state.heatpump };

  const L = computeScenario('lease', i, t);
  const R = computeScenario('rent', i, t);
  const Ls = simulateMonthly(L, i, i.horizon);
  const Rs = simulateMonthly(R, i, i.horizon);

  setScenarioCard('L', L, Ls.breakEven, i.horizon);
  setScenarioCard('R', R, Rs.breakEven, i.horizon);

  const skLnet = el('sk-lnet');
  skLnet.textContent = eur(L.net);
  skLnet.style.color = L.net >= 0 ? 'var(--good)' : 'var(--bad)';
  const skRnet = el('sk-rnet');
  skRnet.textContent = eur(R.net);
  skRnet.style.color = R.net >= 0 ? 'var(--good)' : 'var(--bad)';
  el('sk-lbe').textContent = beText(Ls.breakEven, L.ebitda, i.horizon);
  el('sk-rbe').textContent = beText(Rs.breakEven, R.ebitda, i.horizon);

  renderChart(Ls, Rs, i.horizon);
  renderSpark(Ls, Rs, i.horizon);
  renderCompare(L, R);

  el('e-gen').textContent = kwh(L.E.gen);
  el('e-imp').textContent = kwh(L.E.imp);
  el('e-eff').textContent = `${ct(L.E.eff)}/kWh`;

  const s = state.focus === 'lease' ? L : R;
  renderTable(yearRows(s, i, i.horizon));
  const firstFishYr = Math.max(1, Math.ceil(i.growMonths / 12));
  el('ramp-note').innerHTML =
    `Fish reach market size after <b>${Math.round(i.growMonths)} months</b> ` +
    `(first meaningful fish income ~year ${firstFishYr}); crops sell after ` +
    `~<b>${Math.round(i.cycleDays)} days</b>. Costs run from month 1. Highlighted row = payback.`;

  renderIndices(i);
  updateCropDots(state);
  renderPairs(state);
  renderBreakdown(s);
  renderVerdict(L, R, Ls.breakEven, Rs.breakEven, s, i.horizon);

  // Persist the full session (selections + every input) to localStorage.
  const values: Record<string, string | number | boolean> = {
    scale: state.scale,
    species: state.species,
    crop: state.crop,
    solar: state.solar,
    heatpump: state.heatpump,
    focus: state.focus,
    region: state.region,
    tab: state.tab,
  };
  for (const id of INPUT_IDS) values[id] = el<HTMLInputElement>(id).value;
  snapshot(values);
}

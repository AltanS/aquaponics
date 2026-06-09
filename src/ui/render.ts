import { CROPS, FISH, SUBSIDIES } from '../data';
import {
  computeScenario,
  computeSubsidies,
  cropValue,
  fishValue,
  indexScore,
  simulateMonthly,
  yearRows,
  type CalcInputs,
  type ScenarioResult,
  type SubsidyResult,
  type Toggles,
} from '../core';
import { el } from './dom';
import { ct, eur, kwh } from './format';
import { INPUT_IDS, readInputs } from './inputs';
import { renderChart } from './chart';
import { renderTable } from './table';
import { renderPairs, updatePairings } from './panels';
import { renderSelection, renderTotals } from './totals';
import { renderSubsidies } from './subsidies';
import { snapshot } from './persist';
import type { AppState } from './state';

/** Grant a scenario its eligible subsidies and return a CAPEX-reduced clone. */
function applyGrants(
  s: ScenarioResult, scaleTier: string, t: Toggles, deprYears: number,
): { sub: SubsidyResult; adj: ScenarioResult } {
  const sub = computeSubsidies(
    {
      scaleTier,
      capex: { construction: s.construction, equipment: s.equipment, pv: s.pvCapex, hp: s.hpCapex, total: s.capex },
      heatpump: t.heatpump,
      solar: t.solar,
    },
    SUBSIDIES,
  );
  const netCapex = Math.max(0, s.capex - sub.total);
  const depr = netCapex / deprYears;
  return { sub, adj: { ...s, capex: netCapex, depr, net: s.ebitda - depr } };
}

/** Data-vintage banner text — always visible near results per spec-06. */
const VINTAGE_BANNER_TEXT = 'Berlin/Brandenburg figures, compiled 2026-06 — prices drift';

function beText(be: number | null, ebitda: number, horizon: number): string {
  if (be !== null) return `${be.toFixed(1)} yr`;
  return ebitda > 0 ? `> ${horizon} yr` : 'never';
}

function setScenarioCard(
  prefix: 'L' | 'R', s: ScenarioResult, adj: ScenarioResult, sub: SubsidyResult,
  be: number | null, horizon: number,
): void {
  el(`${prefix}-capex`).textContent = eur(s.capex); // gross
  el(`${prefix}-con`).textContent = eur(s.construction);
  el(`${prefix}-eq`).textContent = eur(s.energyCapex);
  const grant = el(`${prefix}-grant`);
  grant.textContent = sub.total > 0 ? `−${eur(sub.total)}` : '€0';
  grant.style.color = sub.total > 0 ? 'var(--good)' : '';
  el(`${prefix}-netcapex`).textContent = eur(adj.capex); // after grants
  el(`${prefix}-rent`).textContent = eur(s.rent);
  const ebitda = el(`${prefix}-ebitda`);
  ebitda.textContent = eur(s.ebitda);
  ebitda.style.color = s.ebitda >= 0 ? 'var(--good)' : 'var(--bad)';
  el(`${prefix}-owner`).textContent = s.ownerLabor > 0 ? `−${eur(s.ownerLabor)}` : '€0';
  const econ = el(`${prefix}-econ`);
  const econProfit = s.ebitda - s.ownerLabor;
  econ.textContent = eur(econProfit);
  econ.style.color = econProfit >= 0 ? 'var(--good)' : 'var(--bad)';
  const net = el(`${prefix}-net`);
  net.textContent = eur(adj.net); // depreciation on net-of-grant CAPEX
  net.style.color = adj.net >= 0 ? 'var(--good)' : 'var(--bad)';
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
  const head = winner
    ? `${winner} breaks even first`
    : `Neither pays back within <span class="n">${horizon}</span> years`;
  let v = `<b>${head}</b>. `;
  v += `Lease ties up <b class="n">${eur(L.capex)}</b> upfront; renting needs <span class="n">${eur(R.capex)}</span> but <span class="n">${eur(R.rent)}</span>/yr in rent. `;
  v += `Plants carry <b class="n">${Math.round((s.plantRev / Math.max(1, s.rev)) * 100)}%</b> of steady revenue.`;
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
  // Eligible grants reduce the CAPEX base → shallower cash valley & lower
  // depreciation. Break-even and net are computed on the grant-adjusted clone.
  const { sub: subL, adj: adjL } = applyGrants(L, state.scale, t, i.deprYears);
  const { sub: subR, adj: adjR } = applyGrants(R, state.scale, t, i.deprYears);
  const Ls = simulateMonthly(adjL, i, i.horizon);
  const Rs = simulateMonthly(adjR, i, i.horizon);

  setScenarioCard('L', L, adjL, subL, Ls.breakEven, i.horizon);
  setScenarioCard('R', R, adjR, subR, Rs.breakEven, i.horizon);

  const profitMo = (id: string, ebitda: number): void => {
    const e = el(id);
    e.textContent = eur(ebitda / 12);
    e.style.color = ebitda >= 0 ? 'var(--good)' : 'var(--bad)';
  };
  profitMo('sk-lprofit', L.ebitda);
  profitMo('sk-rprofit', R.ebitda);
  el('sk-lbe').textContent = beText(Ls.breakEven, L.ebitda, i.horizon);
  el('sk-rbe').textContent = beText(Rs.breakEven, R.ebitda, i.horizon);

  renderChart(Ls, Rs, i.horizon);
  renderCompare(L, R);

  el('e-gen').textContent = kwh(L.E.gen);
  el('e-imp').textContent = kwh(L.E.imp);
  el('e-eff').textContent = `${ct(L.E.eff)}/kWh`;
  renderTotals(state, i, L.E);
  renderSubsidies(state.focus === 'lease' ? subL : subR, state.focus);

  const s = state.focus === 'lease' ? adjL : adjR;
  renderTable(yearRows(s, i, i.horizon));
  const firstFishYr = Math.max(1, Math.ceil(i.growMonths / 12));
  el('ramp-note').innerHTML =
    `Fish reach market size after <b class="n">${Math.round(i.growMonths)}</b> months ` +
    `(first meaningful fish income ~year <span class="n">${firstFishYr}</span>); crops sell after ` +
    `~<b class="n">${Math.round(i.cycleDays)}</b> days. Costs run from month <span class="n">1</span>. Highlighted row = payback.`;

  renderIndices(i);
  renderSelection(state);
  updatePairings(state);
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

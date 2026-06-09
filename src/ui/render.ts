import { CROPS, FISH, REGIONS } from '../data';
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
import { ct, eur, eurApprox, kwh, setCurrency } from './format';
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
  grants: Parameters<typeof computeSubsidies>[1],
): { sub: SubsidyResult; adj: ScenarioResult } {
  const sub = computeSubsidies(
    {
      scaleTier,
      capex: { construction: s.construction, equipment: s.equipment, pv: s.pvCapex, hp: s.hpCapex, total: s.capex },
      heatpump: t.heatpump,
      solar: t.solar,
    },
    grants,
  );
  const netCapex = Math.max(0, s.capex - sub.total);
  const depr = netCapex / deprYears;
  return { sub, adj: { ...s, capex: netCapex, depr, net: s.ebitda - depr } };
}

function beText(be: number | null, ebitda: number, horizon: number): string {
  // Round to the precision the model supports — half-years up to 5, whole years
  // beyond. A "~3.5 yr" reads as the estimate it is, not a measured date.
  if (be !== null) {
    const r = be >= 5 ? Math.round(be) : Math.round(be * 2) / 2;
    return `~${r} yr`;
  }
  return ebitda > 0 ? `> ${horizon} yr` : 'never';
}

/** Header break-even tile: a compact value plus a one-line clarifier for the
 *  two non-payback states, which are otherwise cryptic ("> 15 yr", "never"). */
function setHeaderBE(be: number | null, ebitda: number, horizon: number): void {
  const v = el('sk-be');
  if (be !== null) {
    v.textContent = beText(be, ebitda, horizon);
  } else if (ebitda > 0) {
    v.innerHTML = `&gt; ${horizon} yr<small class="vsub">payback past the ${horizon}-yr horizon</small>`;
  } else {
    v.innerHTML = `never<small class="vsub">loses money every year</small>`;
  }
}

/** Local-currency figure with the comparison-only "≈ €" companion (if any). */
function withApprox(localValue: number): string {
  const approx = eurApprox(localValue);
  return approx ? `${eur(localValue)}<small class="eurx">${approx}</small>` : eur(localValue);
}

/** Which scenario breaks even first — 'L', 'R', or null if neither pays back.
 *  This is the ONLY thing that earns the green accent; it is not hardwired to
 *  either scenario, so the visual "advantage" tracks the actual numbers. */
function pickWinner(beL: number | null, beR: number | null): 'L' | 'R' | null {
  if (beL !== null && beR !== null) return beL <= beR ? 'L' : 'R';
  if (beL !== null) return 'L';
  if (beR !== null) return 'R';
  return null;
}

/** Flag the winning column (accent header + "breaks even first"); clear the other. */
function setWinner(prefix: 'L' | 'R', isWinner: boolean): void {
  el(`${prefix}-head`).classList.toggle('won', isWinner);
  el(`${prefix}-win`).textContent = isWinner ? '✓ breaks even first' : '';
}

function setScenarioCard(
  prefix: 'L' | 'R', s: ScenarioResult, adj: ScenarioResult, sub: SubsidyResult,
  be: number | null, beNoGrant: number | null, horizon: number,
): void {
  // Break-even is the hero. When grants apply and actually move the date, show
  // the un-granted break-even alongside so the grant's value reads as time saved.
  const beMain = beText(be, s.ebitda, horizon);
  const showVs = sub.total > 0 && be !== null && beNoGrant !== null
    && beText(beNoGrant, s.ebitda, horizon) !== beMain;
  el(`${prefix}-be`).innerHTML = showVs
    ? `${beMain}<small class="bevs">${beText(beNoGrant, s.ebitda, horizon)} without grants</small>`
    : beMain;

  el(`${prefix}-capex`).innerHTML = withApprox(s.capex); // gross + €-companion
  el(`${prefix}-con`).textContent = s.construction > 0 ? eur(s.construction) : '—';
  el(`${prefix}-eq`).textContent = eur(s.energyCapex);
  const grant = el(`${prefix}-grant`);
  grant.textContent = sub.total > 0 ? `−${eur(sub.total)}` : '—';
  grant.style.color = sub.total > 0 ? 'var(--good)' : '';
  el(`${prefix}-netcapex`).textContent = eur(adj.capex); // after grants
  el(`${prefix}-rent`).textContent = eur(s.rent);
  const ebitda = el(`${prefix}-ebitda`);
  ebitda.innerHTML = withApprox(s.ebitda);
  ebitda.style.color = s.ebitda >= 0 ? 'var(--good)' : 'var(--bad)';
  el(`${prefix}-owner`).textContent = s.ownerLabor > 0 ? `−${eur(s.ownerLabor)}` : eur(0);
  const econ = el(`${prefix}-econ`);
  const econProfit = s.ebitda - s.ownerLabor;
  econ.textContent = eur(econProfit);
  econ.style.color = econProfit >= 0 ? 'var(--good)' : 'var(--bad)';
  const net = el(`${prefix}-net`);
  net.textContent = eur(adj.net); // depreciation on net-of-grant CAPEX
  net.style.color = adj.net >= 0 ? 'var(--good)' : 'var(--bad)';
}

/** Distribute segment widths of a stacked bar proportionally to their values. */
function setBarWidths(parts: { id: string; v: number }[]): void {
  const total = parts.reduce((a, p) => a + Math.max(0, p.v), 0);
  for (const p of parts) {
    el(p.id).style.width = `${total > 0 ? (Math.max(0, p.v) / total) * 100 : 0}%`;
  }
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
  winner: 'L' | 'R' | null,
  s: ScenarioResult, horizon: number,
): void {
  const head = winner
    ? `${winner === 'L' ? 'Lease' : 'Rent'} breaks even first`
    : `Neither pays back within <span class="n">${horizon}</span> years`;
  let v = `<b>${head}</b>. `;
  v += `Lease ties up <b class="n">${eur(L.capex)}</b> upfront; renting needs <span class="n">${eur(R.capex)}</span> but <span class="n">${eur(R.rent)}</span>/yr in rent. `;
  v += `Plants carry <b class="n">${Math.round((s.plantRev / Math.max(1, s.rev)) * 100)}%</b> of steady revenue.`;
  el('verdict').innerHTML = v;
}

/** Recompute everything from the form and repaint all outputs. */
export function render(state: AppState): void {
  // Active region drives the display currency, the data-vintage banner, and the
  // subsidy programs offered.
  const reg = REGIONS[state.region];
  setCurrency(reg.currency);
  const bannerEl = document.getElementById('vintage-banner');
  if (bannerEl) bannerEl.textContent = `${reg.label} figures, compiled ${reg.dataVintage.slice(0, 7)} — prices drift`;
  const i = readInputs(state);
  const t: Toggles = { solar: state.solar, heatpump: state.heatpump };

  const L = computeScenario('lease', i, t);
  const R = computeScenario('rent', i, t);
  // Eligible grants reduce the CAPEX base → shallower cash valley & lower
  // depreciation. Break-even and net are computed on the grant-adjusted clone.
  const { sub: subL, adj: adjL } = applyGrants(L, state.scale, t, i.deprYears, reg.subsidies);
  const { sub: subR, adj: adjR } = applyGrants(R, state.scale, t, i.deprYears, reg.subsidies);
  const Ls = simulateMonthly(adjL, i, i.horizon);
  const Rs = simulateMonthly(adjR, i, i.horizon);
  // No-grant break-even (L/R carry the gross CAPEX) — only when grants apply, so
  // the card can show "how much sooner the grant pays you back".
  const beNoGrantL = subL.total > 0 ? simulateMonthly(L, i, i.horizon).breakEven : null;
  const beNoGrantR = subR.total > 0 ? simulateMonthly(R, i, i.horizon).breakEven : null;

  setScenarioCard('L', L, adjL, subL, Ls.breakEven, beNoGrantL, i.horizon);
  setScenarioCard('R', R, adjR, subR, Rs.breakEven, beNoGrantR, i.horizon);

  // The green accent is earned, not assigned: it lands on whichever scenario
  // breaks even first (or neither), so the comparison stops implying lease wins.
  const winner = pickWinner(Ls.breakEven, Rs.breakEven);
  setWinner('L', winner === 'L');
  setWinner('R', winner === 'R');

  // Sticky header is the bare decision: which option, when it pays back, and the
  // monthly profit AFTER paying yourself (owner-unpaid EBITDA would flatter a
  // one-person farm by a full-time salary). It follows the data-driven winner —
  // and falls back to the higher-monthly scenario when neither pays back.
  const wPrefix = winner ?? (L.ebitda - L.ownerLabor >= R.ebitda - R.ownerLabor ? 'L' : 'R');
  const wScn = wPrefix === 'L' ? L : R;
  const wBe = wPrefix === 'L' ? Ls.breakEven : Rs.breakEven;
  el('sk-best').textContent = winner ? (winner === 'L' ? 'Lease & build' : 'Rent existing') : 'Neither pays back';
  setHeaderBE(wBe, wScn.ebitda, i.horizon);
  const skProfit = el('sk-profit');
  const wMonthly = (wScn.ebitda - wScn.ownerLabor) / 12;
  skProfit.innerHTML = withApprox(wMonthly);
  skProfit.style.color = wMonthly >= 0 ? 'var(--good)' : 'var(--bad)';

  renderChart(Ls, Rs, i.horizon, i.growMonths / 12);

  el('e-gen').textContent = kwh(L.E.gen);
  el('e-imp').textContent = kwh(L.E.imp);
  el('e-eff').textContent = ct(L.E.eff);
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
  renderVerdict(L, R, winner, s, i.horizon);

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

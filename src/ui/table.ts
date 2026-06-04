import type { YearRow } from '../core';
import { el } from './dom';
import { eur } from './format';

/** Year-by-year cash-flow table; the payback year is highlighted. */
export function renderTable(rows: YearRow[]): void {
  const beYear = rows.find((r) => r.year > 0 && r.cum >= 0)?.year ?? null;

  let h =
    '<thead><tr><th>Year</th><th>Fish</th><th>Plants</th><th>Costs</th><th>Cash flow</th><th>Cumulative</th></tr></thead><tbody>';
  for (const r of rows) {
    const cls = (r.year === 0 ? 'y0' : '') + (r.year === beYear ? ' be' : '');
    h += `<tr class="${cls}"><td>${r.year === 0 ? '0 · invest' : r.year}</td>` +
      `<td>${r.year === 0 ? '–' : eur(r.fish)}</td>` +
      `<td>${r.year === 0 ? '–' : eur(r.plant)}</td>` +
      `<td>${r.year === 0 ? '–' : eur(r.cost)}</td>` +
      `<td>${eur(r.cash)}</td>` +
      `<td class="${r.cum >= 0 ? 'cp' : 'cn'}">${eur(r.cum)}</td></tr>`;
  }
  el('yt').innerHTML = h + '</tbody>';
}

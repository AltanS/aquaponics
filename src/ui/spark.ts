import type { RampSeries, SeriesPoint } from '../core';
import { el } from './dom';

/**
 * Tiny sticky-header sparkline of cumulative cash flow (lease + rent) so the
 * profitability shape stays visible while tabbing around the inputs.
 */
export function renderSpark(lease: RampSeries, rent: RampSeries, horizonYears: number): void {
  const W = 150;
  const H = 40;
  const pad = 3;

  const allY = [...lease.pts, ...rent.pts].map((p) => p.y).concat([0]);
  let mn = Math.min(...allY);
  let mx = Math.max(...allY);
  if (mn === mx) mx = mn + 1;

  const X = (x: number) => pad + (x / horizonYears) * (W - 2 * pad);
  const Y = (v: number) => pad + ((mx - v) / (mx - mn)) * (H - 2 * pad);

  const poly = (pts: SeriesPoint[], cls: string) =>
    `<polyline class="ln ${cls}" style="stroke-width:1.6" points="${pts.map((p) => `${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ')}"/>`;

  const y0 = Y(0);
  const zero = `<line class="zero" stroke-dasharray="3 3" x1="${pad}" y1="${y0}" x2="${W - pad}" y2="${y0}"/>`;

  el('spark').innerHTML =
    `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-label="Cumulative cash flow sparkline">` +
    zero + poly(lease.pts, 'ln-lease') + poly(rent.pts, 'ln-rent') +
    '</svg>';
}

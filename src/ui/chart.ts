import type { RampSeries, SeriesPoint } from '../core';
import { el } from './dom';
import { fmtK } from './format';

/** Hand-rolled SVG cumulative cash-flow chart with break-even markers. */
export function renderChart(lease: RampSeries, rent: RampSeries, horizonYears: number): void {
  const W = 640;
  const H = 320;
  const pl = 62;
  const pr = 14;
  const pt = 16;
  const pb = 34;
  const iw = W - pl - pr;
  const ih = H - pt - pb;

  const allY = [...lease.pts, ...rent.pts].map((p) => p.y).concat([0]);
  let mn = Math.min(...allY);
  let mx = Math.max(...allY);
  if (mn === mx) mx = mn + 1;
  const pad = (mx - mn) * 0.08;
  mn -= pad;
  mx += pad;

  const X = (x: number) => pl + (x / horizonYears) * iw;
  const Y = (v: number) => pt + ((mx - v) / (mx - mn)) * ih;

  let o = '';
  for (let i = 0; i <= 4; i++) {
    const v = mn + ((mx - mn) * i) / 4;
    const yy = Y(v);
    o += `<line class="grid" x1="${pl}" y1="${yy}" x2="${W - pr}" y2="${yy}"/>`;
    o += `<text class="ax" x="${pl - 8}" y="${yy + 4}" text-anchor="end">${fmtK(v)}</text>`;
  }
  const y0 = Y(0);
  o += `<line class="zero" x1="${pl}" y1="${y0}" x2="${W - pr}" y2="${y0}"/>`;

  const step = horizonYears <= 10 ? 2 : horizonYears <= 20 ? 5 : 10;
  for (let i = 0; i <= horizonYears; i += step) {
    o += `<text class="ax" x="${X(i)}" y="${H - 14}" text-anchor="middle">${i}</text>`;
  }
  o += `<text class="ax" x="${pl + iw / 2}" y="${H - 1}" text-anchor="middle">years</text>`;

  const poly = (pts: SeriesPoint[], cls: string) =>
    `<polyline class="ln ${cls}" points="${pts.map((p) => `${X(p.x)},${Y(p.y)}`).join(' ')}"/>`;
  o += poly(lease.pts, 'ln-lease') + poly(rent.pts, 'ln-rent');

  const mark = (be: number | null, cls: string) => {
    if (be === null || be > horizonYears) return;
    const bx = X(be);
    o += `<line class="bemark ${cls}" x1="${bx}" y1="${pt}" x2="${bx}" y2="${y0}"/>`;
    o += `<circle class="bedot ${cls}" cx="${bx}" cy="${y0}" r="4"/>`;
    o += `<text class="ax" x="${bx}" y="${pt + 12}" text-anchor="middle">${be.toFixed(1)}y</text>`;
  };
  mark(lease.breakEven, 'lease');
  mark(rent.breakEven, 'rent');

  el('chart').innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%">${o}</svg>`;
}

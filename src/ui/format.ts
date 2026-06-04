import type { Difficulty } from '../data';

export function eur(v: number): string {
  return (v < 0 ? '-€' : '€') + Math.round(Math.abs(v)).toLocaleString('de-DE');
}

export function kwh(v: number): string {
  return `${Math.round(v).toLocaleString('de-DE')} kWh`;
}

export function ct(v: number): string {
  return `${(v * 100).toFixed(1).replace('.', ',')} ct`;
}

/** Compact € for chart axes: €350k / €9.5k / €600. */
export function fmtK(v: number): string {
  const a = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (a >= 1000) return `${sign}€${(a / 1000).toFixed(a >= 10000 ? 0 : 1)}k`;
  return `${sign}€${Math.round(a)}`;
}

export function chip(key: string, value: string): string {
  return `<span class="chip"><b>${key}</b>${value}</span>`;
}

export function diffClass(d: Difficulty): string {
  return d === 'Hard' ? 'd-hard' : d === 'Easy' ? 'd-easy' : 'd-med';
}

/** Format temp range for display, e.g. "25–28°C" */
export function formatTempRange(min: number, max: number): string {
  return `${min}–${max}°C`;
}

/** Format grow-out duration, e.g. "5 mo" or "24 mo (2 yr)" for ≥ 24 months */
export function formatGrowOut(months: number): string {
  if (months >= 24) {
    const yrs = Math.round(months / 12);
    return `${months} mo (${yrs} yr)`;
  }
  return `${months} mo`;
}

/** Format cycle days, e.g. "38 d" */
export function formatCycleDays(days: number): string {
  return `${days} d`;
}

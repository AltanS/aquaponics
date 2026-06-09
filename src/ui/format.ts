import type { Difficulty } from '../data';

// Active display currency — set per region before each render (setCurrency).
// Defaults to EUR so non-UI callers (and tests) get the historical behaviour.
let activeSymbol = '€';
let activeLocale = 'de-DE';
let activeCode = 'EUR';
let activeFxToEur = 1;

/** Switch the display currency (symbol + number locale) for the active region. */
export function setCurrency(c: { symbol: string; locale: string; code: string; fxToEur: number }): void {
  activeSymbol = c.symbol;
  activeLocale = c.locale;
  activeCode = c.code;
  activeFxToEur = c.fxToEur;
}

/** The active currency symbol — for unit labels and table headers. */
export function currencySymbol(): string {
  return activeSymbol;
}

/**
 * A comparison-only "≈ €X" companion for a value in the active local currency.
 * Returns '' for EUR regions (no companion needed) and a compact, low-precision
 * EUR figure otherwise — it is a rough cross-region yardstick, not a quote, so
 * it deliberately rounds hard (€63k, €4.7k, €600).
 */
export function eurApprox(localValue: number): string {
  if (activeCode === 'EUR') return '';
  const v = localValue * activeFxToEur;
  const a = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  const body = a >= 1000 ? `€${(a / 1000).toFixed(a >= 10000 ? 0 : 1)}k` : `€${Math.round(a)}`;
  return `≈ ${sign}${body}`;
}

/** Format a money value in the active currency. (Name kept for call-site churn.) */
export function eur(v: number): string {
  return (v < 0 ? '-' : '') + activeSymbol + Math.round(Math.abs(v)).toLocaleString(activeLocale);
}

export function kwh(v: number): string {
  return `${Math.round(v).toLocaleString(activeLocale)} kWh`;
}

/** Money with 2 decimals — for small per-unit figures (€/kg, €/worked hour)
 *  where rounding to whole units would throw away the digits that matter. */
export function eur2(v: number): string {
  return (
    (v < 0 ? '-' : '') +
    activeSymbol +
    Math.abs(v).toLocaleString(activeLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

/** Small per-unit price (e.g. effective energy €/kWh) in the active currency. */
export function ct(v: number): string {
  return activeSymbol + v.toLocaleString(activeLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Compact money for chart axes: €350k / €9.5k / €600. */
export function fmtK(v: number): string {
  const a = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (a >= 1000) return `${sign}${activeSymbol}${(a / 1000).toFixed(a >= 10000 ? 0 : 1)}k`;
  return `${sign}${activeSymbol}${Math.round(a)}`;
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

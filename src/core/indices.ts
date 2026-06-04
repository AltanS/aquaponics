/** Crop economic read: revenue density, €/m²/yr. */
export function cropValue(yieldM2: number, price: number): number {
  return yieldM2 * price;
}

/** Fish economic read: gross margin per kg, net of feed and bought-in stock. */
export function fishValue(price: number, fcr: number, feedPrice: number, stockCost: number): number {
  return price - fcr * feedPrice - stockCost;
}

/** Normalise a value 0–100 across its set; 50 when the set is degenerate. */
export function indexScore(value: number, all: number[]): number {
  const mn = Math.min(...all);
  const mx = Math.max(...all);
  if (mx <= mn) return 50;
  return Math.max(0, Math.min(100, Math.round(((value - mn) / (mx - mn)) * 100)));
}

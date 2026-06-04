/** Typed DOM helpers — fail fast on missing IDs so markup/code drift is loud. */

export function el<T extends HTMLElement = HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

export function num(id: string): number {
  const v = parseFloat(el<HTMLInputElement>(id).value);
  return Number.isNaN(v) ? 0 : v;
}

export function setVal(id: string, value: number): void {
  el<HTMLInputElement>(id).value = String(value);
}

/**
 * Local persistence via TinyBase (same library/pattern as ~/playground/synth):
 * a single values-only store auto-saved to localStorage. Everything the user
 * can change — selections, toggles, active tab, and every numeric input —
 * round-trips here, so a reload restores the exact session.
 *
 * Input values are stored as raw strings so they round-trip the <input>
 * elements exactly (no float re-formatting).
 */
import { createStore, type Store } from 'tinybase/store';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import type { Persister } from 'tinybase/persisters';

const STORAGE_KEY = 'aquaponics-calculator';

export const store: Store = createStore();

const persister: Persister = createLocalPersister(store, STORAGE_KEY);

/** Load any saved session and start auto-saving. Returns true if data existed. */
export async function loadPersisted(): Promise<boolean> {
  await persister.load();
  const hasData = Object.keys(store.getValues()).length > 0;
  await persister.startAutoSave();
  return hasData;
}

/** Write the full UI snapshot in one transaction (auto-saved by the persister). */
export function snapshot(values: Record<string, string | number | boolean>): void {
  store.transaction(() => {
    for (const [k, v] of Object.entries(values)) store.setValue(k, v);
  });
}

export function getPersisted(): Record<string, string | number | boolean> {
  return store.getValues() as Record<string, string | number | boolean>;
}

/** Wipe the saved session (used by the Reset button before reloading). */
export async function clearPersisted(): Promise<void> {
  store.delValues();
  await persister.save();
}

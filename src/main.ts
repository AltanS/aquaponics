import './style.css';
import { CROPS, FISH, SCALES, type ScaleId } from './data';
import type { ScenarioKey } from './core';
import { el } from './ui/dom';
import { applyCropPreset, applyFishPreset, applyScalePreset, fillAll, INPUT_IDS } from './ui/inputs';
import { renderCropPanel, renderFishPanel } from './ui/panels';
import { buildTabs } from './ui/tabs';
import { render } from './ui/render';
import { clearPersisted, getPersisted, loadPersisted } from './ui/persist';
import { state, TAB_IDS, type RegionId, type TabId } from './ui/state';

// ── Main tab switching ─────────────────────────────────────────────────────

function setTab(tab: TabId): void {
  state.tab = tab;
  document.querySelectorAll<HTMLButtonElement>('#main-tabs .mtab[data-tab]').forEach((btn) => {
    btn.classList.toggle('on', btn.dataset.tab === tab);
  });
  for (const id of TAB_IDS) {
    el(`pane-${id}`).classList.toggle('on', id === tab);
  }
}

// ── Scale (controlled from both the overview dropdown and the Setup pills) ───

/** Fill the overview scale dropdown from the data (labels carry the area). */
function populateScaleSelect(): void {
  const sel = el<HTMLSelectElement>('scale-select');
  sel.innerHTML = '';
  for (const key of Object.keys(SCALES) as ScaleId[]) {
    const o = document.createElement('option');
    o.value = key;
    o.textContent = SCALES[key].label;
    sel.appendChild(o);
  }
}

/** Keep the dropdown and the Setup pills reflecting the active scale. */
function syncScaleWidgets(): void {
  el<HTMLSelectElement>('scale-select').value = state.scale;
  el('scale-set')
    .querySelectorAll<HTMLButtonElement>('.tab')
    .forEach((b) => b.classList.toggle('on', b.dataset.key === state.scale));
}

/** Single entry point for a scale change from any widget. */
function selectScale(key: ScaleId): void {
  state.scale = key;
  applyScalePreset(state); // scale-owned fields only — keeps user price tweaks
  syncScaleWidgets();
  render(state);
}

// ── Persistence hydration ──────────────────────────────────────────────────

/** Restore state + input values from the persisted session (validated). */
function hydrate(): void {
  const saved = getPersisted();

  const pick = <T extends string>(key: string, valid: readonly T[] | Record<T, unknown>): T | null => {
    const v = saved[key];
    if (typeof v !== 'string') return null;
    const ok = Array.isArray(valid) ? (valid as readonly string[]).includes(v) : v in valid;
    return ok ? (v as T) : null;
  };

  state.scale = pick('scale', SCALES) ?? state.scale;
  state.species = pick('species', FISH) ?? state.species;
  state.crop = pick('crop', CROPS) ?? state.crop;
  state.focus = pick<ScenarioKey>('focus', ['lease', 'rent'] as const) ?? state.focus;
  state.region = pick<RegionId>('region', ['berlin-brandenburg'] as const) ?? state.region;
  state.tab = pick<TabId>('tab', TAB_IDS) ?? state.tab;
  if (typeof saved['solar'] === 'boolean') state.solar = saved['solar'];
  if (typeof saved['heatpump'] === 'boolean') state.heatpump = saved['heatpump'];

  // Seed defaults first, then overlay every persisted input value — so inputs
  // added in newer versions still get sensible defaults.
  fillAll(state);
  for (const id of INPUT_IDS) {
    const v = saved[id];
    if (typeof v === 'string' && v !== '') el<HTMLInputElement>(id).value = v;
  }
}

/** Sync toggle/focus/region widgets to (possibly hydrated) state. */
function syncWidgets(): void {
  const solar = el('tg-solar');
  solar.classList.toggle('on', state.solar);
  solar.classList.toggle('off', !state.solar);
  const hp = el('tg-hp');
  hp.classList.toggle('on', state.heatpump);
  hp.classList.toggle('off', !state.heatpump);
  el<HTMLSelectElement>('region-select').value = state.region;
  syncScaleWidgets();
  el('focus-set')
    .querySelectorAll<HTMLButtonElement>('.pbtn')
    .forEach((b) => b.classList.toggle('on', b.dataset.focus === state.focus));
  setTab(state.tab);
}

// ── Wiring ─────────────────────────────────────────────────────────────────

function wire(): void {
  populateScaleSelect();
  buildTabs('scale-set', SCALES, state.scale, (key) => selectScale(key));

  // Scale dropdown in the overview mirrors the Setup pills
  el<HTMLSelectElement>('scale-select').addEventListener('change', function () {
    selectScale(this.value as ScaleId);
  });

  buildTabs('fish-tabs', FISH, state.species, (key) => {
    state.species = key;
    applyFishPreset(state);
    renderFishPanel(state);
    render(state);
  });

  buildTabs(
    'crop-tabs',
    CROPS,
    state.crop,
    (key) => {
      state.crop = key;
      applyCropPreset(state);
      renderCropPanel(state);
      render(state);
    },
    true,
  );

  // Main tabs
  el('main-tabs').addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.mtab[data-tab]');
    if (!btn) return;
    setTab(btn.dataset.tab as TabId);
    render(state);
  });

  // Reset: wipe the saved session and reload with pristine defaults
  el('reset-btn').addEventListener('click', () => {
    void clearPersisted().then(() => location.reload());
  });

  // Region selector
  el<HTMLSelectElement>('region-select').addEventListener('change', function () {
    state.region = this.value as RegionId;
    applyFishPreset(state);
    fillAll(state);
    render(state);
  });

  // Lease/rent focus for the year table & breakdown
  el('focus-set').addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-focus]');
    if (!btn) return;
    el('focus-set').querySelectorAll('.pbtn').forEach((x) => x.classList.remove('on'));
    btn.classList.add('on');
    state.focus = btn.dataset.focus as ScenarioKey;
    render(state);
  });

  // Solar / heat-pump toggles
  const wireToggle = (btnId: string, key: 'solar' | 'heatpump'): void => {
    el(btnId).addEventListener('click', function (this: HTMLElement) {
      state[key] = !state[key];
      this.classList.toggle('on', state[key]);
      this.classList.toggle('off', !state[key]);
      render(state);
    });
  };
  wireToggle('tg-solar', 'solar');
  wireToggle('tg-hp', 'heatpump');

  // Any input change re-renders live (render also snapshots to the store)
  document.querySelectorAll('input').forEach((input) => input.addEventListener('input', () => render(state)));
}

// ── Boot ───────────────────────────────────────────────────────────────────

async function boot(): Promise<void> {
  const hasSaved = await loadPersisted();
  if (hasSaved) hydrate();
  else fillAll(state);

  wire();
  syncWidgets();
  renderFishPanel(state);
  renderCropPanel(state);
  render(state);
}

void boot();

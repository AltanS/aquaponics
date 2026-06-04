import './style.css';
import { CROPS, FISH, SCALES } from './data';
import type { ScenarioKey } from './core';
import { el } from './ui/dom';
import { applyCropPreset, applyFishPreset, fillAll } from './ui/inputs';
import { renderCropPanel, renderFishPanel } from './ui/panels';
import { buildTabs } from './ui/tabs';
import { render } from './ui/render';
import { state } from './ui/state';

buildTabs('scale-set', SCALES, state.scale, (key) => {
  state.scale = key;
  fillAll(state);
  render(state);
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
function wireToggle(btnId: string, key: 'solar' | 'heatpump'): void {
  el(btnId).addEventListener('click', function (this: HTMLElement) {
    state[key] = !state[key];
    this.classList.toggle('on', state[key]);
    this.classList.toggle('off', !state[key]);
    render(state);
  });
}
wireToggle('tg-solar', 'solar');
wireToggle('tg-hp', 'heatpump');

// Any input change re-renders live
document.querySelectorAll('input').forEach((input) => input.addEventListener('input', () => render(state)));

fillAll(state);
renderFishPanel(state);
renderCropPanel(state);
render(state);

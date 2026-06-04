import { CROPS, FISH, type CropId } from '../data';
import { loopTemp, pairFishPlant, type PairClass } from '../core';
import { el } from './dom';
import { chip, diffClass, heatWord } from './format';
import type { AppState } from './state';

export function renderFishPanel(state: AppState): void {
  const f = FISH[state.species];
  el('fish-ttl').innerHTML =
    `${f.label} <span class="badge ${diffClass(f.difficulty)}">${f.difficulty}</span>`;
  el('fish-attrs').innerHTML =
    chip('Type', f.type) +
    chip('Water', f.temp) +
    chip('Loop ≈', `${Math.round(loopTemp(f))}°C`) +
    chip('Grow-out', f.growout) +
    chip('Heating', heatWord(f.heatFactor));
  el('fish-note').textContent = f.notes;
}

export function renderCropPanel(state: AppState): void {
  const c = CROPS[state.crop];
  el('crop-ttl').innerHTML =
    `${c.label} <span class="badge ${diffClass(c.difficulty)}">${c.difficulty}</span>`;
  el('crop-attrs').innerHTML =
    chip('Category', c.cat) + chip('Root temp', c.temp) + chip('Cycle', c.cycle) + chip('System', c.system);
  el('crop-note').textContent = c.notes;
}

const DOT_CLASS: Record<PairClass, string> = { good: 'c-good', work: 'c-work', poor: 'c-poor' };
const DOT_TITLE: Record<PairClass, string> = {
  good: 'Good pairing',
  work: 'Workable pairing',
  poor: 'Poor pairing',
};

/** Recolour the crop-tab dots for the currently selected fish. */
export function updateCropDots(state: AppState): void {
  const fish = FISH[state.species];
  el('crop-tabs')
    .querySelectorAll<HTMLButtonElement>('.tab')
    .forEach((btn) => {
      const key = btn.dataset.key as CropId;
      const p = pairFishPlant(fish, CROPS[key]);
      const dot = btn.querySelector('.cdot');
      if (dot) dot.className = `cdot ${DOT_CLASS[p.cls]}`;
      btn.title = `${DOT_TITLE[p.cls]} with ${fish.label}`;
    });
}

/** Pairing chips under the fish panel + the verdict line under the crop panel. */
export function renderPairs(state: AppState): void {
  const fish = FISH[state.species];
  const lt = Math.round(loopTemp(fish));

  const good: CropId[] = [];
  const work: CropId[] = [];
  for (const ck of Object.keys(CROPS) as CropId[]) {
    const p = pairFishPlant(fish, CROPS[ck]);
    if (p.cls === 'good') good.push(ck);
    else if (p.cls === 'work') work.push(ck);
  }

  let html = `<div class="ph">At its loop temperature (≈${lt}°C), ${fish.label} pairs best with:</div><div class="pairchips">`;
  if (good.length) {
    html += good
      .map((k) => `<span class="chip"><span class="cdot c-good"></span>${CROPS[k].label}</span>`)
      .join('');
  } else {
    html += '<span style="opacity:.7">— no strong matches; this fish suits a decoupled (separate-loop) design</span>';
  }
  html += '</div>';
  if (work.length) {
    html += '<div class="ph" style="margin-top:8px">Workable as a compromise:</div><div class="pairchips">';
    html += work
      .map((k) => `<span class="chip"><span class="cdot c-work"></span>${CROPS[k].label}</span>`)
      .join('');
    html += '</div>';
  }
  el('fish-pairs').innerHTML = html;

  // Current crop verdict — keep "poor → decoupled loop" semantics, never a hard block.
  const crop = CROPS[state.crop];
  const p = pairFishPlant(fish, crop);
  const fl = Math.round(p.loop);
  let t: string;
  if (p.cls === 'good') {
    t = `Good fit with ${fish.label} — a shared loop around ${fl}°C suits both.`;
  } else if (p.cls === 'work') {
    t = `Workable with ${fish.label} at ≈${fl}°C, but a touch ${p.dir === 'warm' ? 'warm' : 'cool'} for ${crop.label} — expect ${p.dir === 'warm' ? 'faster bolting / lower quality' : 'slower growth'}.`;
  } else {
    t = `Poor match: ${fish.label} runs the loop near ${fl}°C, outside ${crop.label}'s range. You'd need a decoupled system with separate water loops to grow both.`;
  }
  if (p.cls !== 'poor' && p.loop < 14) {
    t += ' At this temperature nitrification is slow — size the biofilter generously.';
  }
  const line = el('crop-pair');
  line.className = `pairline ${p.cls}`;
  line.innerHTML = t;
}

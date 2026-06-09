import { CROPS, FISH, REGIONS, type CropId, type FishId } from '../data';
import { loopTemp, pairFishPlant, type PairClass } from '../core';
import { deriveSuitability } from '../core/derive';
import { el } from './dom';
import { chip, diffClass, formatCycleDays, formatGrowOut, formatTempRange } from './format';
import type { AppState } from './state';

/** A small "Wikipedia ↗" link appended to a panel title. */
function wikiLink(url: string, label: string): string {
  return ` <a class="wiki" href="${url}" target="_blank" rel="noopener noreferrer" title="${label} on Wikipedia">Wikipedia ↗</a>`;
}

const SUITABILITY_LABEL: Record<'native' | 'workable' | 'costly', string> = {
  native: 'Low heating',
  workable: 'Moderate heating',
  costly: 'High heating',
};

export function renderFishPanel(state: AppState): void {
  const f = FISH[state.species];
  const suitability = deriveSuitability(f, REGIONS[state.region]);
  el('fish-ttl').innerHTML =
    `${f.label}${wikiLink(f.wiki, f.label)} <span class="badge ${diffClass(f.difficulty)}">${f.difficulty}</span>`;
  el('fish-attrs').innerHTML =
    chip('Type', f.type) +
    chip('Water', formatTempRange(f.fcMin, f.fcMax)) +
    chip('Loop ≈', `${Math.round(loopTemp(f))}°C`) +
    chip('Grow-out', formatGrowOut(f.growMonths)) +
    chip('Heating', SUITABILITY_LABEL[suitability]);
  el('fish-note').textContent = f.notes;
}

export function renderCropPanel(state: AppState): void {
  const c = CROPS[state.crop];
  el('crop-ttl').innerHTML =
    `${c.label}${wikiLink(c.wiki, c.label)} <span class="badge ${diffClass(c.difficulty)}">${c.difficulty}</span>`;
  el('crop-attrs').innerHTML =
    chip('Category', c.cat) +
    chip('Root temp', formatTempRange(c.cMin, c.cMax)) +
    chip('Cycle', formatCycleDays(c.cycleDays));
  el('crop-note').textContent = c.notes;
}

const PAIR_CLASS: Record<PairClass, string> = {
  good: 'pair-good',
  work: 'pair-work',
  poor: 'pair-poor',
};
const PAIR_TITLE: Record<PairClass, string> = {
  good: 'Good pairing',
  work: 'Workable pairing',
  poor: 'Poor pairing — implies a decoupled loop',
};

function tintPill(btn: HTMLButtonElement, cls: PairClass, withLabel: string): void {
  btn.classList.remove('pair-good', 'pair-work', 'pair-poor');
  btn.classList.add(PAIR_CLASS[cls]);
  btn.title = `${PAIR_TITLE[cls]} with ${withLabel}`;
}

/**
 * Colour each pill by how it pairs with the *other* side's current selection —
 * crops shaded against the chosen fish, fish shaded against the chosen crop.
 * Selections are never blocked; the colour is just guidance.
 */
export function updatePairings(state: AppState): void {
  const fish = FISH[state.species];
  const crop = CROPS[state.crop];

  el('crop-tabs')
    .querySelectorAll<HTMLButtonElement>('.tab')
    .forEach((btn) => {
      const p = pairFishPlant(fish, CROPS[btn.dataset.key as CropId]);
      tintPill(btn, p.cls, fish.label);
    });

  el('fish-tabs')
    .querySelectorAll<HTMLButtonElement>('.tab')
    .forEach((btn) => {
      const p = pairFishPlant(FISH[btn.dataset.key as FishId], crop);
      tintPill(btn, p.cls, crop.label);
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

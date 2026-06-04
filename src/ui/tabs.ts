import { el } from './dom';
import { BERLIN_REGION } from '../data/berlin-defaults';
import { deriveSuitability } from '../core/derive';
import { FISH, type FishId } from '../data';

/** Build a row of pill tabs from a keyed record; `withDot` adds the pairing dot. */
export function buildTabs<K extends string>(
  containerId: string,
  items: Record<K, { label: string }>,
  active: K,
  onSelect: (key: K) => void,
  withDot = false,
): void {
  const container = el(containerId);
  container.innerHTML = '';

  // Determine if we're building fish tabs (to add suitability badges)
  const isFishTabs = containerId === 'fish-tabs';

  for (const key of Object.keys(items) as K[]) {
    const btn = document.createElement('button');
    btn.className = 'tab' + (key === active ? ' on' : '');
    btn.dataset.key = key;

    let inner = (withDot ? '<span class="cdot"></span>' : '') + items[key].label;

    // Add suitability badge to fish tabs
    if (isFishTabs) {
      const fish = FISH[key as FishId];
      if (fish) {
        const suit = deriveSuitability(fish, BERLIN_REGION);
        inner += ` <span class="badge-${suit}">${suit}</span>`;
      }
    }

    btn.innerHTML = inner;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab').forEach((x) => x.classList.remove('on'));
      btn.classList.add('on');
      onSelect(key);
    });
    container.appendChild(btn);
  }
}

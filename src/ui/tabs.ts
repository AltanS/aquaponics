import { el } from './dom';

/** Build a row of pill tabs from a keyed record. Pairing colour is applied
 * separately (see updatePairings) so fish ⇄ plant selections stay in sync. */
export function buildTabs<K extends string>(
  containerId: string,
  items: Record<K, { label: string }>,
  active: K,
  onSelect: (key: K) => void,
): void {
  const container = el(containerId);
  container.innerHTML = '';

  for (const key of Object.keys(items) as K[]) {
    const btn = document.createElement('button');
    btn.className = 'tab' + (key === active ? ' on' : '');
    btn.dataset.key = key;
    btn.textContent = items[key].label;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab').forEach((x) => x.classList.remove('on'));
      btn.classList.add('on');
      onSelect(key);
    });
    container.appendChild(btn);
  }
}

import type { SubsidyBasis } from '../data';
import type { ScenarioKey, SubsidyResult } from '../core';
import { el } from './dom';
import { eur } from './format';

const BASIS_LABEL: Record<SubsidyBasis, string> = {
  construction: 'construction',
  equipment: 'equipment',
  eligibleCapex: 'construction + equipment',
  heatpump: 'heat-pump cost',
  pv: 'PV cost',
  totalCapex: 'total CAPEX',
};

function pct(v: number): string {
  return `${Math.round(v * 100)}%`;
}

function src(url: string, label?: string): string {
  return `<a href="${url}" target="_blank" rel="noopener">${label ?? 'source'}</a>`;
}

/** Render the grant breakdown for the focused scenario — applied + why-not. */
export function renderSubsidies(sub: SubsidyResult, focus: ScenarioKey): void {
  el('sub-focus').textContent = focus === 'lease' ? 'Lease & build' : 'Rent existing';

  let h = '';
  if (sub.applied.length) {
    h += '<table class="tt"><tbody>';
    for (const a of sub.applied) {
      h +=
        `<tr><td>${a.label}` +
        `<div class="subnote">${pct(a.rate)} of ${eur(a.eligibleBase)} ${BASIS_LABEL[a.basis]}` +
        `${a.note ? ` · ${a.note}` : ''} · ${src(a.source, a.sourceLabel)}</div></td>` +
        `<td class="cp"><b>−${eur(a.amount)}</b></td></tr>`;
    }
    h += `<tr class="sep"><td><b>Total grants</b></td><td class="cp"><b>−${eur(sub.total)}</b></td></tr>`;
    h += '</tbody></table>';
  } else {
    h += '<p class="ttnote">No grants apply to this scenario.</p>';
  }

  if (sub.ineligible.length) {
    h += '<p class="plabel" style="margin-top:14px">Not eligible here</p><ul class="inelig">';
    for (const x of sub.ineligible) {
      h += `<li><b>${x.label}</b> — ${x.reason} · ${src(x.source, x.sourceLabel)}</li>`;
    }
    h += '</ul>';
  }

  el('subsidy-breakdown').innerHTML = h;
}

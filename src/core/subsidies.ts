import type { Subsidy, SubsidyBasis } from '../data';

/** CAPEX broken into the components grants attach to (one scenario). */
export interface CapexBreakdown {
  construction: number;
  equipment: number;
  pv: number;
  hp: number;
  total: number;
}

/** Everything an eligibility check needs that isn't in the CAPEX itself. */
export interface SubsidyContext {
  /** scale tier id — hobby is treated as non-commercial */
  scaleTier: string;
  capex: CapexBreakdown;
  heatpump: boolean;
  solar: boolean;
}

export interface AppliedSubsidy {
  id: string;
  label: string;
  rate: number;
  basis: SubsidyBasis;
  /** the eligible cost base after caps */
  eligibleBase: number;
  /** the grant € (eligibleBase × rate, capped) */
  amount: number;
  source: string;
  sourceLabel?: string;
  note?: string;
}

export interface IneligibleSubsidy {
  id: string;
  label: string;
  /** human-readable reason it doesn't apply to this scenario */
  reason: string;
  source: string;
  sourceLabel?: string;
}

export interface SubsidyResult {
  applied: AppliedSubsidy[];
  ineligible: IneligibleSubsidy[];
  /** total grant € for this scenario */
  total: number;
}

function baseFor(basis: SubsidyBasis, c: CapexBreakdown): number {
  switch (basis) {
    case 'construction':
      return c.construction;
    case 'equipment':
      return c.equipment;
    case 'eligibleCapex':
      return c.construction + c.equipment;
    case 'heatpump':
      return c.hp;
    case 'pv':
      return c.pv;
    case 'totalCapex':
      return c.total;
  }
}

const BASIS_LABEL: Record<SubsidyBasis, string> = {
  construction: 'construction',
  equipment: 'equipment',
  eligibleCapex: 'construction + equipment',
  heatpump: 'the heat pump',
  pv: 'the PV array',
  totalCapex: 'total CAPEX',
};

/**
 * Decide which grants a scenario can claim and how much each is worth.
 * Grants are applied ONLY when every eligibility gate passes; otherwise they're
 * returned in `ineligible` with the reason, so the UI can show the full picture.
 */
export function computeSubsidies(
  ctx: SubsidyContext,
  grants: Record<string, Subsidy>,
): SubsidyResult {
  const applied: AppliedSubsidy[] = [];
  const ineligible: IneligibleSubsidy[] = [];

  for (const [id, g] of Object.entries(grants)) {
    const reject = (reason: string): void => {
      ineligible.push({ id, label: g.label, reason, source: g.source, sourceLabel: g.sourceLabel });
    };

    if (g.commercialOnly && ctx.scaleTier === 'hobby') {
      reject('commercial enterprises only — not a hobby/DIY setup');
      continue;
    }
    if (g.requiresHeatpump && !ctx.heatpump) {
      reject('needs a heat pump installed (turn Heat pump on)');
      continue;
    }
    if (g.requiresSolar && !ctx.solar) {
      reject('needs PV installed (turn Solar on)');
      continue;
    }
    if (g.minInvestment !== undefined && ctx.capex.total < g.minInvestment) {
      reject(`minimum investment of ${Math.round(g.minInvestment).toLocaleString('en-US')} (local currency) not reached`);
      continue;
    }

    const rawBase = baseFor(g.basis, ctx.capex);
    if (rawBase <= 0) {
      reject(`no eligible ${BASIS_LABEL[g.basis]} cost in this scenario`);
      continue;
    }

    const eligibleBase = g.capEligible !== undefined ? Math.min(rawBase, g.capEligible) : rawBase;
    let amount = eligibleBase * g.rate;
    if (g.capGrant !== undefined) amount = Math.min(amount, g.capGrant);

    applied.push({
      id,
      label: g.label,
      rate: g.rate,
      basis: g.basis,
      eligibleBase,
      amount,
      source: g.source,
      sourceLabel: g.sourceLabel,
      note: g.note,
    });
  }

  const total = applied.reduce((a, s) => a + s.amount, 0);
  return { applied, ineligible, total };
}

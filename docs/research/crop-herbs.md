# Cutting herbs — aquaponics feasibility

> **Verdict: 🟢 viable** · kind: crop · data id: `herbs`
>
> Community-evidence research (forums, grower blogs, user accounts, commercial cases), 2026-06.

## Summary

Cutting herbs are among the most consistently recommended and profitable aquaponics crops, but the three named species behave very differently, so lumping them into one "mix" overstates ease. Mint and parsley are reliably reported as easy, vigorous, perennial-or-multi-cut performers that thrive in the moist, warm raft environment. Coriander/cilantro is the outlier: practitioners repeatedly report it bolts "fast and furious," has a long ~50-55 day turn with limited yield, and is borderline on opportunity-cost in space-constrained systems. Mint is also flagged across nearly every source as aggressively invasive via rhizomes/runners, clogging media beds and overrunning neighbors unless physically isolated, which is a real labour/design cost in a coupled commercial raft. The Berlin-specific ECF rooftop farm validates strong German herb demand and retail channels but notably standardized on basil, not this trio.

## Pros

- Herbs broadly fetch 2-3x the wholesale price of lettuce and mature in 3-6 weeks, giving fast cash rotation; herbs are the dominant crop category in commercial aquaponics.
- Mint and parsley are repeatedly described by hobby and guide sources as easy/undemanding, vigorous, and cut-and-come-again, with mint returning perennially 'for the third year in a row' in at least one grower's beds.
- Parsley yields are credible at full raft density: ~52 plants/m2, 180-300 g/bunch = roughly 9-16 kg/m2, harvestable from ~30-45 days and re-cut every ~3 weeks.
- Warm aquaponic water and constant moisture suit mint and parsley well; mint stated optimum 18-24C matches the model's root-zone band.
- Strong, documented chef/retail demand for fresh herbs in Germany (ECF Berlin supplies basil to ~450 supermarkets), confirming the demand side of the model.
- Mint and parsley are noted as relatively pest-resistant and low-maintenance; coriander grows fast and is pest-resistant when it does not bolt.

## Cons

- Mint is invasive in nearly every source: spreads via rhizomes/runners, robs nutrients, overruns neighbors, and roots clog media/grow beds and bell siphons. Practitioners insist on isolating it in its own pot/section/system, which adds design and labour overhead in a coupled commercial raft.
- Coriander/cilantro bolts easily and early ('fast and furiously before I've used hardly a few sprigs'), especially in warm water; bolting turns it bitter. This directly conflicts with a fish-set warm water temperature.
- Cilantro has a long, low-yield turn (50-55 days seed-to-harvest; second cut yields drop). Upstart University explicitly warns of poor space-use efficiency and opportunity cost indoors/hydroponically.
- Coriander wants cooler 15-21C / low-70s F water and germinates best in the 60s F; a warm fish-driven system pushes it toward bolting, requiring slow-bolt varieties and frequent succession sowing.
- Parsley germinates slowly and erratically (1-4 weeks, needs pre-soak/moisture), slowing turnover vs the 45-day default if grown from seed in-system.
- Reported failure modes: cilantro Pythium/root rot with poor aeration, bacterial leaf spot and powdery mildew in humid greenhouse air; general media-bed clogging from dead roots/biofilm.
- Notably, the flagship Berlin aquaponics farm (ECF) standardized on basil, not mint/parsley/coriander, suggesting these specific three are not the obvious commercial default locally.

## Community evidence

- **[blog]** jessfuel.com grower blog — Harvest Fridays Aquaponics Update (https://www.jessfuel.com/harvest-fridays-aquaponics-update-the-fish/)
  — First-hand grower: mint comes back perennially 'for the third year in a row' and is a low-effort 'gift that keeps on giving,' while cilantro 'always bolts fast and furiously before I've used hardly a few sprigs' even with a slow-bolt variety. Concrete success/fail split within the named trio.
- **[commercial-case]** Upstart University (commercial vertical-farm training) — Are You Growing Cilantro in Hydroponics? (https://university.upstartfarmers.com/blog/are-you-growing-cilantro-in-hydroponics-read-this-first)
  — Commercial-grower guidance: cilantro 50-55 days seed-to-harvest, prefers cool 40-75F, bolts in heat, and 'may not get the highest space use efficiency... longer turn and limited yield' = real opportunity cost. Lists Pythium, bacterial leaf spot, powdery mildew as failure modes.
- **[forum]** Backyard Aquaponics forum — grow beds full of roots / roots stopping up bell siphon (http://www.backyardaquaponics.com/forum/viewtopic.php?f=1&t=13202)
  — Practitioners discuss vigorous root systems clogging media beds and siphons; BYAP workaround is giving the gravel guard a quarter-turn every couple weeks to cut invading roots — directly relevant to mint's aggressive rhizome/root habit.
- **[commercial-case]** Aquaponik-Manufaktur.de (German aquaponics builder) — Pflanzen in der Aquaponik (https://www.aquaponik-manufaktur.de/en/pflanzen-und-aquaponik/) and REKUBIK / Aquaponic-Deutschland
  — German-language sources: kitchen herbs (basil, coriander, parsley, chives) are the most profitable due to fast growth and high market price; but mint 'should be avoided' or grown in its own isolated system because 'it loves moisture, is in paradise in an aquaponics system, and will quickly overgrow' neighboring plants.
- **[commercial-case]** ECF Farm Berlin case (deutschland.de, certhon.com, ecf-farm.de)
  — Operating Berlin rooftop aquaponics farm: tilapia + basil over ~1,640 m2, ~7,500 pots/week, delivered to ~450 supermarkets. Validates German herb demand and retail logistics — but standardized on BASIL rather than mint/parsley/coriander, a signal about which herbs scale commercially here.
- **[blog]** Go Green Aquaponics — How to Grow Mint / Parsley / Herbs guides (gogreenaquaponics.com)
  — Mint 'spreads rapidly via underground rhizomes,' must be spaced 12-18 in or planted on bed borders to stop encroachment; water 65-75F (18-24C). Parsley described as simple/undemanding, plant 15-30 cm apart, multi-harvest like chives.
- **[forum]** Aquaponic Gardening (ning) forum — slow plant growth thread (https://aquaponicgardening.ning.com/forum/topics/slow-plant-growth)
  — Community note that a new aquaponic system takes ~6 months for nitrifying bacteria to mature before plants 'kick into overdrive' — early-cycle yields run below steady-state, relevant to ramp assumptions in a profitability model.

## Model check (vs `src/data` defaults)

Mixed match. (1) Yield 20 kg/m2/yr: parsley alone credibly supports ~9-16 kg/m2 per cut at high density with multiple annual cuts, and mint is vigorous, so 20 kg/m2/yr is plausible-to-optimistic IF the mix is mint+parsley-weighted; coriander drags the blended figure down hard (50-55 day turn, low/declining second-cut yield). A blended 20 is on the optimistic edge — coriander-heavy mixes likely fall short. (2) Days to first harvest 45: fine for mint (cut-and-come-again) and roughly OK for parsley once established, but coriander is realistically 50-55 days from seed and parsley germination alone can eat 1-4 weeks — 45 is optimistic if grown from seed in-system. (3) Root-zone temp 16-24C: good for mint and parsley; too warm for coriander, which wants ~15-21C and bolts above that — a fish-set warm tank actively works against cilantro. (4) Price 12 EUR/kg direct-sale: reasonable-to-conservative for fresh culinary herbs sold direct to chefs in Berlin (herbs run 2-3x lettuce; specialty fresh herbs often command more at retail). (5) Difficulty Medium: fair as a blend, but understates mint's invasiveness-management labour and coriander's bolting risk — coriander alone is closer to Hard/Challenging in a warm coupled system. Recommend splitting coriander out or down-weighting it, and adding an isolation/labour cost line for mint.

## Germany / EU notes

Strong German/EU demand and proven channels: ECF Farm Berlin (Schöneberg malt factory) runs a commercial tilapia+basil aquaponics operation supplying ~450 supermarkets with plastic-free 'Hauptstadtbasilikum,' confirming retail appetite for locally-grown aquaponic herbs in Berlin/Brandenburg. German aquaponics builders (Aquaponik-Manufaktur, REKUBIK, Aquaponic-Deutschland) all rank kitchen herbs (basil, coriander, parsley, chives) as the most profitable category, while explicitly warning to avoid or isolate mint because it overgrows the system. Seed/seedling sourcing is unproblematic — slow-bolt coriander and flat/curly parsley seed and herb plugs are widely available from EU horticultural suppliers. Winter-climate fit: a fish-coupled system keeps root-zone warm, favouring mint/parsley year-round, but Berlin winter light is the binding constraint (model already assumes supplementary lighting); coriander's preference for cooler water is a poor fit for a warm-water fish tank regardless of season. Note the local commercial signal: the flagship Berlin farm chose basil over this specific trio.

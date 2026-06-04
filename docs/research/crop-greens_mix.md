# Mixed leafy greens — aquaponics feasibility

> **Verdict: ✅ proven** · kind: crop · data id: `greens_mix`
>
> Community-evidence research (forums, grower blogs, user accounts, commercial cases), 2026-06.

## Summary

Mixed leafy greens (lettuce, chard, kale, spinach, rocket/rucola) are the single most-documented and most-recommended aquaponics crop, repeatedly described by hobby and commercial growers as the "easiest" and the highest-margin category (one industry source cites ~46% margin for leafy greens). They are light feeders that thrive on the relatively dilute nutrient load of coupled systems, and DWC/raft is the standard, beginner-friendly method, with 4-6 week seed-to-harvest cycles widely reported. The real-world caveats are consistent and well-known rather than fatal: chronic iron (and sometimes Ca/K) deficiency causing chlorosis/tip burn, lettuce bolting under heat or low light, and a temperature mismatch between warm-water fish (esp. tilapia at ~26-28°C) and lettuce's preferred cool root zone (8-22°C). For a Berlin/Brandenburg coupled system the verdict is "proven" provided fish species and supplementary winter light/heating are chosen to keep the root zone cool enough — which makes the model's stated 15-22°C band and supplementary-light note the load-bearing assumptions.

## Pros

- Universally cited as the best-suited, most forgiving aquaponics crop group; light/'Schwachzehrer' feeders well matched to dilute fish-water nutrients (multiple German and English sources)
- Fast turnover: forum and grower consensus is 4-6 weeks from transplant to harvest in DWC, enabling steady year-round rotation, which fits a calculator built on continuous cropping
- DWC/raft is the standard system and is explicitly described as the easiest setup for beginners, with low monitoring burden
- Highest profit margin of common aquaponics crops (an industry source quotes ~46% for leafy greens) and the crop most commercial aquaponic farms actually sell
- A mixed blend hedges risk: heat-tolerant summer crisps/butterhead, chard and kale tolerate warmer water and bolt less than head lettuce, so the 'mix' smooths out single-crop failures
- Pest pressure generally lower than soil; common pests (aphids, whitefly, slugs) are manageable with fish-safe methods (handpicking, ladybugs, diluted neem)

## Cons

- Iron deficiency is near-universal in coupled systems: chlorosis (yellow new growth, green veins) requires regular chelated iron dosing (DTPA preferred ~1-2 tsp/100 gal weekly, kept at pH 6.0-7.5) — one of the few additives nearly all practitioners agree must be supplemented
- Temperature mismatch with warm-water fish: tilapia want ~26-28°C while lettuce prefers 8-22°C; in a coupled system fish set the water temp, so warm fish push lettuce toward bolting and bitterness (well-documented tension)
- Bolting is the classic lettuce failure mode — triggered by heat, low light, and possibly low nitrate; growers call lettuce 'a pampered princess' and report rarely getting clean heads in hot conditions
- Tip burn (calcium-related) appears under fast growth/heat and high light; needs Ca management
- Berlin/Brandenburg winters require supplementary lighting (leafy greens want DLI ~17 mol/m²/day, 14-16h photoperiod) plus heating to hold both fish and root-zone temps — added energy cost the model should not under-count
- Commercial failure cases (Sweetwater Organics, Santa Cruz Aquaponics, and a turn-key lettuce farm that could only crop ~2 months/yr due to climate/temperature/humidity control) show economics and climate fit, not the crop, are the real risk

## Community evidence

- **[forum]** Aquaponic Gardening forum — Lettuce Bolting thread (aquaponicgardening.ning.com/forum/topics/lettuce-bolting)
  — Growers report heat and low light are the main bolting triggers; a Florida grower 'rarely ever got full closed heads'; recommend heat-tolerant summer crisp/buttercrunch over head lettuce in warm seasons; a Colorado grower got excellent winter lettuce in an unheated greenhouse — seasonal timing matters. One sums up lettuce as 'a pampered princess.'
- **[blog]** The Aquaponic Source / How To Aquaponic / That Aquaponics Guy (theaquaponicsource.com/iron-in-aquaponics, howtoaquaponic.com/plants/iron-deficiency)
  — Iron chlorosis is one of the most common deficiencies; kale shows it first (useful indicator). DTPA chelated iron at ~1-2 tsp/100 gal weekly recommended; EDDHA works but turns water red for weeks. Regular iron dosing is treated as mandatory, not optional, in coupled systems.
- **[blog]** How To Aquaponic — Lettuce guide (howtoaquaponic.com/plants/lettuce)
  — Practical first-hand spec: crop in 4-5 weeks, water 21-23°C, pH 5.8-6.2 (lettuce resilient outside it), ~7 inch (18 cm) spacing varying by variety, tip burn countered with higher calcium in summer, ladybugs/companion herbs for pests. No fertiliser besides fish water for this light feeder.
- **[academic]** ZipGrow / Upstart University / Wiley 2024 tilapia-lettuce literature review (zipgrow.com, university.upstartfarmers.com, onlinelibrary.wiley.com/doi/10.1155/2024/2642434)
  — Documents the core coupled-system tension: tilapia optimum ~26-28°C vs lettuce preferred ~18-22°C (cool-season 8-20°C). If ranges don't overlap, both yield sub-optimally; a 2024 review flags lack of an agreed joint optimum temperature as a research gap.
- **[commercial-case]** Nelson & Pade — Failures in Aquaponics + Go Green / Ceres commercial economics (aquaponics.com/nelson-and-pade-blog/failures-in-aquaponics)
  — Reviews real commercial failures (Sweetwater Organics, Santa Cruz Aquaponics; a lettuce farm sold a turn-key system that could only crop ~2 months/year due to climate/temperature/humidity). Failures traced to inexperience, bad design, weak business plans and climate mismatch — not the crop itself; leafy greens still cited as the highest-margin product (~46%).
- **[forum]** aquariumforum.de — 'Aquaponics meine Erfahrung' / aquaponic-deutschland.de
  — German hobbyist reports lettuce grows 'ziemlich gut' (quite well) when water is aerated, continuously running 8 lettuce heads in a 1 m nursery tank. Aquaponic-Deutschland lists Mangold (chard), spinach, Kopfsalat, Eisberg, endive, rucola, purslane as the best-functioning group — all 'Schwachzehrer' (light feeders) well supplied by fish water.
- **[commercial-case]** lets-grow.de — Wirtschaftlichkeit der Aquaponikanlage (German supplier economics blog)
  — German economic view: coupled aquaponics runs lower fish stocking (20-25 kg fish/1000 L) and more dilute nutrients than hydroponics, so plants grow slower than under concentrated hydroponic feed; profitability hinges on consumers paying a premium for pesticide-free/sustainable produce — no hard yield/price figures given.
- **[academic]** Low-tech European carp + leafy vegetables study & Savidov data (globalseafood.org advocate; researchgate Savidov 2010)
  — Provides real yield anchors: low-density aquaponic lettuce ~4 kg/m² per crop and Swiss chard ~5.3 kg/m², becoming comparable to hydroponics after the first cycle; commercial hydroponic lettuce reaches ~41 kg/m²/yr. Multi-cycle leafy-green output stacks across the year.

## Model check (vs `src/data` defaults)

Mostly consistent, with two figures worth flagging. (1) Yield 28 kg/m²/yr: plausible but optimistic for a COUPLED system. Per-crop aquaponic lettuce is reported ~4 kg/m² and chard ~5.3 kg/m²; at ~6 week cycles you'd run ~6-8 cycles/yr, so 24-40 kg/m²/yr is mathematically reachable, but only with near-continuous turnover, good light, and a leafy mix that includes higher-mass chard/kale. Pure dilute coupled systems grow slower than the hydroponic benchmark (~41 kg/m²/yr), so 28 sits at the upper-realistic end for Berlin even with supplementary light — treat as a best-case, not a default-conservative number. (2) Days to first harvest 38: consistent — growers report 4-6 weeks (28-42 days) transplant-to-harvest in DWC, so 38 days is reasonable if it includes a few days of seedling/nursery time; if it's meant as seed-to-harvest it's slightly tight (germination alone is 3-7 days + 4-6 weeks). (3) Root-zone temp 15-22°C: matches lettuce's cool preference (sources cite 8-22°C; some say 18-23°C optimal) — but this band is COOLER than warm-water fish like tilapia want (26-28°C), so the default implicitly assumes a cool/cold-tolerant fish (trout, carp, perch) or active cooling; this is the most important hidden assumption. (4) Price €4.5/kg direct-sale: reasonable-to-conservative for premium pesticide-free leafy greens in Germany; German sources agree profitability depends on premium pricing, so €4.5/kg is defensible at farm-gate/direct. (5) Seed cost €9/m²/yr and Difficulty Easy: align with practitioner consensus (cheap seed, easiest crop) — but 'Easy' understates the mandatory weekly iron dosing and bolting/temperature management, so 'Easy with active iron + temperature management' is the honest label.

## Germany / EU notes

Active German hobby and small-commercial scene: forums aquaponik-forum.de, aquariumforum.de, and info site aquaponic-deutschland.de all list leafy greens (Kopfsalat, Eisberg, Mangold/chard, Spinat, Rucola, Endivie, Portulak) as the best-performing group. Seed/seedling sourcing is trivial via standard German horticulture suppliers. Climate fit is the key issue: Brandenburg winters (low DLI, short days) force supplementary lighting (target DLI ~17 mol/m²/day, 14-16h) plus heating — meaningful energy cost in the German power-price context, and the lets-grow.de economic piece stresses profitability rests on premium 'pestizidfrei/nachhaltig' pricing rather than yield. Demand is favourable: strong German market for regional, pesticide-free salad and Bio greens supports the €4.5/kg direct-sale assumption. Regulation: coupled aquaponics produce can generally be sold as conventional/regional; EU organic (Bio) certification is problematic because EU organic rules require soil-based cultivation, so soilless aquaponic greens typically CANNOT be sold as certified Bio in Germany/EU — this caps the price premium versus marketing as 'regional/pesticide-free.' Fish choice matters for the cool root zone: cool-water species (trout, carp, perch/Zander) suit Brandenburg far better than tilapia and resolve the lettuce temperature mismatch.

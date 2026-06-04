# Swiss chard — aquaponics feasibility

> **Verdict: 🟢 viable** · kind: crop · data id: `chard`
>
> Community-evidence research (forums, grower blogs, user accounts, commercial cases), 2026-06.

## Summary

Swiss chard is one of the most consistently recommended "starter" leafy greens in aquaponics, and the practitioner consensus matches that reputation: it is robust, cold/frost-tolerant, comparatively bolt-resistant versus kale/lettuce, and well-suited to continuous cut-and-come-again harvest over 4-6 months from a single planting. A peer-reviewed low-tech carp aquaponics study (Italy) is the strongest real data point: chard hit 5.33 kg/m² marketable yield in a ~70-day cycle in the low-density coupled system, outperforming the hydroponic control by ~38% and showing better leaf color (higher SPAD/chlorophyll). The main reported risks are leaf-eating pests (leaf miner, caterpillars/moths, aphids) and occasional N/Mg-related yellowing in older leaves rather than disease or root rot. The big caveat for the Berlin/Brandenburg model: a single planting yields ~5 kg/m², so the 30 kg/m²/yr default is only reachable through multiple successive plantings or sustained cut-and-come-again across the whole year, which is plausible but at the optimistic end of what growers actually report.

## Pros

- Cold and frost tolerant (down to roughly -10C / 14F leaf tolerance), which fits a fish-set, cooler winter water temperature and Brandenburg climate better than warm-loving crops
- Continuous cut-and-come-again harvest: outer leaves cut, plant keeps producing for 4-6 months, giving a long harvest window per planting (matches the model's 'long continuous harvest window' note)
- More bolt-resistant than kale and lettuce per multiple grower sources, so less crop loss to premature bolting
- Documented to outperform hydroponic control in a coupled aquaponics study (5.33 vs 3.87 kg/m²) with better leaf color, i.e. fish-water nutrients are adequate
- Low nutrient demand ('Schwachzehrer' in German sources), forgiving for fluctuating fish-water nutrient levels, repeatedly listed as beginner/easy
- Few disease problems reported in fish water; root rot not commonly cited for chard specifically

## Cons

- Per-planting yield is modest (~5 kg/m² over ~70 days); reaching 30 kg/m²/yr requires many successive cycles or aggressive year-round cut-and-come-again, which is optimistic
- Leaf-eating pests are the dominant complaint: leaf miner, caterpillars/butterflies/moths, aphids; young plants benefit from fleece/mesh covering and labour for hand-picking
- Yellowing of older/lower leaves reported (nitrogen and magnesium deficiency, interveinal chlorosis) - a known watch-point in lower-nutrient fish water
- Slower to first usable cut than the model implies: grower guides cite ~12 weeks (84 days) to substantial leaf harvest, vs 48-day model default (35-48 days is realistic only for baby-leaf cuts)
- Large root mass and bolting eventually end the production run, requiring replanting and adding labour
- Germination needs warmth (25-30C), so seedlings should be started off-system in a propagator before transplanting

## Community evidence

- **[academic]** Effect of stocking density on European carp and leafy vegetables in a low-tech aquaponic system (Aquaculture Reports / PMC6542511) https://pmc.ncbi.nlm.nih.gov/articles/PMC6542511/
  — Swiss chard marketable yield 5.33 kg/m² (low-density AP) > 4.17 (high-density AP) > 3.87 (hydroponic control); ~70-day cycle (Aug 29-Nov 7), median water temp ~21C, lower during the chard cycle. Aquaponics beat hydroponics by ~38% and chard had higher chlorophyll (SPAD); no chard deficiency symptoms reported. Real coupled-system data.
- **[forum]** Backyard Aquaponics forum thread 'Swiss chard problems' (t=26326) http://www.backyardaquaponics.com/forum/viewtopic.php?f=3&t=26326
  — A grower posted a dedicated thread about chard problems in their system; the existence of recurring chard-problem threads (yellowing/deficiency, pest damage) shows it is not entirely trouble-free even though it is rated easy. (Page now redirects/cert-broken; surfaced via search index.)
- **[blog]** Aquaponic Sauce grower blog - How to Grow Swiss Chard http://aquaponicsauce.blogspot.com/2016/07/how-to-grow-swiss-chard-in-your-aquaponics-system.html
  — Reports chard is 'extremely well suited' and 'fairly bolt-resistant, making it a better choice than plants such as kale.' Harvest of external leaves ~12 weeks after sowing; germinates in 4-5 days at 25-30C; optimum 16-24C, shade above 26C. Pests called out: butterflies, moths, leaf miner - cover young plants with fleece/mesh.
- **[blog]** Aquaponics Grow - Swiss Chard Aquaponics https://aquaponicsgrow.com/swiss-chard-aquaponics/
  — Frames chard as a scalable continuous-harvest crop suited to small commercial aquaponics (restaurants/markets); cut-and-come-again outer-leaf harvesting every 1-2 weeks, varieties like 'Bright Lights' producing continuously for 4-6 months, ~0.5-1.0 lb (225-450g) fresh leaves per mature plant per week until bolting or oversized root mass.
- **[commercial-case]** Low-tech aquaponic production of European carp and leafy vegetables - Global Seafood Alliance https://www.globalseafood.org/advocate/low-tech-aquaponic-production-of-european-carp-and-leafy-vegetables/
  — Industry write-up of the carp+chard trial confirming chard as a high-biomass leafy crop with competitive yields (~5 kg/m²) in a low-input coupled system using carp - directly relevant to a coupled non-tilapia (cooler-water) Berlin setup.
- **[blog]** REKUBIK Magazin (DE) - Die besten Aquaponik-Pflanzen https://www.rekubik.de/magazin/die-besten-aquaponik-pflanzen/
  — German source lists Mangold (chard) among proven aquaponics varieties; classed as a Schwachzehrer (low nutrient demand), grows fast and uncomplicated in nearly any hydroponic/aquaponic system - confirms German-market familiarity and beginner suitability.
- **[blog]** Aquaponic Deutschland / German grow guides - Mangold https://aquaponic-deutschland.de/diese-pflanzen-funktionieren-im-aquaponic-system/
  — German guides call Mangold frost-hardy and an ideal beginner/starter plant with low nutrient needs, harvestable whole or partially ~4-5 weeks after sowing (baby-leaf), with documented year-round harvest of kilos of chard in a home system.
- **[forum]** Permies cold-weather aquaponics thread https://permies.com/t/35319/Blog-Cold-Weather-Aquaponics & winter-crop guides
  — Chard repeatedly listed among the cold-hardy crops that keep producing through winter/low water temps (tolerating roughly -10C), outlasting warm-season crops - supports viability in a Brandenburg winter with supplementary light.

## Model check (vs `src/data` defaults)

Yield: Real-world single-cycle data is ~5.3 kg/m² over ~70 days (peer-reviewed coupled system). The 30 kg/m²/yr default implies ~4-6 successive cycles or sustained year-round cut-and-come-again at the high end of grower reports; reachable in a heated/lit greenhouse but optimistic - a 15-25 kg/m²/yr figure would be safer/conservative. Days to first harvest: model says 48; grower guides cite ~12 weeks (~84 days) for substantial outer-leaf harvest and 4-5 weeks (~28-35 days) only for baby-leaf cuts - 48 days is a reasonable midpoint but slightly fast for full leaves. Temperature: model's 15-24C root zone matches reported optimum (16-24C, germination warmer at 25-30C) and chard's cold tolerance is a bonus for fish-set cool water - good fit. Difficulty Easy: supported by the consensus (Schwachzehrer, beginner crop), though pests (leaf miner, caterpillars, aphids) and N/Mg yellowing are real, so not entirely effort-free. Price €5/kg and seed cost €7/m²/yr were not contradicted by sources (no specific German chard farmgate price found). System Media/Raft: confirmed - chard performs in both media beds and DWC rafts.

## Germany / EU notes

Chard (Mangold) is a well-established, popular vegetable in Germany and appears across German-language aquaponics guides (REKUBIK, Aquaponic Deutschland, Phoster CH) as a proven, beginner-friendly Schwachzehrer, so seed/seedling sourcing is trivial (standard German seed suppliers; cold-hardy varieties readily available). Its frost/cold tolerance (to roughly -10C) is a strong fit for a Berlin/Brandenburg coupled system where fish hold water cooler in winter - chard is repeatedly cited as a winter/shoulder-season crop that keeps producing when warm-season crops stop, reducing reliance on supplementary heat (light still needed for winter day length). Market demand exists (Mangold sells at German markets/restaurants, especially colorful 'Bright Lights'/Regenbogen types), though it is a lower-volume specialty green than spinach/lettuce, so direct-sale/restaurant channels suit it better than wholesale. No specific German farmgate price found to validate the €5/kg default.

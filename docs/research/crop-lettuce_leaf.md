# Baby leaf lettuce — aquaponics feasibility

> **Verdict: ✅ proven** · kind: crop · data id: `lettuce_leaf`
>
> Community-evidence research (forums, grower blogs, user accounts, commercial cases), 2026-06.

## Summary

Leaf/butterhead lettuce is the single most-documented and most reliable aquaponics crop, with countless hobby successes and the largest commercial aquaponics operations (including in Berlin) built around salad. Berlin-based research (IGB Leibniz) showed decoupled aquaponic lettuce matched hydroponic yields at ~325 g/head over a 7-week cycle, and ECF Farmsystems sells aquaponic/hydroponic salad mixes into ~140 REWE stores across Berlin/Brandenburg. The real-world caveats are about temperature and water management rather than whether it works: bolting and tip-burn appear when air/water runs warm, while cold/over-saturated roots cause slow growth and rot, and Pythium root rot is the main disease risk. The model's "Easy, fast, good margins" framing is accurate, but its 25-day-to-harvest, 15-20°C root-zone, and 25 kg/m²/yr defaults are optimistic versus what practitioners actually report (closer to 5-7 week cycles, 20-24°C ideal, and yields that swing heavily with winter light).

## Pros

- Most proven aquaponics crop: dominates both hobby forums and commercial operations (ECF Berlin, REWE rooftop, hundreds of supermarkets)
- Fast cycle and forgiving: growers consistently report 4-7 week crops; lettuce is rated 'fairly robust' to pH variation (tolerates ~5.8-6.5)
- Raft (DWC) and NFT both work well and provide the root aeration lettuce needs; constant nutrient access drives growth 2-3x faster than soil
- Aquaponic water can actively suppress Pythium root rot (microbial suppressiveness documented), a disease advantage over sterile hydroponics
- Berlin IGB study confirms aquaponic lettuce yield/quality equals hydroponics while replacing ~85% of nitrogen fertilizer and all nutrient-solution water
- Strong, year-round Berlin/Brandenburg market for salad mixes already served by aquaponics (ECF -> ~140-700 REWE stores)

## Cons

- Bolting is the recurring failure mode: triggered by warm air/water, dryness, and excess light; warm-climate growers must switch to summer-crisp/butterhead varieties or chill the water
- Tip burn (calcium deficiency, driven by low transpiration/airflow rather than raw Ca) is a common quality defect, especially in dense rafts and warm conditions
- Cold + over-saturated roots cause slow growth and rot: German growers running 15-18°C water and media beds reported lettuce 'no progress', rotting lower leaves; raft/NFT fixed it
- Pythium root rot risk rises with warm nutrient water (23-35°C) and low dissolved O2; needs >6 ppm DO, ideally 8-9 ppm
- Winter in Berlin is the economic weak point: low DLI sharply cuts yield, and research notes low winter harvests can render year-round production unprofitable without supplemental LED (400-600 umol/m2/s target)
- Fish (esp. omnivores like tilapia) nibble exposed roots in coupled rafts, damaging plants
- Fish water is phosphorus-limited: even the Berlin study still needed P supplementation for full yields

## Community evidence

- **[forum]** Aquaponic Gardening (ning) forum - Lettuce Bolting thread, https://aquaponicgardening.ning.com/forum/topics/lettuce-bolting
  — Experienced growers (incl. TCLynx in Florida) report heat/dryness as the main bolting trigger; closed-head varieties fail in warm climates, summer-crisp and buttercrunch do better. One grower's Chop2 system grew 'amazing' lettuce while a co-located DWC struggled, showing lettuce's sensitivity to setup.
- **[forum]** aquaponik-forum.de - 'Salat zu nasse oder zu kalte Fuesse', https://aquaponik-forum.de/Thread-Salat-zu-nasse-oder-zu-kalte-Fuesse
  — German hobby grower running 15-18C water saw lettuce make 'no progress' in flood-and-drain beds with rotting lower leaves (Red Romaine, Black Seeded Simpson). Root causes: media kept roots constantly saturated plus a botched cycling phase (high pH/ammonia/nitrite). Moving to raft/NFT for better root aeration resolved it.
- **[academic]** PLOS One (IGB Leibniz, Berlin) - Salanova lettuce in decoupled aquaponics, https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0218368
  — Berlin study with Nile tilapia at 25C: green butterhead reached ~323-332 g/head over a 7-week cycle at 10 plants/gully, no significant growth difference vs hydroponics. Still required phosphorus supplementation; N fertilizer cut ~85%.
- **[commercial-case]** biooekonomie.de / ECF Farmsystems Berlin rooftop, https://biooekonomie.de/en/news/rewe-fresh-salad-supermarket-roof
  — ECF Farmsystems (Berlin) building a 2,760 m2 indoor salad farm targeting 900,000+ salad mixes/yr, year-round, distributed to up to 700 supermarkets; their existing site grows basil + perch. Demonstrates real commercial salad demand and viability in the exact Berlin/Brandenburg market.
- **[blog]** How To Aquaponic - Lettuce guide, https://www.howtoaquaponic.com/plants/lettuce/
  — Practitioner-facing numbers: 4-5 weeks to harvest, ideal water temp 21-23C, pH 5.8-6.2, ~1 plant per 7 inches; flags tip burn (calcium) and aphids as main issues, recommends DWC raft for continuous oxygenated water.
- **[academic]** MDPI Microorganisms - aquaponic water suppressiveness vs Pythium, https://doi.org/10.3390/microorganisms8111683
  — Aquaponic water showed microbial suppressiveness against Pythium aphanidermatum lettuce root rot, suggesting a real disease-resistance advantage of coupled aquaponics over sterile hydroponic solution.
- **[forum]** Multiple German forums (aquariumforum.de, hobby-gartenteich.de, selbstvers.org) via search
  — German hobbyists report lettuce 'grows well when aerated' but warn systems need 6-12 months to stabilize; one user saw lettuce reach only 2-3 cm after 3-4 weeks in an immature system, underscoring that the model's 25-day harvest assumes a mature, well-tuned system.
- **[commercial-case]** Upstart University - Best crops for raft (DWC) systems, https://university.upstartfarmers.com/blog/best-crops-for-raft-systems
  — Lettuce is listed as a top raft crop and beginner-friendly; commercial guidance confirms raft DWC as the standard high-throughput method for leafy greens.

## Model check (vs `src/data` defaults)

Mixed - direction is right but several defaults are optimistic. (1) Days to first harvest: model says 25; practitioners and the Berlin IGB study report ~28-49 days (4-5 wk hobby guides, 7 wk for full butterhead heads). 25 days is achievable only for true baby-leaf / first cut-and-come-again in a mature, warm, well-lit system; treat 30-35 days as more realistic and longer in Berlin winter. (2) Root-zone temp: model says 15-20C, but real-world ideal is 20-24C (howtoaquaponic 21-23C; IGB ran 25C with tilapia; Pythium dissotocum is actually favored by lower temps). A German grower at 15-18C got stalled, rotting lettuce. Note that in coupled aquaponics the FISH set temperature - tilapia push 24-28C (warm side = bolting/Pythium risk), trout/perch push 12-18C (cold side = slow growth). 15-20C is a compromise neither common fish gives cleanly. (3) Yield 25 kg/m2/yr: plausible as a multi-cycle annual figure (IGB ~325 g/head, 10 heads/gully, high cycle count), and well below the 41 kg/m2/yr hydroponic greenhouse benchmark - but it implicitly assumes near-year-round output. Berlin winter low-DLI months drop yields sharply, and research warns winter harvests can be unprofitable without supplemental LED, so the annual average should be haircut unless winter lighting cost is modeled. (4) Price 6 EUR/kg and seed cost 10 EUR/m2/yr: not contradicted by sources (no grower price data surfaced); 6 EUR/kg is reasonable for direct-sale premium leaf in Germany. (5) Difficulty 'Easy' and 'high cycle count, good margins': supported - lettuce is the benchmark easy aquaponics crop, but 'Easy' should carry the asterisk that temperature/airflow/DO control separates success from bolting, tip burn, and root rot.

## Germany / EU notes

Highly favorable Germany/EU fit. Berlin is arguably the global hub for commercial aquaponic salad: ECF Farmsystems (Berlin-Schoneberg, founded 2012) supplies basil/salad + perch to ~140 REWE stores across Berlin/Brandenburg/Mecklenburg-Vorpommern, and is opening a 2,760 m2 rooftop salad farm (Lankwitz) targeting 900,000+ salad mixes/yr to up to 700 supermarkets - direct proof of market demand and regulatory/retail acceptance in the exact target region. Foundational agronomy comes from the IGB Leibniz Institute in Berlin (Salanova decoupled-aquaponics study). Seed sourcing is trivial in the EU (standard lettuce varieties; Salanova/multileaf and summer-crisp types widely available). The key Germany-specific risk is winter: Berlin/Brandenburg low solar DLI from roughly November-February sharply cuts growth, so supplementary LED (target 400-600 umol/m2/s, ~16h photoperiod) is essential for year-round output and is the main cost/feasibility swing factor. In coupled systems the fish choice also matters for EU/German climate: tilapia (warm, ~25C) favors fast lettuce but risks bolting/Pythium, while cold-water perch/trout keep roots cooler but slow growth - relevant since the prompt notes fish set water temperature.

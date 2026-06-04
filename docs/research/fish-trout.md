# Trout — aquaponics feasibility

> **Verdict: 🟢 viable** · kind: fish · data id: `trout`
>
> Community-evidence research (forums, grower blogs, user accounts, commercial cases), 2026-06.

## Summary

Trout (mostly rainbow, some brook) is a well-trodden cold-water aquaponics species and works reliably wherever growers can hold water at 10-16°C with strong aeration and high flow. Multiple hobby and small-scale growers report successful harvests of ~0.5-1 kg fish, and the species is repeatedly recommended for cold/Nordic winters - which fits Berlin/Brandenburg. The hard constraints growers hit are summer heat (water above ~18-20°C stalls growth, above 22°C harms digestion) and dissolved oxygen, which trout need at high levels (5.5-8 mg/L) and which collapses exactly when water warms - so a Berlin coupled farm would need active cooling or a cool source for summer. The bigger caution for the calculator is economic: German practitioner blogs and the Berlin Baganz multi-loop study show carnivorous-fish aquaponics struggles to be profitable at small scale, and ex-farm/wholesale trout prices in Germany are well below the model's €14/kg unless sold direct/smoked.

## Pros

- Genuinely cold-water: thrives at 10-16°C, repeatedly recommended as the go-to winter/Nordic-climate aquaponics fish, so Berlin/Brandenburg winters need little or no heating
- Many documented hobby harvests (e.g. Permies grower harvesting brook trout at ~1 lb each through a sub-zero winter; multiple 'fourth-year, year-round' systems reported)
- Fast grower with good feed conversion - practitioner/guide consensus FCR ~1.0-1.5, close to the model's 1.1; reaches pan/market size in 8-13 months
- High market value and clean-tasting flesh from clean cool water; strong direct-sale and smoked-product premium in German-speaking markets
- Juveniles/fingerlings are readily bought from established trout hatcheries across Germany/Austria (model's 'bought not bred' assumption holds)

## Cons

- Dissolved oxygen is the recurring killer: trout need 5.5-8 mg/L, requirement rises 5-6x as water warms, and DO falls as temperature rises - summer fish kills are the classic failure mode; demands robust aeration/redundancy
- Summer heat is the binding constraint in continental climates like Brandenburg: growth stalls above ~18°C and digestion suffers above 22°C, so summer chilling or a cool water source is effectively mandatory - adds cost and a single-point-of-failure
- Needs much higher water flow/turnover than tilapia (natural-stream species; some sources cite 4-5 tank volumes/day), so higher pumping energy
- Low safe stocking density (commonly cited ~0.5 kg/100 L for hobby; organic standards ~20-25 kg/m³) limits biomass per tank vs warm-water fish
- System fragility reported by real growers: 'pumps, heaters/chillers, power, biofilters will all fail'; one grower had a 'catastrophic plumbing fail' once adult trout overwhelmed the filter
- Economics are shaky at small scale: German blogger and Berlin Baganz study both find carnivorous-fish aquaponics hard to make profitable without large scale; sourcing sustainable carnivore feed is a noted pain point

## Community evidence

- **[forum]** Permies aquaponics forum - 'harvest of nine more Brook trout' (Brian Rodgers) https://permies.com/t/95059/harvest-Brook-trout
  — Stocked 100 brook trout fingerlings in a 2,600-gal tank; harvested batches of ~1-lb fish through a winter with outside temps near zero and was 'quite happy.' But once fish reached adult size they 'overwhelmed the system,' forcing a new radial filter + dual air-lift pumps after his 'first catastrophic plumbing fail'; also ran out of feed and substituted cat food, and lost a fish that jumped the tank. Shows it works but the system must be sized for adult biomass and oxygen demand.
- **[forum]** Permies fish forum - '14,000 gal system; Tilapia vs Trout' https://permies.com/t/211860/gal-system-Tilapia-Trout
  — Growers conclude trout need 'cool, clean, highly oxygenated water' and are hard to keep in basic setups especially in summer, vs tilapia tolerating warm/turbid/stagnant water. Consensus: reserve trout for operations with reliable temperature control (cool source or greenhouse) and expect lower stocking density but higher price. Repeated warning that 'pumps, heaters/chillers, power supplies, and bio-filters will fail.'
- **[blog]** heim-aquaponik.de - 'Warum ich etwas mit Aquaponik hadere' (Arne Möller, German hobbyist) https://www.heim-aquaponik.de/warum-ich-etwas-mit-aquaponik-hadere/
  — German practitioner's reservations: hobby IBC systems (600-800 L with hundreds of fish) are 'fragile, not stable' without professional monitoring; finding ecologically responsible feed for carnivorous fish is hard (depleted wild stocks); organic aquaculture caps density at 20-25 kg/m³ vs commercial 250 kg/m³. Tempers expectations on both welfare and economics for carnivore aquaponics.
- **[blog]** aquaponik-eigenbau.de blog - 'Regenbogenforelle - Anforderungen an die Aquaponik' (German DIY grower) http://www.aquaponik-eigenbau.de/blog/regenbogenforelle-anforderungen-an-die-aquaponik
  — German grower stresses trout need strong current (a circulation pump) and that water above 18°C is not optimal - 'in summer you may even have to cool the IBC.' Cites classic trout farming inflow of ~1 L/s and turning over tank volume 4-5x/day, and that water quantity, quality and oxygen demands are far higher than warm-water fish. Directly relevant to Brandenburg summers.
- **[blog]** ofera.at blog - 'Forellen in der Aquaponik? Ja, es funktioniert!' (Austrian) https://ofera.at/.../forellen-in-der-aquaponik-ja-es-funktioniert
  — Operator states he ran an indoor trout aquaponics system 'over several seasons' and concludes it works, with a companion video on harvesting/processing trout. (Full operational detail was behind an 'article being updated' notice, but the headline practitioner verdict from a German-speaking grower is affirmative for an indoor/temperature-controlled setup.)
- **[academic]** Baganz et al. 2020, 'Profitability of multi-loop aquaponics' (HU Berlin / IGB, Berlin) https://edoc.hu-berlin.de/items/dbc8d358-1ebf-451e-9318-2f9407990d13
  — Berlin double-recirculation (multi-loop) aquaponics, ~540 m², one year of real production data: the as-built system was NOT profitable. Only after >3x greenhouse enlargement and big productivity gains did an ex-ante scenario reach profitability with a ~12-year payback; a ~2,000 m² model case is the realistic professional scale. Strong caution that small coupled systems in the exact target region struggle economically.
- **[commercial-case]** Go Green Aquaponics / HowtoAquaponic practitioner guides https://www.howtoaquaponic.com/fish/rainbow-trout-aquaponics/
  — Practical figures growers work to: optimum growth only 12-16°C, market size (~40 cm) ~9 months and pan-size ~12-13 months, min DO 5.5 mg/L, hobby stocking ~0.5 kg/100 L, and main failure modes = oxygen demand, expensive summer cooling, and needing far higher flow than tilapia.

## Model check (vs `src/data` defaults)

Temperature band (10-16°C): MATCHES practitioner reports almost exactly - optimum growth cited at 12-16°C, with stress above 18-22°C. Good. FCR 1.1: PLAUSIBLE/slightly optimistic - guides cite 1.0-1.5 typical (best-case 0.8 on high-energy feed), so 1.1 is achievable but at the favorable end for a coupled (lower-DO, lower-temp-control) system; 1.2-1.3 may be more realistic. Grow-out 14 months: CONSERVATIVE/long - growers report pan/market size in 8-13 months (often ~9 months to ~40 cm). 14 months likely targets a larger fish or accounts for slow cold-water winter growth in an unheated Berlin system, which is defensible but could be shortened. Price €14/kg: OPTIMISTIC for generic sale - German whole fresh trout runs ~€10/kg ex-farm/retail baseline; wholesale is ~30% below retail and resale gets 14-22% discount (Bavaria data). €14/kg is only realistic via direct-to-consumer/farm-gate or value-added (smoked trout reaches €30+/kg, fillet €18-43/kg). For a coupled farm relying on direct sale the €14/kg is defensible but assumes no wholesale channel. Difficulty 'Medium': REASONABLE but lean toward Medium-Hard given the DO/summer-cooling single-point-of-failure risk that growers repeatedly flag. Juvenile cost: not contradicted - fingerlings are commercially available (Austrian price list showed ~€22/kg for 14-16 cm rainbow trout fingerlings, i.e. juveniles are a real bought input).

## Germany / EU notes

Strong fit for Germany/EU. Fingerlings/Setzlinge are readily bought from numerous German and Austrian trout hatcheries (e.g. Fischerei Pichler price list shows rainbow trout fingerlings ~€22/kg at 14-16 cm), so the 'juveniles bought not bred' assumption is correct. Cold Berlin/Brandenburg winters are an advantage - trout is the canonical cold/Nordic-climate aquaponics fish needing little heating - but continental summers are the real risk: water regularly exceeding 18-22°C means active chilling or a cool groundwater source is likely required, adding cost/energy. Regulation: organic/EU welfare guidance caps trout stocking density (~20-25 kg/m³), constraining biomass; carnivore feed sustainability is a flagged concern. Market demand is solid - trout (Forelle) is a familiar, high-value table fish; German ex-farm/retail whole-fish ~€10/kg with strong direct-marketing and smoked-product premiums (smoked ~€30/kg, fillet €18-43/kg), and a clear Bavaria-documented price gradient where wholesale sits ~30% below retail. Most directly relevant: the Berlin (HU/IGB) Baganz multi-loop study shows coupled aquaponics in this exact region is hard to make profitable below ~2,000 m² scale.

# Rocket / Rucola — aquaponics feasibility

> **Verdict: 🟢 viable** · kind: crop · data id: `rocket`
>
> Community-evidence research (forums, grower blogs, user accounts, commercial cases), 2026-06.

## Summary

Rocket/rucola is one of the most consistently recommended aquaponics leafy greens: fast (first cut ~21-28 days), low nutrient demand, shallow roots well-suited to raft/NFT, and amenable to cut-and-come-again. The dominant real-world failure mode is not disease but temperature-driven bolting and bitterness: practitioners agree it bolts and turns unpleasantly bitter once water/air exceeds roughly 21-24°C (70-75°F) or day length passes ~14h. This is the central risk for a COUPLED Berlin system, because the fish set the water temperature — warm-water species (tilapia ~26-28°C) would sit well above rucola's 12-20°C comfort band and force bolting, whereas cool-water fish (trout/perch) match it almost perfectly. Secondary risks are flea beetles/aphids (rucola is a flea-beetle magnet as a brassica) and the usual aquaponic iron deficiency at fish-friendly pH >7. Economically the model's €11/kg only holds for premium/organic packaged direct sale, not bulk.

## Pros

- Genuinely fast and forgiving: practitioners report germination in 3-10 days and first cut at 21-28 days, matching its 'easy' reputation
- Low nutrient demand and shallow roots make it well-matched to raft/DWC and NFT (no deep media bed needed) — repeatedly named a 'proven' aquaponics crop
- Cut-and-come-again works: multiple sources report 2-4 cuts per sowing if you leave the central 3-4 leaves and harvest frequently
- Cool-season preference (15-21°C / 12-20°C root zone) aligns well with cool-water fish and with Berlin's climate outside summer
- Premium peppery product with strong demand in German salad/mix market; organic packaged sells at a high per-kg equivalent

## Cons

- Bolting/bitterness is the #1 reported problem: above ~21-24°C or >14h daylight it bolts fast, leaves turn intensely bitter and tough, and the harvest window 'slams shut' — directly conflicts with warm-water fish in a coupled system
- As a brassica it is a strong flea-beetle and aphid attractant; growers report chewed leaves needing row covers/neem, harder in open greenhouse settings
- Cut-and-come-again yield declines after 2-4 cuts and leaves get coarser/spicier, so continuous output relies on staggered re-sowing (labour)
- Iron deficiency (interveinal yellowing of young leaves) is common in fish-driven water at pH >7, requiring chelated iron dosing
- Needs light to germinate and fails to germinate if too warm — summer establishment in a warm fish loop is unreliable
- €11/kg is optimistic versus German conventional rucola (~€2.20-6.60/kg wholesale/loose retail); only premium/organic branded packs reach that level

## Community evidence

- **[blog]** Grow Your Health Gardening (Tower Garden grow guide by hydroponic grower Erin Castillo) https://growyourhealthgardening.com/2021/02/27/grow-guide-growing-your-own-arugula-in-a-hydroponic-or-aeroponic-tower-garden/
  — First-hand: transplants at 2-3 weeks, baby-leaf in ~4-6 weeks; runs cut-and-come-again leaving the center 3-4 leaves; recommends pulling plants at 5-6 weeks before they get too spicy/bolt; warns it 'may fail to germinate if it's too warm', so plants on a 4-5 week staggered rotation and favours spring/fall over summer.
- **[blog]** GrowAI / hydroponic arugula temperature guide https://growai.shop/guides/arugula-growing-guide.html
  — Practitioner thresholds: keep reservoir below 68°F (20°C) and air 55-65°F for peppery-not-bitter flavour; >75°F for a few consecutive days triggers bolting and ramps bitter glucosinolate production. Names bolt-resistant cultivars Astro, Runway, Apollo.
- **[blog]** Hydroponicks.co DWC arugula beginner guide https://www.hydroponicks.co/learn/setting-up-hydroponicks-dwc-system-for-arugula-a-beginners-guide
  — DWC-specific: germinate cool (~65°F) 7-10 days, first cut at 3-4 inches around 21-28 days after germination; target water/air 15-21°C. Confirms model's ~25-day first-harvest figure if counted from germination.
- **[blog]** Go Green Aquaponics – best plants / pest control https://gogreenaquaponics.com/blogs/news/organic-pest-control-in-aquaponics
  — Rucola listed among proven low-nutrient aquaponics greens but flagged for flea beetles and aphids on young plants; recommends row covers, sticky traps, neem in the evening, prompt removal of infested leaves and strong airflow.
- **[blog]** Go Green Aquaponics iron-deficiency guide / Aquaponics Source https://www.theaquaponicssource.com/iron-in-aquaponics/
  — Iron deficiency is one of the most common aquaponic problems for leafy greens because fish waste supplies little iron and pH >7 locks it up; young leaves yellow with green veins. Fix with chelated iron (EDDHA/DTPA) ~2 mg/L — relevant since rucola sits in fish-set, often alkaline water.
- **[blog]** REKUBIK Magazin – Die besten Aquaponik-Pflanzen (DE) https://www.rekubik.de/magazin/die-besten-aquaponik-pflanzen/
  — German-language source lists Rucola among top aquaponics plants: cool-weather lover, needs part shade in warm weather or it turns bitter, pH 6.0-7.0, ~4-6 weeks to first harvest, up to ~4 cuts, roughly 100-150 g per plant per cut, ideal for NFT/raft due to short roots.
- **[commercial-case]** lieferanten.de / Selina Wamucii German rucola price data https://www.selinawamucii.com/de/einsichten/preise/deutschland/rucola/
  — German conventional/wholesale rucola roughly €2.20-6.60/kg; organic carries a premium. Indicates the model's €11/kg is only achievable via premium organic packaged direct sale, not bulk wholesale.
- **[commercial-case]** Upstart University – best crops for raft systems https://university.upstartfarmers.com/blog/best-crops-for-raft-systems
  — Commercial DWC reference: arugula 'Astro' yielded ~12 oz saleable fresh weight per square foot when germinated 3 days then floated ~10 days; positions arugula as a fast, high-turnover raft crop (supports high annual kg/m² with rapid cycling).

## Model check (vs `src/data` defaults)

FCR: n/a (crop, not fish). Days to first harvest: model 25 days is realistic ONLY if counted from germination — practitioners consistently report 21-28 days from germination, or 4-6 weeks total when counted from sowing/transplant; so 25 is on the optimistic edge but defensible for a raft/NFT first baby-leaf cut. Root-zone temp: model 12-20°C matches grower guidance almost exactly (cool-season, keep reservoir <20°C/68°F; bolting above ~21-24°C). CRITICAL coupled-system caveat: fish set the water temperature, so this 12-20°C band is only achievable with COOL-water fish (trout, perch, char); warm-water tilapia/catfish at 26-28°C would push root-zone temp far above the band and reliably trigger bolting and bitterness — the model should flag temperature compatibility with the chosen fish. Yield 22 kg/m²/yr: plausible-to-optimistic; achievable via fast staggered cycles and 2-4 cuts, but real cut-and-come-again output declines after a few cuts and bolting/pests shorten windows, so 22 likely assumes near-ideal cool conditions and tight rotation labour. Price €11/kg: high vs German conventional/wholesale rucola (~€2.20-6.60/kg) but realistic for premium organic packaged direct sale. Difficulty 'Easy': fair for the growing itself, but the bolting/temperature constraint and flea-beetle pressure make it less 'set-and-forget' than the label implies in a fish-temperature-driven loop. System Raft/NFT: well supported by sources (short roots, fast turnover).

## Germany / EU notes

Seed sourcing is easy in Germany (e.g. Bingenheimer Saatgut offers organic/Demeter rucola seed; Eruca sativa salad-rocket and Diplotaxis tenuifolia wild-rocket both common). Strong existing market demand: rucola is a salad-mix staple in German retail and gastronomy, sold as organic packs (~80-100g) at REWE/Bringmeister and via wholesalers (lieferanten.de lists ~26 rucola / 4 organic-rucola wholesalers). Conventional wholesale/loose price ~€2.20-6.60/kg means the €11/kg model price requires premium organic, locally-grown, pesticide-free direct-to-restaurant/market positioning. Climate/coupled-system fit for Berlin/Brandenburg is favourable in spring/autumn and good year-round IF the system uses cool-water fish (trout/perch/char) keeping root zone in the 12-20°C band; summer plus warm-water fish would cause bolting and bitterness. Winter: rucola is cold-tolerant and grows in cool greenhouses, but Berlin winter light is low — the planned supplementary lighting helps, and keeping photoperiod ≤12-14h actually doubles as bolting control. No regulatory barriers to growing/selling rucola.

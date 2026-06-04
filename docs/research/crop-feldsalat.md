# Lamb's lettuce (Feldsalat) — aquaponics feasibility

> **Verdict: 🟢 viable** · kind: crop · data id: `feldsalat`
>
> Community-evidence research (forums, grower blogs, user accounts, commercial cases), 2026-06.

## Summary

Feldsalat is genuinely cold-hardy and is repeatedly named by German and English-speaking aquaponics/hydroponics growers as one of the few crops that keeps producing through cold-water-fish winters (trout, carp), so the basic agronomy works. The recurring practitioner complaint is not that it dies, but that the effort-to-yield ratio is poor: it is a tiny plant, grows slowly (~6 weeks reported in an ebb-and-flow trial, longer in winter), and has a very narrow harvest window — miss it by a few days and the crop is lost. Multiple growers (notably hydroponiks.de and the senfberg-linked report) conclude it is not worth growing relative to head/leaf lettuce on a hobby system, and judge commercial production "kaum lohnenswert" once lighting and climate control are counted. However, the economics flip on the price side: real German Bioland direct-sale Feldsalat fetches €24-35/kg, roughly 2-3x the model's €13/kg, which is exactly the "winter premium" thesis. Net read: technically reliable and demand exists, but labour-intensive, low absolute yield, and tight harvest timing make it a niche premium crop rather than a workhorse.

## Pros

- Genuinely cold-hardy: named by multiple growers as a top crop for cold-water-fish (trout/carp) winter aquaponics when warm-season crops are impossible (selbstvers.org, iamcountryside)
- Strong winter price premium in Germany — real Bioland direct-sale prices of €24-35/kg, well above the model's €13/kg
- Frost-tolerant; conventional and aquaponic harvest runs Sept-March, filling the off-season demand window
- Soil grower reports it 'völlig unkompliziert, funktioniert ganzjährig' (uncomplicated, year-round); not a disease-prone crop
- Tolerant of the low root-zone temperatures that cold-water fish impose, unlike tomatoes/peppers/cucumbers

## Cons

- Tiny plant, low absolute yield per harvest — growers repeatedly say 'kleines Gewächs, entsprechend gering der Ertrag' and 'you need a lot of plants to get a reasonable crop'
- Very narrow harvest window (a few days) — multiple growers cite missing it as the deciding reason to quit ('sollte ich ein paar Tage weg sein... dann ist es vorbei')
- Slow grower; ~6 weeks in a warm ebb-flow trial and slower in unlit winter cold — low cycles/yr
- Poor effort-to-yield ratio flagged by hobby growers who switched back to head/oak-leaf lettuce
- Labour-intensive: germination, careful timing, water/temperature control for a low-mass crop
- Strong fish-driven flow (e.g. trout ~20 L/min) can damage the delicate plants — system design conflict
- Almost no documented large-scale aquaponic Feldsalat success; commercial viability judged doubtful by practitioners once lighting/climate costs are counted

## Community evidence

- **[blog]** hydroponiks.de — 'Welche Pflanzen lohnen sich für Hydroponik? Feldsalat jedenfalls nicht.' https://hydroponiks.de/feldsalat-vs-hydroponikt/
  — First-hand ebb-and-flow grower: harvested after ~6 weeks, calls it 'a small plant and accordingly the yield.' Key failure mode is the harvest window of just a few days — 'should I be away a couple of days and miss the harvest time, then it's over.' Concludes effort + resources don't justify it, switched to head/oak-leaf lettuce, and that commercial production 'would hardly be worthwhile' with lighting/climate control.
- **[forum]** Selbstversorger Forum (selbstvers.org) — 'Macht Aquaponik im kleinen Maßstab überhaupt Sinn?' https://selbstvers.org/forum/viewtopic.php?t=3142&start=20
  — Feldsalat named as one of the few cold-hardy crops compatible with trout/carp water, since warm crops (tomato/pepper/cucumber) need heat the fish can't tolerate. Trout die above ~20°C and need ~20 L/min flow (4 turnovers/day) — that current would damage delicate salad. Concludes heated year-round systems only pay off with expensive specialty crops.
- **[forum]** aquaponik-forum.de — 'Feldsalat Anbauen' https://aquaponik-forum.de/Thread-Feldsalat-Anbauen
  — Beginner asks specifically about Feldsalat in aquaponics; the only responder (Ausloggen89) reports it 'völlig unkompliziert, funktioniert ganzjährig' but only in SOIL and explicitly cannot confirm aquaponic behaviour. Shows German aquaponic interest exists but documented aquaponic Feldsalat experience is thin.
- **[blog]** Countryside/iamcountryside — 'Choosing Plants For Winter Aquaponics' https://www.iamcountryside.com/growing/choosing-plants-for-winter-aquaponics/
  — Lists Corn Salad/Mâche/Lamb's Lettuce among crops that succeed in cold aquaponics. Advises growing to full size before Nov 1 and harvesting through winter rather than expecting growth; without supplemental light, winter growth is near zero. Recommends limiting light (~8h) so plants stay bolt-resistant.
- **[forum]** Backyard Aquaponics forum — 'Corn Salad (Lambs Lettuce) help!' https://backyardaquaponics.com/forum/viewtopic.php?f=3&t=28186
  — Grower thread seeking help with corn salad in aquaponics, reflecting that it is attempted but considered finicky/slow; general community framing is that it works as a cold crop but gives little food per plant.
- **[commercial-case]** Bioland/regional direct-sale price listings (bio-hoflieferant.de, die-frischebringer.de, HOFbauernHOF) e.g. https://www.bio-hoflieferant.de/products/feldsalat
  — Real German direct-to-consumer Bioland Feldsalat prices: ~€24.90/kg, €25/kg, and €34.70/kg observed (winter staple). Confirms a strong premium, roughly 2-3x the model's €13/kg assumption.
- **[academic]** ISHS Acta Hort. 893_98 — Fabek et al., 'Lamb's lettuce growing cycle and yield as affected by abiotic factors' (floating-raft system) https://doi.org/10.17660/ActaHortic.2011.893.98
  — Academic floating-raft study confirms Valerianella locusta grows in DWC/raft systems and that growing-cycle length and yield are strongly driven by temperature, humidity and dissolved oxygen — i.e. cold winter conditions lengthen the cycle and depress yield, matching grower reports of slow winter growth.

## Model check (vs `src/data` defaults)

Mixed accuracy. (1) Days to first harvest = 50: practitioners report ~6 weeks (~42 days) under warm ebb-flow but explicitly note winter/cold growth is much slower or near-zero without supplemental light; in a fish-set cold root zone (8-16°C) 50 days is optimistic for the winter premium use-case — 60-90+ days is more realistic in deep winter. (2) Root-zone temp 8-16°C is consistent with the cold-hardy, trout/carp-compatible framing growers describe. (3) Yield 12 kg/m²/yr looks too high given universal grower complaints that it is a 'small plant, low yield' and slow with few winter cycles; realistic coupled-aquaponic winter yields are likely well below 12 kg/m²/yr (general hydroponic LETTUCE benchmarks ~40 kg/m²/yr are not transferable — Feldsalat is far smaller and slower). (4) Price €13/kg is conservative/too LOW — observed German Bioland direct-sale prices are €24-35/kg, so the winter-premium thesis is, if anything, understated. (5) System Media/Raft and difficulty Medium are reasonable; raft/DWC is research-validated, but add a labour/harvest-timing risk flag (narrow harvest window) that 'Medium' doesn't capture. Net: lower the yield, lengthen winter days-to-harvest, and the price could justifiably be raised.

## Germany / EU notes

Highly Germany-relevant: Feldsalat is a German winter-salad staple, traditionally harvested Sept-March, and is the classic cold-season crop. Seed sourcing is easy domestically (e.g. Bingenheimer Saatgut, Samen.de) and cheap, consistent with low seed cost. Market demand is strong and price premiums are real — Bioland regional direct-sale prices observed at €24.90-34.70/kg, ideal for Berlin/Brandenburg direct marketing and CSA/Gemüsekiste channels. Climate fit is excellent for the coupled-system concept: it tolerates the cold root zone imposed by cold-water fish (trout/carp) when warm-season crops cannot, making it a logical winter crop for a Brandenburg system — though German practitioners (hydroponiks.de, senfberg, selbstvers.org) warn the small size, slow winter growth (needs supplemental light to grow at all in deep winter), and tight harvest window make the labour economics marginal unless the premium price is captured. No specific regulatory barriers found; standard EU/German organic certification (Bioland/Naturland) drives the premium.

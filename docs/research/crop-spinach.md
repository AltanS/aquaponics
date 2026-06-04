# Spinach — aquaponics feasibility

> **Verdict: 🟢 viable** · kind: crop · data id: `spinach`
>
> Community-evidence research (forums, grower blogs, user accounts, commercial cases), 2026-06.

## Summary

Spinach is a genuine, repeatedly-reported aquaponics crop, but its success is conditional on COOL water. Practitioners who pair it with cold-water fish (trout, goldfish/koi) at water temps around 10-16°C report consistent success and even commercial baby-spinach demand. The model's "struggles and gets root disease in warm water" note is well-supported: in warm tilapia systems (24-28°C) spinach bolts, turns bitter, and is hit by Pythium aphanidermatum root rot, and DWC growers repeatedly say standard spinach is one of the harder leafy greens (one says "the only spinach I've found to work is tatsoi"). Two under-modelled real-world pains are spinach's notorious germination failure (thermal dormancy above ~24°C, thick seed coat) and the fact that in a coupled Berlin/Brandenburg system the fish choice dictates whether spinach is feasible at all — trout fit the 10-18°C band, tilapia do not.

## Pros

- Multiple cold-water aquaponics growers (trout-based systems) report consistent success with spinach plus lettuce/chard/beets; one reported commercial restaurant demand for 'as much baby spinach as I can grow'.
- Trout's preferred water temperature (10-18°C / 50-65°F) matches the model's 10-18°C root-zone default and spinach's cool-season needs almost exactly — a natural fish/plant pairing for a temperate German climate.
- Cool aquaponic water (at or below ~10°C/50°F) actively suppresses Pythium and is reported to protect the crop from root rot — the cold that spinach wants is also disease-protective.
- Fast cycle: practitioner/source consensus of ~25-35 days to harvest matches the model's 35-day default; can be cut as baby leaf or as cut-and-come-again for multiple harvests.
- Low nutrient and shallow-root requirements make it well suited to raft, NFT and media systems; tolerant of pH variation.

## Cons

- Warm water is a hard failure mode: in tilapia systems (24-28°C) spinach bolts and turns bitter above ~24°C and is highly susceptible to Pythium aphanidermatum root rot (chlorotic, stunted plants often misread as nutrient deficiency).
- Germination is a real and recurring pain not captured in the note: spinach seed has thick coat and enters thermal dormancy above ~24°C, giving poor/uneven germination — a documented commercial problem requiring seed priming/chilling.
- DWC/raft growers repeatedly find standard spinach unreliable in deep-water rafts ('the only spinach I've found to work is tatsoi'); tatsoi/water spinach often substituted.
- Yield and margin scepticism from a commercial grower: 'spinach can be a tough crop to grow commercially since the yield isn't real high and not all markets are willing to pay a favorable price for it.'
- In a coupled Berlin/Brandenburg system the fish set water temp — if the operator runs tilapia for fish economics, spinach becomes unviable; spinach effectively forces a trout/cold-water fish choice and seasonal (cooler) operation.
- Daylength sensitivity: >13 h light triggers bolting, so winter supplementary lighting must be kept short (8-13 h), conflicting with the urge to maximise winter light hours.

## Community evidence

- **[commercial-case]** Upstart University / Upstart Farmers blog, 'Best Crops for Raft Systems (DWC)' — https://university.upstartfarmers.com/blog/best-crops-for-raft-systems
  — Grower Brandon Youst: 'The only spinach I've found to work is tatsoi' — standard spinach struggles in DWC rafts. Upstart's Amy Storey advises 60-70°F (max 75°F), pH 5.5-6.5, EC 2.0-2.5, and warns 'spinach can be a tough crop to grow commercially since the yield isn't real high and not all markets are willing to pay a favorable price for it.'
- **[forum]** Aquaponic Gardening (ning) Trout Growers forum, 'Which plants work best with trout?' — https://aquaponicgardening.ning.com/group/troutgrowers/forum/topics/which-plants-work-best-with
  — Jeffrey Walls: good luck with 'lettuce... chards of any sort, spinach, basil, beets'. Matthew Ferrell ran a system never exceeding 60°F water yet spinach/greens thrived, and a local restaurant wanted to 'buy as much baby spinach as I can grow' — strong cold-water spinach performance and real demand.
- **[blog]** Countryside / iamcountryside, 'Choosing Plants For Winter Aquaponics' (Wisconsin grower) — https://www.iamcountryside.com/growing/choosing-plants-for-winter-aquaponics/
  — First-hand winter grower: 'spinach grows the best in the cold' of crops tested; water at/below 50°F (10°C) plus the aquaponic microbial community 'helps protect you from pythium'; warns 8 h light keeps plants bolt-resistant and 13 h is the max before bolting. Notes Pythium still required meticulous sterilization.
- **[academic]** Urban Ag News, 'Pythium root rot on hydroponically grown basil and spinach' (Cornell research) — https://urbanagnews.com/blog/research/pythium-root-rot-on-hydroponically-grown-basil-and-spinach/
  — Warm root zones favour Pythium aphanidermatum on spinach; symptoms are chlorotic, stunted, size-reduced plants often mistaken for nutrient deficiency. Cornell used a water chiller to drop pond temps to ~68°F to 'reduce, but not completely eliminate' the disease — confirms warm-water root-rot failure mode.
- **[blog]** Go Green Aquaponics, 'Can You Grow Spinach in Aquaponics Systems?' — https://gogreenaquaponics.com/blogs/news/can-you-grow-spinach-in-aquaponics-systems
  — Recommends water 65-72°F (18-22°C), air 60-70°F; flags bolting above high temps and lists iron/N/P deficiency symptoms (interveinal chlorosis, yellowing, stunting) to watch for in fish water. Suggests media, NFT and DWC all workable.
- **[academic]** ScienceDirect, 'Optimizing germination and growth of greenhouse hydroponic baby spinach' + multiple germination guides
  — Poor, uneven spinach germination is a recognised commercial problem; thick seed coat plus thermal dormancy above ~24°C blocks sprouting. Growers prime seed (12-24 h soak) or chill it; substrate moisture must be tuned. A labour/consistency cost not reflected in a flat seed-cost figure.
- **[academic]** Frontiers in Horticulture (2024) baby-leaf on rainbow trout wastewater + ResearchGate 'Integrated aquaponic system with rainbow trout and spinach'
  — Documented coupled/decoupled aquaponic baby-leaf and spinach production specifically on rainbow trout effluent — confirms trout+spinach is a studied, working temperate pairing rather than just hobby anecdote.
- **[commercial-case]** Multiple aquaponics crop guides (Atlas Scientific, iamcountryside, modernagriculturefarm.de) on fish/plant temperature matching
  — Consensus: cold-water fish (trout, goldfish, koi) pair with spinach/lettuce/kale; warm-water tilapia (needs >=20°C, ideal 24-28°C) cause spinach bolting and bitterness. The fish choice, not the plant, is the gating decision in a coupled system.

## Model check (vs `src/data` defaults)

Days to harvest (35) — MATCHES: practitioner/source consensus is 25-35 days for baby/cut spinach. Root-zone temp (10-18°C) — MATCHES cold-water/trout reality well; note hydroponic/Pythium sources cite a slightly higher 'optimal' band (18-22°C from Go Green; 20-24°C is the Pythium danger zone), so 10-18°C is on the safe (cool, disease-suppressing) side, which is appropriate. System (Raft/Media) and difficulty Medium — REASONABLE, though several DWC growers found pure raft spinach UNRELIABLE (favoring NFT/media or tatsoi), so 'Medium' may understate raft-specific risk. Warm-water root-disease note — STRONGLY CONFIRMED (Pythium aphanidermatum + bolting above ~24°C). Yield (24 kg/m²/yr) — LIKELY OPTIMISTIC: a cited hydroponic figure is ~2.7 kg/m²/yr and field-style references give ~0.5-1 lb/ft² per 4-6 week cycle (~2.4-4.9 kg/m² per cut); reaching 24 kg/m²/yr needs ~6-10 dense baby-leaf cycles/yr with high planting density and is achievable only in an intensively managed, well-lit, cool system — treat as an upper bound, not a default. Price (€7/kg direct-sale) — PLAUSIBLE for direct/retail baby spinach in Germany, but a commercial grower explicitly warned spinach yields aren't high and 'not all markets are willing to pay a favorable price,' so margin is thinner than the headline price suggests. Seed cost (€8/m²/yr) — may be UNDERSTATED given recurring germination failure / seed-priming labour and the need to over-sow; not catastrophic but worth a buffer.

## Germany / EU notes

Strong climate fit for Berlin/Brandenburg IF paired with cold-water fish: rainbow trout (Regenbogenforelle) want 10-18°C water, which matches spinach and avoids Pythium — and there is documented research on trout-wastewater baby-leaf/spinach aquaponics. Tilapia, the common warm-water aquaponics fish, would force water to 24-28°C and make spinach bolt/rot, so the fish economics decision effectively gates spinach. German-language sources (aquaponic-deutschland.de, modernagriculturefarm.de, rekubik.de) list spinach (Spinat) as a suitable aquaponics crop and confirm tilapia need >=20°C water — reinforcing the trout pairing for a coupled German system. Seed/seedlings are trivially sourced in Germany; choose bolt-resistant varieties (e.g. Corrente, Spinner, Tyee). Demand: spinach and especially baby-leaf/'Babyspinat' sells well in German retail and direct/restaurant channels (one US grower reported unlimited restaurant baby-spinach demand, plausibly mirrored in Berlin). Winter is the crop's strength (cool + bolt-suppressing), but supplementary light must be capped at ~13 h/day to avoid photoperiod-induced bolting, slightly limiting how much winter lighting can be pushed for growth.

# Microgreens — aquaponics feasibility

> **Verdict: 🟠 challenging** · kind: crop · data id: `microgreens`
>
> Community-evidence research (forums, grower blogs, user accounts, commercial cases), 2026-06.

## Summary

Microgreens grow almost entirely off their own seed reserves in a 7-14 day cycle, so they barely touch fish-water nutrients and, in the words of multiple practitioner guides, "support very few fish" - meaning the core coupled-aquaponics value proposition (fish waste fertilises plants) largely fails for this crop. What growers actually report working is media/raft trays watered FROM the system but functionally decoupled, often on hemp mats; many serious operators (including the German Goldenleafs farm in Nürnberg) grow microgreens in soil or automated vertical setups and reserve aquaponics for lettuce/leafy greens. Recurring failure modes are mold/Schimmel and damping-off in the high-humidity environment, seeds scattering in flood-and-drain beds, organic substrate decomposing in constantly wet conditions, and ammonia spikes from leftover biomass. Crucially, raw ready-to-eat microgreens plus nutrient-rich fish water is a recognised food-safety risk (pathogens survive up to 14 days on microgreens), which in Germany/EU is heavily regulated after the 2011 STEC sprout outbreak. The calculator's €40/kg and 14-day cycle are realistic, but the yield default looks low for intensive cycling and the labour/short-shelf-life note is the real bottleneck.

## Pros

- Very fast cycle (7-14 days to harvest) matches the 14-day default; rapid cash turnover
- High value per kg - wholesale ~$25/lb (~€50/kg) and retail higher, so the €40/kg direct-sale price is realistic and even conservative
- Tiny nutrient demand means they tolerate weak/dilute fish water and won't strip the system; can be grown almost anywhere water reaches the tray
- Hemp grow-mats on a media bed or net-pots just touching the raft water are a proven, low-tech setup that real growers use successfully
- Fish (tilapia) happily eat microgreen surplus/trimmings, closing a small waste loop
- Strong, established German/EU market demand (restaurants, gastronomy, retail) with multiple existing German microgreen brands

## Cons

- Coupling is largely cosmetic - microgreens live off seed reserves and support very few fish, so they don't actually exploit the fish-waste nutrient stream that justifies aquaponics
- Mold/Schimmel and damping-off are the dominant failure mode in the warm, humid, constantly-wet conditions; needs strong airflow, controlled humidity (40-60%), and bottom-watering
- Food safety: raw ready-to-eat crop + nutrient/microbe-rich fish water = serious contamination risk; pathogens can survive 14 days on microgreens. Mainstream practice is to grow seedlings/microgreens with clean water, not raw fish water
- Seeds scatter and won't seed densely in flood-and-drain beds ('end up in all the nooks and crannies'); needs mats/clamshell inserts, adding handling
- Organic substrates (coir, paper) rot in permanent wetness; growers switch to perlite/inorganic media
- Extremely labour-heavy: constant reseeding, harvesting by hand, short shelf life (days) - the economic bottleneck is labour and sales velocity, not growing
- Temperature: germination optimum ~20-24C aligns with tilapia-warm water, but a trout (10-18C) Brandenburg winter system runs too cold for fast, even germination

## Community evidence

- **[forum]** Aquaponic Gardening (ning) forum - 'Microgreens and Sprouts in DWC' https://aquaponicgardening.ning.com/forum/topics/microgreens-and-sprouts-in-dwc
  — Growers (Bob Campbell, Chris Carr) note sprouting/microgreens transform seed energy into amino acids/vitamins with minimal external nutrient need; photos showed fish-water trays grew faster than well-water, but Wilson Lennard's method was 'carpets' of media sheared whole. Several members explicitly hesitated to put raw fish water on a raw-eaten crop for sanitation reasons.
- **[forum]** aquaponik-forum.de - 'Microgreens Projekt' (German) https://aquaponik-forum.de/Thread-Microgreens-Projekt
  — First-hand iteration log: coir mats gave uneven moisture, organic substrates decomposed and molded under constant wet; switched to newspaper/perlite/inorganic granulate. Sloped beds caused over-saturation; ammonia spikes came from leftover biomass/debris needing deep cleans. Final modular clamshell-insert setup did ~20g/tray/day, up to ~4kg/month, usually run below capacity. Tilapia ate the surplus.
- **[blog]** How To Aquaponic - 'Aquaponics and Microgreens - A good mix?' https://www.howtoaquaponic.com/plants/microgreens/
  — Honest downsides: microgreens 'support very few fish as the plants are so small they are not consuming large amounts of nutrients'; seeds scatter in flood-and-drain ('won't get them as dense as you'd like'). Recommends hemp mats on beds or net-pots just touching raft water. Flags vulnerability to small environment changes and the labour of constant replanting.
- **[commercial-case]** FriendlyAquaponics / Go Green Aquaponics / Gardening Tips practitioner guides
  — Commercial-leaning guides converge on raft/media with hemp mats and 2-week harvest, but repeatedly warn of nitrogen-deficiency yellowing in such a fast crop and minimal fish stocking - i.e. the system runs effectively decoupled rather than as true nutrient-coupled aquaponics.
- **[commercial-case]** Goldenleafs Microgreens (Nürnberg, DE) https://goldenleafs.de/Unsere-Microgreen-Farm
  — Telling negative signal: a German team WITH aquaponics experience (lettuce + fish in Indonesia) runs its German microgreen business as an automated indoor vertical farm, NOT aquaponics. Their aquaponics is used for lettuce, not microgreens - suggesting microgreens don't pencil out in coupled aquaponics commercially.
- **[academic]** Penn State Extension + ScienceDirect/PubMed on microgreen food safety; EFSA 2011 German STEC sprout outbreak https://extension.psu.edu/ensuring-food-safety-in-microgreens-production ; https://www.efsa.europa.eu/en/press/news/111115
  — Irrigation water for microgreens must be E. coli-free or sanitised (UV/in-line); pathogens (E. coli O157:H7, Salmonella, Listeria) can survive ~14 days on microgreens and recirculating systems are a documented contamination route. The 2011 Germany/France sprout outbreak (>3,000 ill, 40+ deaths) drove EU sprout regulations - directly relevant to putting raw fish water on a raw crop.
- **[blog]** Hydroponic vs soil microgreens grower discussions (Deliseeds, My Friend Bob, City Cultivator)
  — Experienced growers report little yield difference between soil and hydro for fast varieties because the crop lives off seed reserves; nutrient supply only matters for longer-grown shoots (peas 2+ weeks, wheatgrass). Reinforces that the aquaponic nutrient loop adds little for most microgreens.

## Model check (vs `src/data` defaults)

Price: GOOD. Wholesale ~$25/lb ≈ €50/kg and retail higher; €40/kg direct-sale is realistic, even slightly conservative for a mixed/retail channel. Days to first harvest: GOOD. 7-14 days is universally reported; 14 is a safe default. Temperature: PARTIAL. Germination optimum is ~20-24C (68-75F), so the 18-24C 'root-zone' band fits a tilapia-warm system but is too warm-optimistic for a trout/cold winter Brandenburg system (trout water 10-18C slows and unevens germination). Yield: LIKELY UNDERSTATED for intensive use. A 1020 tray (~0.13 m²) yields ~0.2-1 kg every ~14 days; even at the low end that implies well over 20 kg/m²/yr of bench area if cycled continuously, though usable trays/m², aisle space, and labour realistically cap throughput - the forum operator ran far below capacity. FCR/coupling: WEAK SPOT. The model treats this as a normal aquaponic crop, but practitioners stress microgreens barely consume nutrients and 'support very few fish,' so the fish-coupling benefit is minimal - it behaves like clean-water hydro on a flood table. Difficulty 'Medium' is defensible agronomically but understates labour and food-safety/regulatory burden in Germany.

## Germany / EU notes

Established German market and supply chain: existing microgreen brands (Goldenleafs Nürnberg, Urban Nature, Aixponic Aachen area) and German seed suppliers (e.g. Fetzer, Reutlingen; MP Seeds EU) - juvenile sourcing is easy and local. Strong restaurant/gastronomy and retail demand in Berlin. BUT regulation is significant: microgreens/sprouts eaten raw fall under EU food-hygiene rules with HACCP expected, and sprout-specific EU regs (208-211/2013, traceability) exist precisely because of the deadly 2011 STEC O104:H4 outbreak traced to sprouts in Germany (>3,000 ill, 40+ deaths). Putting raw recirculating fish water on a raw ready-to-eat crop is the exact risk regulators worry about - best practice in DE/EU is clean/sanitised irrigation water and post-harvest hygiene, which argues for decoupling microgreens from the fish loop or using UV-treated water. Winter climate fit: feasible indoors with supplementary light, but a cold-water (trout) Brandenburg system runs below the ~20-24C germination optimum, slowing/unevening crops; a warm tilapia loop fits better but adds heating cost.

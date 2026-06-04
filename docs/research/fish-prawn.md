# Giant river prawn — aquaponics feasibility

> **Verdict: 🟠 challenging** · kind: fish · data id: `prawn`
>
> Community-evidence research (forums, grower blogs, user accounts, commercial cases), 2026-06.

## Summary

Macrobrachium rosenbergii is a popular "premium add-on" in aquaponics marketing and a handful of hobby/small-commercial US growers do raise it (often alongside tilapia), but first-hand accounts consistently describe the same hard problems: it is warmth-hungry (needs ~26-30°C / 78-88°F), strongly cannibalistic during molt, escapes tanks, and has severe heterogeneous growth where dominant blue-claw males suppress everyone else so up to ~50% of a batch stays undersized. Practitioners agree it generally must be raised in a decoupled/separate tank at low density (the rule-of-thumb "2 sq ft per prawn") and given heavy structure, because it eats plant roots and gets predated by fish — which undercuts the simple "coupled" aquaponics premise. For a Berlin/Brandenburg coupled farm the killers are heating cost over cold winters plus juvenile sourcing: the realistic German supply is hobby-priced live animals (~€12 each from Rheingarnelen), nowhere near a €3.5/kg-produced juvenile cost, and no breeding (larvae need brackish water). It works biologically but is repeatedly reported as fiddly and low-density, which is why I rate it challenging rather than viable.

## Pros

- Genuinely high market value — a true premium/luxury freshwater product (US sources quote ~$8-10+/lb for whole prawns, German live hobby animals fetch ~€12 each), supporting the €28/kg direct-sale assumption or higher
- Detritivore behaviour: cleans up settled fish waste, dead roots and uneaten feed beneath grow beds, acting as a secondary cleanup crew
- Several documented small US growers (e.g. Grow Dinner urban farm, NC; Mesa Community College AZ; Live Aquaponics FL) raise and sell it, plus pond-farming is a mature global industry, so husbandry knowledge exists
- Good FCR is achievable at low density in clean RAS conditions (academic figures ~1.0 at 10 ind/m², rising to ~1.7 at higher density) — consistent with or better than the model's FCR of 2
- Tolerant of a wide survival temperature range (survives ~16-40°C) even though growth only happens in the warm band
- German-bred (DNZ) juveniles are legally available domestically, avoiding import/customs/animal-welfare hassle that the German forum flagged for non-EU stock

## Cons

- Cannibalism is the dominant failure mode — prawns eat each other when molting; 'the big ones pick on the little ones' so small prawns rarely reach dinner size without heavy structure/hiding places
- Heterogeneous growth: dominant blue-claw males biologically suppress growth of others; up to ~50% of a harvest can stay undersized small males regardless of feed/density. Requires cull-harvesting and size-grading — labour the model ignores
- Warmth-hungry: needs ~26-30°C for growth. In Berlin/Brandenburg this means year-round heating of a low-density tank — heating-intensive and the single biggest cost driver, exactly as the model note warns
- Low density required ('2 sq ft / ~30x30cm per prawn'), so yield per tank volume is low and capital/heating cost per kg is high
- Eats lettuce/plant roots and is predated by tilapia, so growers say it should NOT be co-housed in a standard coupled bed — needs a separate, aerated, heavily-structured tank (decoupled), complicating the coupled-farm model
- Escapes: multiple growers report prawns/crayfish climbing out of tanks
- Juveniles are BOUGHT and realistic German supply is hobby-priced (~€12/animal), not €3.5/kg-produced; no on-site breeding because larvae need brackish water
- Long grow-out (commonly 5-12 months; pond manuals say 6-12), tying up heated tank space over winter
- Disease/monoculture and oxygen-crash risk flagged by hobby sources; a German trial of a substitute crayfish hit summer oxygen depletion

## Community evidence

- **[forum]** Aquaponics Association Community forum — 'Best prawn and/or shrimp to use for aquaponics' (community.aquaponicsassociation.org/t/.../3656)
  — Growers warn M. rosenbergii is aggressive, 'will eat each other when they shed their exoskeleton', and 'eats lettuce roots', so it should be kept in a separate aerated tank with 'a LOT of hiding places' at ~2 sq ft/prawn — i.e. decoupled, not in the plant bed.
- **[commercial-case]** Garden Culture Magazine — 'Raising Freshwater Shrimp and Tilapia Together' (Grow Dinner urban farm, Statesville NC)
  — Real small-commercial grower: confirms tilapia predate immature prawns, 'big ones pick on the little ones', prawns are 'super vulnerable to their own kind' when molting, and they escape the tank. Built vertical 'high-rise' shelters as a workaround — a working but fiddly setup.
- **[forum]** aquaponik-forum.de — Thread 'Macrobrachium rosenbergii' (German aquaponics forum)
  — German hobbyists note it is 'wärmeliebend' (needs >25°C), so year-round outdoor culture in temperate Germany is impractical; suggest overwintering breeders and harvesting in autumn. No reliable German supplier surfaced in-thread; importing means customs/animal-welfare hurdles. One user's marble-crayfish attempt in a fish tank failed and an animal escaped through his house.
- **[commercial-case]** Rheingarnelen.de — Rosenberggarnele (DNZ) product page (Essen, Germany)
  — Concrete German sourcing: German-bred juveniles sold at ~€12 per animal (3-6cm or 6-12cm), stated 24-30°C requirement, and a note that they need a large follow-on tank (≥1 m² for adults). Hobby pricing, far above any €/kg-produced juvenile assumption.
- **[blog]** Live Aquaponics blog — 'Why You Should Be Raising Freshwater Prawns' / 'How to Grow HUGE Freshwater Prawns' (FL commercial supplier)
  — Vendor (sells juveniles) claims market size in 'as little as 5 months' at 78-88°F and pitches them as low-maintenance — but provides no density/FCR/survival data; optimistic and commercially motivated, so treat the 5-month figure as best-case.
- **[blog]** HowtoAquaponic — 'Freshwater Shrimp and Prawn Aquaponics'
  — Practitioner-oriented: ~4 months to ~3 oz market size, 2 sq ft/prawn to avoid territoriality, prawns nibble roots and each other when overcrowded/hungry, market ~$8-10/lb, and warns 'risk of diseases and monoculture... surprisingly high' if not carefully monitored.
- **[academic]** Mesa Community College press release — raising giant freshwater prawns in desert aquaponics (Dr. George Brooks)
  — Educational program experimenting to find optimal aquaponic conditions for the prawn in a hot, arid climate — signals it is still treated as experimental/condition-sensitive rather than turnkey.
- **[academic]** Aquaculture literature (FAO manual; J. World Aquaculture Soc.; ScienceDirect on size-grading & all-male culture)
  — Heterogeneous individual growth is a 'major impediment': dominant blue-claw males suppress others, up to ~50% of harvest can be undersized small males; cull-harvesting and pre-stocking size grading are needed. FCR ~1.0 at 10 ind/m² rising to ~1.7 at higher density.

## Model check (vs `src/data` defaults)

Mixed alignment. TEMPERATURE: 26-30°C band matches practitioner consensus (78-88°F optimum) — good. DIFFICULTY 'Hard' and the cannibalism/warmth/low-density note are strongly confirmed by every first-hand source. FCR: model's 2 is conservative/safe — academic RAS figures are ~1.0-1.7, so 2 is realistic-to-pessimistic, fine. GROW-OUT 7 months: defensible — vendor best-case is 5 months and hobby sources say ~4, but pond/forum reality is 6-12 months and the heterogeneous-growth problem means many animals need longer or get culled, so 7 months coupled-farm is reasonable, arguably slightly optimistic for a full marketable batch. PRICE €28/kg: well-supported, even conservative given €12/live-animal hobby pricing in Germany. BIGGEST DISCREPANCY — JUVENILE COST: model assumes €3.5/kg produced; the only realistic German/EU supply is hobby-priced live animals at ~€12 EACH (Rheingarnelen). To produce 1 kg you need roughly 10-15 market animals (10 count/lb is the target), and you must overstock to allow for cannibalism/culling losses — implying juvenile cost realistically in the tens-to-€100+ per kg produced, an order of magnitude above the €3.5/kg default. SECOND DISCREPANCY: the model implicitly treats this as a coupled species, but growers insist on a separate, heavily-structured, low-density tank (prawns eat roots + get eaten by fish), and heating that low-density tank through Brandenburg winters is the dominant unmodelled cost. Recommend revising juvenile cost up sharply and flagging heating + culling labour.

## Germany / EU notes

Juveniles are buyable domestically as German-bred (DNZ) stock, e.g. Rheingarnelen.de (Essen) at ~€12/animal in 3-6cm or 6-12cm sizes, and Garnele-Online / interaquaristik list the species — but this is aquarium/hobby pricing, not bulk aquaculture juveniles, so cost-per-kg-produced is far above the model's €3.5/kg. On-farm breeding is effectively impossible: larvae require brackish water (the species is amphidromous), so you remain a perpetual juvenile buyer. Climate fit is poor for cheap operation: needs 24-30°C year-round, and Brandenburg winters make this a heating-intensive indoor RAS/greenhouse proposition; outdoor or unheated culture is off the table. Regulation: M. rosenbergii is widely kept in the German aquarium trade and domestic DNZ stock avoids import/customs/animal-welfare issues that the German forum flagged for non-EU sourcing; no obvious ban surfaced, though anyone scaling commercially should verify Brandenburg aquaculture/animal-husbandry and non-native species rules. Market demand: a genuine premium niche — fresh live freshwater prawns are scarce in Germany and command high prices — but volumes are small and buyers are gastronomy/specialty rather than mass retail.

# African catfish — aquaponics feasibility

> **Verdict: ✅ proven** · kind: fish · data id: `catfish`
>
> Community-evidence research (forums, grower blogs, user accounts, commercial cases), 2026-06.

## Summary

African catfish (Clarias gariepinus) is the best-documented warm-water aquaculture species in German/Austrian recirculating systems, with multiple operating commercial farms (Frankenwels Bavaria ~120 t/yr, Sukow Mecklenburg ~400 t/yr, Austrian container operations) and active hobby/forum communities. Practitioners consistently confirm the species is extremely hardy, air-breathing, and tolerates very high density (250-350 kg/m³), which matches the prompt's "Easy/workhorse" framing for fish husbandry. The single biggest real-world caveat is heat: it needs a constant ~27-28°C, and the economically viable German farms all rely on free waste heat from adjacent biogas plants — a cost the calculator's price/FCR defaults do not capture. The critical sanity-check failure is PRICE: real German direct-sale whole-fish/processed prices cluster around €8/kg with farms needing only €1.80-2.00/kg to break even, and the model's €9/kg is plausible only for premium small-batch direct-sale, not realistic at scale. FCR (~0.9) and juvenile cost are if anything better than the defaults; grow-out is notably faster than the model assumes (~5 months, not 7).

## Pros

- Genuinely hardy and air-breathing - practitioners and forums repeatedly confirm it survives low oxygen, poor water quality, and crowding that would kill tilapia or trout; the calculator's 'workhorse' note is accurate for husbandry difficulty.
- Tolerates extreme density: forum and commercial growers run 250-350 kg/m^3 in IBC/RAS tanks, far above the 20-25 kg/m^3 of welfare-oriented systems, meaning small footprints can produce serious tonnage.
- Excellent feed conversion: multiple sources (Frankenwels, heim-aquaponik comment) cite FCR ~0.9, with Frankenwels at 1.35 kg feed for a 1.5 kg fish - at or better than the model's 1.1 default.
- Fast grow-out: commercial reports converge on ~140-150 days (Frankenwels, Sukow ~5 months) from ~15-22 g juvenile to 1.5 kg market weight - faster than the model's 7-month assumption.
- Boneless, omega-3-rich, mild flesh that 'tastes like whatever you cook it with' - good processing yield and accepted by German retail (Metro, Netto) and restaurants; established regional market in Germany/NL.
- Juveniles are commercially available and cheap - German/Dutch suppliers quoted at ~15-20 cents per fingerling; juveniles are bought not bred, matching the Berlin/Brandenburg sourcing assumption.

## Cons

- Hard 27-28C temperature requirement year-round; <16C is lethal. In Brandenburg winters this means continuous heating, and EVERY economically successful German/Austrian farm found (Frankenwels, Sukow) depends on FREE waste heat from a biogas plant - a cost the model ignores entirely.
- Price reality undercuts the model: German processed/direct-sale prices are ~8 EUR/kg with break-even at only 1.80-2.00 EUR/kg; the 9 EUR/kg default is optimistic and only achievable in premium small-volume direct sale, not at scale (Metro wholesale fillet is much higher but that's processed, not live-weight farm-gate).
- Carnivorous/high-protein feeder preferring molluscs and small fish; needs quality high-protein feed (feed is 66-85% of operating cost). Cheap feed depresses growth - so the cheap-FCR upside depends on buying good (expensive) pellets.
- High density amplifies water-quality risk: catfish become susceptible to opportunistic bacteria under poor water quality, and overfeeding rapidly drives low O2 / high ammonia / high solids - so the biofilter must be oversized (forums say ~2x tilapia filtration).
- Welfare/optics concern raised by German hobbyists: 250+ kg/m^3 densities sit uneasily with 'ecological' aquaponics branding, which can matter for direct-to-consumer marketing in Germany.
- Invasive-species / regulatory sensitivity in EU - it is a non-native species, so containment and permitting matter for a Brandenburg build (juveniles must come from licensed suppliers).

## Community evidence

- **[forum]** aquaponik-forum.de - Thread 'afrikanischen Wels, Clarias gariepinus' (https://aquaponik-forum.de/Thread-afrikanischen-Wels-Clarias-gariepinus)
  — German hobby/semi-pro growers cite 350 kg/m^3 in 10 m^3+ tanks, ~4-month cycle to 1.2 kg, minimum 25C water (heating essential in N. Europe), feeding 5% body weight for juveniles tapering to 2%, and juveniles at ~15-20 cents each from NL suppliers. Note the species is carnivorous (molluscs/small fish), complicating plant-coupled feeding.
- **[blog]** heim-aquaponik.de - 'Warum ich etwas mit Aquaponik hadere' comment by grower 'Mark' (https://www.heim-aquaponik.de/warum-ich-etwas-mit-aquaponik-hadere/)
  — Practitioner reports 250 kg/m^3, ~80 fish per IBC, 10 g -> 1500 g in 150 days, FCR 0.9, prefers 27C and needs heating outside summer. Blog author counters with welfare unease (vs 20-25 kg/m^3 'ecological' standard) and worries about year-round heating energy cost in Germany.
- **[commercial-case]** Frankenwels (Burggrumbach, Bavaria) - frankenwels.jimdofree.com/presse (https://frankenwels.jimdofree.com/presse/)
  — Operating farm: 15 cm/22 g juveniles to 1.5 kg in ~140-150 days; constant 27C from adjacent biogas-plant waste heat ('essential for economic viability'); FCR ~0.9 (1.35 kg feed per fish); twenty 5 m^3 tanks, up to 40,000 fish, ~120 t/yr; boneless, omega-3-rich, mild flesh; no antibiotics.
- **[commercial-case]** Fischmagazin - Sukow farm, Mecklenburg, '400 Tonnen Wels im Jahr' (https://www.fischmagazin.de/willkommen-seriennummer-3999-Sukow+400+Tonnen+Wels+im+Jahr+fuer+LEH+und+GV.htm)
  — ~400 t/yr commercial RAS; market size 1.5-1.9 kg in 'just over 5 months'; needs 28C from integrated biogas waste heat; break-even 1.80-2.00 EUR/kg, fillets retail ~8 EUR/kg; sells to Metro/Netto/Plaza/Real, Hamburg fish market, restaurants, on-farm shop (~100-150 kg/week processed) and a Dutch buyer.
- **[commercial-case]** derStandard.at - 'Landwirte setzen auf Welse im Container statt auf Kühe im Stall' (https://www.derstandard.at/story/2000069043840/)
  — Austrian farmers converting from cattle to catfish in steel-basin container RAS (14 basins, arm-length fish), illustrating the species is a practical farm-diversification crop in cold Central-European climates, though the excerpt lacks hard production numbers.
- **[commercial-case]** WelsFarm Leiblachtal, Austria - welsfarm.at/welszucht (https://welsfarm.at/welszucht/)
  — Closed warm-water recirculation system (3-4 m biofilter columns) with active water heating for catfish - another operating Alpine-climate farm confirming RAS + heating is the standard production model, not pond culture.
- **[commercial-case]** Obermuehle Fisch direct-sale shop, Brandenburg (https://www.obermuehle-fisch.de/collections/afrikanischer-wels)
  — Brandenburg producer sells African catfish FILLET direct at ~39.80-43.80 EUR/kg (skin-on/off). This is processed fillet (yield ~40-45% of live weight), so it does NOT contradict ~8-9 EUR/kg live-weight; it shows premium direct-sale processing can lift effective value well above wholesale.
- **[forum]** Aquaponic Gardening (ning) & ZipGrow catfish threads (https://aquaponicgardening.ning.com/forum/topics/catfish-stocking-densities ; https://zipgrow.com/catfish-in-aquaponics/)
  — English-language hobby consensus: catfish are beginner-friendly and tolerate wide temperature swings, but growers warn to oversize filtration (~2x tilapia), minimize handling (sensitive skin), and note off-flavor/'muddy' taste only arises in dirty water - clean RAS water yields mild flesh.

## Model check (vs `src/data` defaults)

Mostly consistent on husbandry, with two material discrepancies. (1) PRICE - the 9 EUR/kg default is high for live-weight/whole fish: real German commercial whole/processed prices are ~8 EUR/kg with break-even at only 1.80-2.00 EUR/kg (Sukow). 9 EUR/kg is only realistic for premium small-batch direct sale; Brandenburg fillet sells at ~40 EUR/kg but that is processed (yield ~40-45%), not live weight. Treat 9 EUR/kg as an optimistic best-case farm-gate, not a scale price. (2) GROW-OUT TIME - the model's 7 months is conservative/pessimistic; practitioners and both German commercial farms report ~5 months (140-150 days) from ~15-22 g juvenile to 1.5 kg, and forums cite as little as 4 months to 1.2 kg. FCR - the 1.1 default is realistic-to-conservative; growers consistently report ~0.9 (Frankenwels 1.35 kg feed per 1.5 kg fish). TEMPERATURE - 25-28C band is accurate; practitioners target 27-28C and warn <16C is lethal, so the band's low end should not be relied on in winter. DIFFICULTY 'Easy' - correct for fish biology/hardiness, but misleading on the economic dimension: the only profitable German/Austrian farms use FREE biogas waste heat, so a standalone Brandenburg build must budget substantial winter heating energy that the model's parameters do not reflect. JUVENILE COST - 0.8 EUR/kg produced implies ~1.2 EUR per market fish; at ~15-20 cents per fingerling plus mortality this default looks generous (i.e. juvenile cost is likely lower than modeled), a slight upside.

## Germany / EU notes

Strong Germany/EU fit and the most mature warm-water RAS species in the region. Juveniles/fingerlings are readily bought (not bred) from German and Dutch suppliers at ~15-20 cents each - matching the Berlin/Brandenburg sourcing assumption. Established domestic market: Sukow (Mecklenburg, ~400 t/yr) supplies Metro/Netto/Plaza/Real and Hamburg fish market; Frankenwels (Bavaria, ~120 t/yr) and Brandenburg's Obermuehle Fisch sell direct-to-consumer. Demand is real but value is split - ~8 EUR/kg wholesale/processed vs ~40 EUR/kg premium fillet direct. CRITICAL CLIMATE CAVEAT: Brandenburg winters make the hard 27-28C requirement the dominant cost driver; every viable German/Austrian operation found (Frankenwels, Sukow) is co-located with a biogas plant for FREE waste heat. Without a cheap heat source a Berlin/Brandenburg build faces serious winter heating bills, and hobbyists have abandoned heated systems over electricity cost. Regulatory note: Clarias gariepinus is a non-native species in the EU, so containment and licensed-supplier sourcing matter for permitting. Marketing note: German 'eco' aquaponics buyers may balk at the 250+ kg/m^3 densities that make the species economic.

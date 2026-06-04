# Pak choi — aquaponics feasibility

> **Verdict: 🟢 viable** · kind: crop · data id: `pakchoi`
>
> Community-evidence research (forums, grower blogs, user accounts, commercial cases), 2026-06.

## Summary

Pak choi is genuinely one of the fastest, most-grown leafy greens in coupled aquaponics and works well in raft/DWC and NFT once a system is cycling, with first harvests in roughly 30-45 days and restaurant/Asian-green demand confirmed by multiple growers. The big real-world caveat for Berlin/Brandenburg is bolting: practitioners (especially a German aquaponics-forum grower) report that pak choi bolts readily under both cold stress (<10-13°C nights) and long-day light, and that supplementary winter lighting beyond ~10-12h actively triggers premature flowering. The single most damaging failure mode reported across forums is aphids, which can wipe out an entire brassica crop in days and cannot be controlled with normal pesticides in a coupled system. The model's "Easy / Raft-NFT / restaurant demand" framing is broadly right, but its 28 kg/m²/yr yield and the implicit "just add winter light" assumption are optimistic and need adjustment for the bolting/photoperiod reality.

## Pros

- Very fast turnover (first harvest ~30-45 days; baby leaves from ~20 days), and growers report up to three cut-and-come-again harvests from one set of roots
- Grows successfully in all common aquaponic systems (floating raft/DWC, NFT, ebb-and-flow, media bed) per a peer-reviewed multi-system comparison study
- Tolerant of cooler water than warm-season crops, so it fits a coupled system whose temperature is set by cool-water fish (e.g. trout) better than fruiting crops do
- Confirmed reliable restaurant/Asian-green market demand; commonly listed as one of a commercial grower's 4-5 staple crops
- Beginner-friendly and 'nutrient-hungry,' so it performs well once the biofilter is established and nitrate is plentiful

## Cons

- Strong bolting tendency: cold snaps (<10-13°C nights) AND long-day photoperiod both trigger premature flowering, making it tricky in a Berlin winter system that uses supplementary light
- Supplementary winter light is a double-edged sword: a German grower found pak choi is a long-day plant that flowers above ~10-14h light, so the usual hydro advice of 14-16h light makes it bolt
- Aphids (green peach/cabbage/foxglove) are the most explosive pest in aquaponics and can destroy a whole brassica crop in days; no fish-safe chemical fix, so netting/biocontrol is mandatory
- Also susceptible to flea beetles, diamondback moth, whiteflies and slugs as a brassica
- High EC/nutrient-rich fish water can push faster bolting and bitterness, so it benefits from lower-EC zones (more like lettuce levels)
- Real per-area yields reported in practice are well below the model default

## Community evidence

- **[forum]** aquaponik-forum.de thread 'Das 1´ste Jahr' (German aquaponics forum) - https://aquaponik-forum.de/Thread-Das-1%C2%B4ste-Jahr?page=9
  — First-hand failure: grower 'Stephan' could not stop Baby Pak Choi bolting; another member established pak choi is a long-day plant that flowers above ~10-14h light, so Stephan cut supplementary light to 9h. It still bolted on schedule end of March, leaving heads so tiny they 'wouldn't even fill a baby bottle.' Experienced member 'elagricultor': pak choi only ever worked for him Oct-Feb. Directly relevant to Berlin winter + grow lights.
- **[blog]** aquaponicseasy.com - Bok Choy in Aquaponics
  — Practitioner guidance: keep water max ~18°C (65°F) and air 10-21°C; EC 1.5-2.0 but higher EC makes it bolt faster and turn bitter; matures ~30 days, highest yield at 6 weeks from transplant but can be turned in 4 weeks; warns not to overload rafts with too many heavy heads.
- **[commercial-case]** AquaponicsUSA / commercial grower quote surfaced via search
  — A commercial aquaponics farmer reported 'all of my Bok Choi (one of 4 or 5 crops I normally grow) was trashed' - confirms pak choi as a standard commercial staple but also that an entire crop can be lost (consistent with the aphid wipe-out failure mode).
- **[commercial-case]** farmonaut / multiple pest guides - Aphids on Bok Choy
  — Aphids are described as 'the most explosive pests in aquaponics'; a single female produces dozens of clones daily and a poorly managed infestation 'can ruin an entire crop in a matter of days.' Chemical pesticides are off-limits in coupled systems (harm fish + nitrifiers), forcing netting/ladybugs/insecticidal-soap workarounds.
- **[academic]** MDPI Horticulturae 6(4):69 - Growth Performance of Lettuce and Pak Choi in Different Aquaponic Growing Systems - https://www.mdpi.com/2311-7524/6/4/69
  — Peer-reviewed comparison of floating raft, NFT, ebb-and-flow and capillary systems found pak choi grew and yielded successfully in ALL four aquaponic systems, confirming raft/NFT suitability; lettuce/pak choi growth rates were adequate across the board.
- **[blog]** ponicslife.com - Hydroponic Bok Choy grow guide
  — Recommends only 10-12h light/day and 18-20°C, full maturity 45-60 days (4-6 weeks from transplant), pH 6.0-7.0 - the lower photoperiod recommendation corroborates the bolting risk from long days flagged by the German grower.
- **[video]** FriendlyAquaponics - Growing Aquaponic Bok Choy + 'Great BOK CHOI harvest in a raft aquaponics system' YouTube (youtube.com/watch?v=ZJTVbjRZVQs)
  — Established US commercial aquaponics educators show bok choi growing 'wonderfully' in a raft system, harvestable at multiple stages depending on market - supports raft suitability and steady restaurant demand for the crop.

## Model check (vs `src/data` defaults)

Mixed - several discrepancies. (1) YIELD: model says 28 kg/m²/yr. Practitioner and study data are much lower: an aquaponics leafy-greens figure (Savidov) and tropical raft hydroponic trials land around ~0.5 kg/m² per crop (5,000-5,700 kg/ha), and a greenhouse study cited up to ~15 kg/m²/yr for leafy greens broadly. Even with ~6-8 fast crop cycles/yr, real continuous pak choi output is plausibly more like ~10-20 kg/m²/yr; 28 kg/m²/yr is at the optimistic ceiling, especially after bolting/aphid losses. (2) DAYS TO FIRST HARVEST: model says 38; practitioners report ~30 (baby ~20) up to 45-60 for full heads - 38 is reasonable for a marketable head, slightly conservative for baby. (3) ROOT-ZONE TEMP 15-22°C: matches reports (water max ~18°C, air 13-21°C) and is well-aligned. (4) PRICE €6/kg: plausible for direct restaurant sale of a specialty Asian green in Germany; not contradicted. (5) DIFFICULTY 'Easy': partly true (fast, beginner crop) but understates two hard, Berlin-specific risks the note ignores - bolting from cold/long-day light and rapid aphid loss; effectively 'Easy to grow, tricky to grow well in a lit winter system.' The model's note about supplementary winter light should be qualified: capping photoperiod near ~10-12h is advisable to avoid triggering bolting.

## Germany / EU notes

Strong Germany/EU fit on demand and climate-band, with specific caveats. Pak choi (Pak Choi/Pak Choy) is an established commercial crop in Germany - hortipendium.de has an Erwerbsanbau (commercial cultivation) page and seed is widely available from German suppliers (samen.de, Beetfreunde, etc.), so juvenile/seed sourcing is a non-issue. The cool optimal band (~13-21°C) suits Brandenburg shoulder seasons and cool-water fish, but the German aquaponics forum evidence is the headline: a Brandenburg-relevant grower found pak choi reliably worked only Oct-Feb and bolted in spring, and that supplementary grow-light beyond ~9-12h pushes long-day bolting - so naive winter lighting can backfire. Restaurant demand for Asian greens in Berlin's gastronomy scene is real and supports the €6/kg direct-sale assumption. Net: regulation/sourcing are fine; the practical German risk is photoperiod-induced bolting under winter supplementary light plus aphids in the warm greenhouse, both of which should be reflected as yield haircuts.

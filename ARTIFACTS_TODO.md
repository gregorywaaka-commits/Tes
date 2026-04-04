# Artifacts TODO — Future CK3 Legendary Artifact Implementations

> This file catalogs every named TES lore item in the mod that is currently
> implemented as a **character trait**, **character modifier**, or **character flag**
> and should eventually be upgraded to a proper **CK3 legendary artifact** item
> (using the `common/artifacts/` system introduced in Royal Court).
>
> Each entry includes: the current implementation, the target artifact ID,
> recommended slot, suggested special mechanics, canonical lore source,
> and the mod files that reference it.

---

## How to Add an Artifact (CK3 Royal Court system)

1. Create `mod/common/artifacts/types/<artifact_id>_artifact.txt` with the artifact type definition.
2. Create `mod/common/artifacts/features/<artifact_id>_feature.txt` for optional active ability / slot behaviour.
3. Add localization keys in `mod/localization/english/<artifact_id>_artifact_l_english.yml`.
4. In the event/decision that grants the item: replace `add_trait = <bearer_trait>` or `add_modifier = { modifier = <holder> }` with `create_artifact = { … }` and `add_artifact = root`.
5. Remove the now-redundant trait/modifier once the artifact is created (or keep as fallback if EK2 doesn't support artifacts).
6. Add `# ARTIFACT IMPLEMENTED — see common/artifacts/types/<id>` to the old trait/modifier definition.

---

## Priority 1 — Daedric Prince Artifacts

These items are already fully event-gated; conversion is most straightforward.

### 1. Mehrunes' Razor
| Field | Value |
|---|---|
| **artifact_id** | `mehrunes_razor` |
| **Current impl** | Trait: `mehrunes_razor_bearer` |
| **Slot** | Weapon (one-handed dagger) |
| **Special mechanic** | Small % chance (5%) to trigger instant-kill on duel/assassination; prowess +4 |
| **Lore source** | UESP [Lore:Mehrunes' Razor](https://en.uesp.net/wiki/Lore:Mehrunes%27_Razor) — blade of Mehrunes Dagon; tiny size, catastrophic effect |
| **Lore status** | `[CANON — UESP]` Appears in Arena, Daggerfall, Oblivion, Skyrim |
| **Current files** | `mod/common/traits/daedric_artifacts_traits.txt` (trait def) · `mod/events/daedric_artifacts_events.txt` (daedric_artifact.001) · `mod/events/daedric_champion_events.txt` (reward) |

---

### 2. Wabbajack
| Field | Value |
|---|---|
| **artifact_id** | `wabbajack` |
| **Current impl** | Trait: `wabbajack_wielder` + Modifier: `wabbajack_modifier` |
| **Slot** | Weapon (staff) |
| **Special mechanic** | Yearly random-effect table: equally likely positive or negative effect on character |
| **Lore source** | UESP [Lore:Wabbajack](https://en.uesp.net/wiki/Lore:Wabbajack) — Sheogorath's chaotic staff |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/traits/daedric_artifacts_traits.txt` · `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_artifacts_events.txt` (daedric_artifact.002) · `mod/events/daedric_prince_invasion_events.txt` (sheogorath.002) · `mod/events/daedric_champion_events.txt` |

---

### 3. Skull of Corruption
| Field | Value |
|---|---|
| **artifact_id** | `skull_of_corruption` |
| **Current impl** | Trait: `skull_of_corruption_bearer` + Modifier: `skull_of_corruption_modifier` |
| **Slot** | Trinket / off-hand relic |
| **Special mechanic** | Scheme power bonus; can "dream-steal" on target (stress event chain) |
| **Lore source** | UESP [Lore:Skull of Corruption](https://en.uesp.net/wiki/Lore:Skull_of_Corruption) — Vaermina's staff; copies and weaponises dreams |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/traits/daedric_artifacts_traits.txt` · `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_artifacts_events.txt` (daedric_artifact.002 fallback) · `mod/events/daedric_prince_invasion_events.txt` (vaermina.003) |

---

### 4. Ebony Blade
| Field | Value |
|---|---|
| **artifact_id** | `ebony_blade` |
| **Current impl** | Trait: `ebony_blade_cursed` + Modifier: `ebony_blade_holder` |
| **Slot** | Weapon (great sword / two-handed) |
| **Special mechanic** | Gains +1 prowess per murdered close relation (tracked via variable); loses health |
| **Lore source** | UESP [Lore:Ebony Blade](https://en.uesp.net/wiki/Lore:Ebony_Blade) — Mephala's sword; grows stronger with each betrayal |
| **Lore status** | `[CANON — UESP]` Called "the Whisperer"; also "Shadowhunt" in some texts |
| **Current files** | `mod/common/traits/daedric_artifacts_traits.txt` · `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_artifacts_events.txt` (daedric_artifact.003) · `mod/events/daedric_prince_invasion_events.txt` (mephala.002) · `mod/events/daedric_champion_events.txt` |

---

### 5. Ring of Namira
| Field | Value |
|---|---|
| **artifact_id** | `ring_of_namira` |
| **Current impl** | Trait: `ring_of_namira_bearer` + Modifier: `ring_of_namira_holder` |
| **Slot** | Ring / accessory |
| **Special mechanic** | Health regen on cannibal feast; `cannibal` trait synergy bonus; Namira piety gain |
| **Lore source** | UESP [Lore:Ring of Namira](https://en.uesp.net/wiki/Lore:Ring_of_Namira) — Lady of Decay's ring |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/traits/daedric_artifacts_traits.txt` · `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_artifacts_events.txt` · `mod/events/daedric_champion_events.txt` |

---

### 6. Dawnbreaker
| Field | Value |
|---|---|
| **artifact_id** | `dawnbreaker` |
| **Current impl** | Trait: `beacon_bearer` + Modifier: `dawnbreaker_modifier` + `dawnbreaker_wielder` |
| **Slot** | Weapon (sword, one-handed) |
| **Special mechanic** | On-kill vs undead: explosion modifier on targeted county; Meridia piety bonus |
| **Lore source** | UESP [Lore:Dawnbreaker](https://en.uesp.net/wiki/Lore:Dawnbreaker) — Meridia's artifact; causes undead to explode on death |
| **Lore status** | `[CANON — UESP]` Featured in Oblivion (Knights of the Nine), Skyrim |
| **Current files** | `mod/common/traits/meridia_beacon_traits.txt` · `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/meridia_beacon_events.txt` (meridia_beacon.010, .020) · `mod/events/daedric_prince_invasion_events.txt` (meridia.002) · `mod/events/daedric_champion_events.txt` |

### 6b. Meridia's Beacon (quest item)
| Field | Value |
|---|---|
| **artifact_id** | `meridias_beacon` |
| **Current impl** | Part of `beacon_bearer` trait |
| **Slot** | Trinket / carried item |
| **Special mechanic** | Enables Dawnbreaker quest chain; Meridia speaks through it (yearly event) |
| **Lore source** | UESP [Lore:Meridia's Beacon](https://en.uesp.net/wiki/Lore:Meridia%27s_Beacon) — the quest item in Skyrim |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/traits/meridia_beacon_traits.txt` · `mod/events/meridia_beacon_events.txt` |

---

### 7. Mace of Molag Bal
| Field | Value |
|---|---|
| **artifact_id** | `mace_of_molag_bal` |
| **Current impl** | Modifier: `mace_of_molag_bal_holder` |
| **Slot** | Weapon (mace, one-handed) |
| **Special mechanic** | Soul-steal on kill event; vampire-bloodline synergy bonus; dread gain |
| **Lore source** | UESP [Lore:Mace of Molag Bal](https://en.uesp.net/wiki/Lore:Mace_of_Molag_Bal) — weapon of the King of Corruption; steals the souls of the slain |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_champion_events.txt` |

---

### 8. Ring of Hircine
| Field | Value |
|---|---|
| **artifact_id** | `ring_of_hircine` |
| **Current impl** | Modifier: `ring_of_hircine_holder` |
| **Slot** | Ring / accessory |
| **Special mechanic** | Werewolf trait synergy; removes transform limit; hunt bonus in war |
| **Lore source** | UESP [Lore:Ring of Hircine](https://en.uesp.net/wiki/Lore:Ring_of_Hircine) — Hircine's reward for a worthy hunt |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_champion_events.txt` |

---

### 9. Saviour's Hide
| Field | Value |
|---|---|
| **artifact_id** | `saviors_hide` |
| **Current impl** | Modifier: `saviors_hide_holder` |
| **Slot** | Armour (light / medium) |
| **Special mechanic** | Werewolf curse mitigation; Hircine piety bonus; beast blood resistance |
| **Lore source** | UESP [Lore:Saviour's Hide](https://en.uesp.net/wiki/Lore:Saviour%27s_Hide) — Hircine's reward; protects against the beast within |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_champion_events.txt` |

---

### 10. Ebony Mail
| Field | Value |
|---|---|
| **artifact_id** | `ebony_mail` |
| **Current impl** | Modifier: `ebony_mail_holder` |
| **Slot** | Armour (heavy) |
| **Special mechanic** | Poison aura (adjacent enemies get health debuff); Boethiah champion bonus; stealth |
| **Lore source** | UESP [Lore:Ebony Mail](https://en.uesp.net/wiki/Lore:Ebony_Mail) — Boethiah's artifact; silences footsteps, poisons nearby enemies |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_champion_events.txt` |

---

### 11. Masque of Clavicus Vile
| Field | Value |
|---|---|
| **artifact_id** | `masque_of_clavicus_vile` |
| **Current impl** | Modifier: `masque_of_clavicus_vile` |
| **Slot** | Headgear / face mask |
| **Special mechanic** | Large diplomacy bonus; +opinion from all characters; Clavicus piety gain |
| **Lore source** | UESP [Lore:Masque of Clavicus Vile](https://en.uesp.net/wiki/Lore:Masque_of_Clavicus_Vile) — golden mask granting irresistible charm |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_prince_invasion_events.txt` (clavicus.003) · `mod/events/daedric_champion_events.txt` |

---

### 12. Spellbreaker
| Field | Value |
|---|---|
| **artifact_id** | `spellbreaker` |
| **Current impl** | Modifier: `spellbreaker_modifier` |
| **Slot** | Shield / off-hand |
| **Special mechanic** | Disease immunity modifier while equipped; reduces enemy siege damage; Peryite synergy |
| **Lore source** | UESP [Lore:Spellbreaker](https://en.uesp.net/wiki/Lore:Spellbreaker) — Peryite's Dwemer-forged shield; wards against magic and disease |
| **Lore status** | `[CANON — UESP]` Originally a Dwemer artifact re-gifted by Peryite |
| **Current files** | `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_prince_invasion_events.txt` (peryite.002) · `mod/events/daedric_champion_events.txt` |

---

### 13. Sanguine Rose
| Field | Value |
|---|---|
| **artifact_id** | `sanguine_rose` |
| **Current impl** | Modifier: `sanguine_rose_holder` |
| **Slot** | Weapon (staff) |
| **Special mechanic** | Summon Daedra event (yearly chance to get a temporary combat troop bonus); stress reduction |
| **Lore source** | UESP [Lore:Sanguine Rose](https://en.uesp.net/wiki/Lore:Sanguine_Rose) — staff that summons a Dremora when swung |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_prince_invasion_events.txt` (sanguine.002, sanguine.003) · `mod/events/daedric_champion_events.txt` |

---

### 14. Volendrung
| Field | Value |
|---|---|
| **artifact_id** | `volendrung` |
| **Current impl** | Modifier: `volendrung_bearer` |
| **Slot** | Weapon (war hammer, two-handed) |
| **Special mechanic** | Massive prowess bonus; drain-stamina on enemy in duel; Orc/Malacath synergy |
| **Lore source** | UESP [Lore:Volendrung](https://en.uesp.net/wiki/Lore:Volendrung) — the Ruddy Man; originally the hammer of the Rourken Dwemer clan, claimed by Malacath |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_prince_invasion_events.txt` (malacath.002, malacath.003) · `mod/events/daedric_champion_events.txt` |

---

### 15. Skeleton Key
| Field | Value |
|---|---|
| **artifact_id** | `skeleton_key` |
| **Current impl** | Modifier: `skeleton_key_holder` |
| **Slot** | Trinket / tool |
| **Special mechanic** | Max intrigue scheme bonus; Thieves Guild synergy; opens locked decision options |
| **Lore source** | UESP [Lore:Skeleton Key](https://en.uesp.net/wiki/Lore:Skeleton_Key) — Nocturnal's unbreakable lockpick; opens any lock including metaphorical ones |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_prince_invasion_events.txt` (nocturnal.002) · `mod/events/daedric_champion_events.txt` |

---

### 16. Oghma Infinium
| Field | Value |
|---|---|
| **artifact_id** | `oghma_infinium` |
| **Current impl** | Modifier: `oghma_infinium_holder` |
| **Slot** | Book / trinket |
| **Special mechanic** | One-time: massive stat boost to chosen skill; then a health risk event (the knowledge destroys the mind) |
| **Lore source** | UESP [Lore:Oghma Infinium](https://en.uesp.net/wiki/Lore:Oghma_Infinium) — Mora's tome written by Xarxes; contains forbidden knowledge of all paths |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/modifiers/lore_races_modifiers.txt` · `mod/common/decisions/daedric_prince_decisions.txt` · `mod/events/daedric_champion_events.txt` |

---

### 17. Azura's Star
| Field | Value |
|---|---|
| **artifact_id** | `azura_star` |
| **Current impl** | Modifier: `azura_star_holder` |
| **Slot** | Trinket / gem |
| **Special mechanic** | Reusable soul gem — on character death, small chance of resurrection/survival event; prophetic visions (yearly event) |
| **Lore source** | UESP [Lore:Azura's Star](https://en.uesp.net/wiki/Lore:Azura%27s_Star) — reusable grand soul gem; can trap White Souls |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_prince_invasion_events.txt` (azura.002) · `mod/events/daedric_champion_events.txt` |

---

### 18. Sword of Jyggalag
| Field | Value |
|---|---|
| **artifact_id** | `sword_of_jyggalag` |
| **Current impl** | Modifier: `sword_of_jyggalag_modifier` |
| **Slot** | Weapon (great sword) |
| **Special mechanic** | +8 prowess; causes `jyggalag_crystal_modifier` on counties attacked; perfect-order aesthetic |
| **Lore source** | UESP [Lore:Jyggalag](https://en.uesp.net/wiki/Lore:Jyggalag) — Prince of Order; his blade crystallises all it touches |
| **Lore status** | `[CANON — UESP, ESO: Shivering Isles]` |
| **Current files** | `mod/common/modifiers/lore_races_modifiers.txt` · `mod/events/daedric_prince_invasion_events.txt` (jyggalag chain) |

---

## Priority 2 — Quest-Chain Key Artifacts

These items are the centerpiece of entire event chains and require more complex implementation.

### 19. Amulet of Kings
| Field | Value |
|---|---|
| **artifact_id** | `amulet_of_kings` |
| **Current impl** | Character flag: `amulet_of_kings_bearer`; modifiers: `amulet_of_kings_dragonborn_modifier`; triggers: `has_amulet_of_kings` |
| **Slot** | Necklace / amulet |
| **Special mechanic** | Dragonborn bearer: +legitimacy, blocks Daedric invasions, enables relight_dragonfires decision; Non-Dragonborn: random rejection event |
| **Lore source** | UESP [Lore:Amulet of Kings](https://en.uesp.net/wiki/Lore:Amulet_of_Kings) — Alessia's covenant with Akatosh; seals the Dragonfires |
| **Lore status** | `[CANON — UESP]` Seen in Arena through Oblivion; destroyed in 3E 433 |
| **Current files** | `mod/common/decisions/amulet_of_kings_decisions.txt` · `mod/events/amulet_of_kings_events.txt` · `mod/common/scripted_triggers/thuumvoi_triggers.txt` · `mod/common/scripted_effects/thuumvoi_effects.txt` · `mod/common/modifiers/lore_races_modifiers.txt` |

---

### 20. Mantella
| Field | Value |
|---|---|
| **artifact_id** | `mantella` |
| **Current impl** | Trait: `mantella_seeker`; character flags during numidium event chain |
| **Slot** | Trinket / held gem (large soul gem) |
| **Special mechanic** | Powers Numidium; when a `numidium_awakener` character holds it, enables Dragon Break event; large learning bonus |
| **Lore source** | UESP [Lore:Mantella](https://en.uesp.net/wiki/Lore:Mantella) — the bottled soul of Zurin Arctus (the Underking); Numidium's heart-gem |
| **Lore status** | `[CANON — UESP]` Key item in Elder Scrolls: Redguard and Daggerfall |
| **Current files** | `mod/common/traits/numidium_traits.txt` · `mod/events/numidium_events.txt` |

---

### 21–23. Tools of Kagrenac (Sunder, Keening, Wraithguard)

All three are tracked via character flags in the Kagrenac quest chain:

| Artifact | artifact_id | Slot | Special | Lore Source |
|---|---|---|---|---|
| **Sunder** | `sunder` | Weapon (hammer) | Must be paired with Wraithguard; strikes Heart of Lorkhan | UESP [Lore:Sunder](https://en.uesp.net/wiki/Lore:Sunder) |
| **Keening** | `keening` | Weapon (dagger) | Must be paired with Wraithguard; bleeds divine energy | UESP [Lore:Keening](https://en.uesp.net/wiki/Lore:Keening) |
| **Wraithguard** | `wraithguard` | Glove / hand armour | Enables Sunder + Keening; without it both kill bearer | UESP [Lore:Wraithguard](https://en.uesp.net/wiki/Lore:Wraithguard) |

All three: `mod/events/kagrenac_events.txt` · `mod/common/traits/kagrenac_traits.txt`

Lore note: Vivec created a second Wraithguard specifically for the Nerevarine's hand. `[CANON — in-game book: Nerevar Moon-and-Star, Morrowind]`

---

## Priority 3 — Guild & Faction Artifacts

### 24–26. Nightingale Armor Set
| Artifact | artifact_id | Slot | Special | Lore Source |
|---|---|---|---|---|
| **Nightingale Blade** | `nightingale_blade` | Weapon (sword) | Intrigue bonus; Thieves Guild synergy | UESP [Lore:Nightingale Blade](https://en.uesp.net/wiki/Lore:Nightingale_Blade) |
| **Nightingale Bow** | `nightingale_bow` | Weapon (bow/ranged) | Intrigue + martial; shadow grace | UESP [Lore:Nightingale Bow](https://en.uesp.net/wiki/Lore:Nightingale_Bow) |
| **Nightingale Armor** | `nightingale_armor` | Armour (light/medium) | Intrigue; scheme stealth bonus; stress reduction | UESP [Lore:Nightingale Armor](https://en.uesp.net/wiki/Lore:Nightingale_Armor) |

All three: `mod/events/nightingale_events.txt` · `mod/common/traits/nightingale_traits.txt`

---

## Priority 4 — Ayleid Stone Items

### 27. Welkynd Stone
| Field | Value |
|---|---|
| **artifact_id** | `welkynd_stone` |
| **Current impl** | Trait: `welkynd_attuned` (ayleid_ruins_traits.txt) |
| **Slot** | Trinket / carried gem |
| **Special mechanic** | +learning; monthly piety; single-use event: full stress relief |
| **Lore source** | UESP [Lore:Welkynd Stone](https://en.uesp.net/wiki/Lore:Welkynd_Stone) — crystallised starlight from Magnus' partial exit from Mundus |
| **Lore status** | `[CANON — UESP]` Found in Ayleid ruins throughout Cyrodiil |
| **Current files** | `mod/events/ayleid_ruins_events.txt` (ayleid.002) · `mod/common/traits/ayleid_ruins_traits.txt` |

---

### 28. Varla Stone
| Field | Value |
|---|---|
| **artifact_id** | `varla_stone` |
| **Current impl** | Mentioned in event text only (ayleid.001, guild_leadership events) |
| **Slot** | Trinket / carried gem |
| **Special mechanic** | One-time use: recharges / boosts another held artifact's bonus for 365 days |
| **Lore source** | UESP [Lore:Varla Stone](https://en.uesp.net/wiki/Lore:Varla_Stone) — "Star Teeth"; extreme white soul gem repositories |
| **Lore status** | `[CANON — UESP]` |
| **Current files** | `mod/events/ayleid_ruins_events.txt` (ayleid.001) · `mod/events/guild_leadership_events.txt` (line 938) |

---

## Summary Table

| # | Artifact | artifact_id | Priority | Current File(s) | Status |
|---|---|---|---|---|---|
| 1 | Mehrunes' Razor | `mehrunes_razor` | P1 | daedric_artifacts_traits.txt, daedric_artifacts_events.txt, daedric_champion_events.txt | Trait + modifier |
| 2 | Wabbajack | `wabbajack` | P1 | daedric_artifacts_traits.txt, daedric_prince_invasion_events.txt, daedric_champion_events.txt | Trait + modifier |
| 3 | Skull of Corruption | `skull_of_corruption` | P1 | daedric_artifacts_traits.txt, daedric_prince_invasion_events.txt, daedric_champion_events.txt | Trait + modifier |
| 4 | Ebony Blade | `ebony_blade` | P1 | daedric_artifacts_traits.txt, daedric_prince_invasion_events.txt, daedric_champion_events.txt | Trait + modifier |
| 5 | Ring of Namira | `ring_of_namira` | P1 | daedric_artifacts_traits.txt, daedric_champion_events.txt | Trait + modifier |
| 6a | Dawnbreaker | `dawnbreaker` | P1 | meridia_beacon_traits.txt, meridia_beacon_events.txt, daedric_prince_invasion_events.txt | Trait + modifier |
| 6b | Meridia's Beacon | `meridias_beacon` | P1 | meridia_beacon_traits.txt, meridia_beacon_events.txt | Part of beacon_bearer trait |
| 7 | Mace of Molag Bal | `mace_of_molag_bal` | P1 | lore_races_modifiers.txt, daedric_champion_events.txt | Modifier only |
| 8 | Ring of Hircine | `ring_of_hircine` | P1 | lore_races_modifiers.txt, daedric_champion_events.txt | Modifier only |
| 9 | Saviour's Hide | `saviors_hide` | P1 | lore_races_modifiers.txt, daedric_champion_events.txt | Modifier only |
| 10 | Ebony Mail | `ebony_mail` | P1 | lore_races_modifiers.txt, daedric_champion_events.txt | Modifier only |
| 11 | Masque of Clavicus Vile | `masque_of_clavicus_vile` | P1 | lore_races_modifiers.txt, daedric_prince_invasion_events.txt | Modifier only |
| 12 | Spellbreaker | `spellbreaker` | P1 | lore_races_modifiers.txt, daedric_prince_invasion_events.txt | Modifier only |
| 13 | Sanguine Rose | `sanguine_rose` | P1 | lore_races_modifiers.txt, daedric_prince_invasion_events.txt | Modifier only |
| 14 | Volendrung | `volendrung` | P1 | lore_races_modifiers.txt, daedric_prince_invasion_events.txt | Modifier only |
| 15 | Skeleton Key | `skeleton_key` | P1 | lore_races_modifiers.txt, daedric_prince_invasion_events.txt | Modifier only |
| 16 | Oghma Infinium | `oghma_infinium` | P1 | lore_races_modifiers.txt, daedric_prince_decisions.txt | Modifier only |
| 17 | Azura's Star | `azura_star` | P1 | lore_races_modifiers.txt, daedric_prince_invasion_events.txt | Modifier only |
| 18 | Sword of Jyggalag | `sword_of_jyggalag` | P1 | lore_races_modifiers.txt, daedric_prince_invasion_events.txt | Modifier only |
| 19 | Amulet of Kings | `amulet_of_kings` | P2 | amulet_of_kings_decisions.txt, amulet_of_kings_events.txt, thuumvoi_triggers.txt | Flag + modifier |
| 20 | Mantella | `mantella` | P2 | numidium_traits.txt, numidium_events.txt | Trait + flag |
| 21 | Sunder | `sunder` | P2 | kagrenac_events.txt, kagrenac_traits.txt | Character flag only |
| 22 | Keening | `keening` | P2 | kagrenac_events.txt, kagrenac_traits.txt | Character flag only |
| 23 | Wraithguard | `wraithguard` | P2 | kagrenac_events.txt, kagrenac_traits.txt | Character flag only |
| 24 | Nightingale Blade | `nightingale_blade` | P3 | nightingale_events.txt, nightingale_traits.txt | Not yet implemented |
| 25 | Nightingale Bow | `nightingale_bow` | P3 | nightingale_events.txt, nightingale_traits.txt | Not yet implemented |
| 26 | Nightingale Armor | `nightingale_armor` | P3 | nightingale_events.txt, nightingale_traits.txt | Not yet implemented |
| 27 | Welkynd Stone | `welkynd_stone` | P4 | ayleid_ruins_events.txt, ayleid_ruins_traits.txt | Trait only |
| 28 | Varla Stone | `varla_stone` | P4 | ayleid_ruins_events.txt, guild_leadership_events.txt | Event text mention only |

---

*Last updated: 2E Interregnum audit pass*
*See also: `lore/05_daedric_princes.md` for Prince–artifact associations, `lore/12_mod_pitfalls.md` for known errors.*

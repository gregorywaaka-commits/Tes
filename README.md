# EK2 — Daedric Invasion & Obscure Lore Submod

A submod for **Elder Kings 2** (EK2) — itself a total-conversion mod for **Crusader Kings 3** (CK3) set in the Elder Scrolls universe.  
This submod introduces two major content pillars:

1. **Daedric Princes as an invading force** — Oblivion Gates, escalating phases, unique decisions, and dramatic banishment events.
2. **Obscure Elder Scrolls lore races** — fully scripted mechanics for the Echmer, Maormer, Sload, Kothringi, Kamal, Tang Mo, Elder Towers, Dreugh, Imga, and Keptu/Nedes.

---

## Table of Contents

1. [Overview](#overview)
2. [Features — Daedric Invasion](#features--daedric-invasion)
3. [Features — Obscure Lore Races](#features--obscure-lore-races)
4. [Daedric Princes Included](#daedric-princes-included)
5. [Lore Races & Mechanics Breakdown](#lore-races--mechanics-breakdown)
6. [Mechanics Breakdown — Daedric Invasion](#mechanics-breakdown--daedric-invasion)
7. [File Structure](#file-structure)
8. [Installation](#installation)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Modding Notes & EK2 Integration Points](#modding-notes--ek2-integration-points)

---

## Overview

Once certain in-game conditions are met (or via a random yearly pulse), a Daedric Prince is chosen to lead an invasion of Mundus.  
The invasion unfolds in **up to three escalating phases**, each opening more Oblivion Gates and adding more Daedric armies to the map.  
Mortal rulers can resist, rally together, individually close Gates, or even bend the knee to survive.

The submod also adds rich event chains, decisions, and traits for the most obscure and fascinating races and lore concepts in the Elder Scrolls universe — each grounded in canonical or near-canonical sources.

---

## Features — Daedric Invasion

| Feature | Description |
|---|---|
| **5 Daedric Princes** | Mehrunes Dagon, Molag Bal, Boethiah, Hircine, Namira — each with unique stats, traits, and flavour text |
| **Oblivion Gates** | Open randomly in counties during the invasion; must be closed by brave (martial/prowess-checked) characters |
| **3-Phase Escalation** | Gates and armies grow every ~5 years; the invasion becomes significantly harder over time |
| **Player Decisions** | Rally vassals, submit to the Prince, or personally attempt a banishment |
| **Unique Traits** | `oblivion_touched`, `oblivion_slayer`, `daedric_vassal`, `daedric_champion`, per-Prince aspect traits |
| **Custom CB** | Daedric Invasion CB; winning/losing shifts the invasion phase |
| **Full Localisation** | English localisation for all events, decisions, traits, and CB strings |

---

## Features — Obscure Lore Races

| Race / Concept | Lore Source | Key Mechanic |
|---|---|---|
| **Echmer** | Uutak Mythos (Yneslea bat-mer) | Yneslea expedition decision; Echolalia Fantasia study; Dwemer heritage reveal |
| **Maormer** | Canon (UESP) — Sea Elves of Pyandonea | King Orgnum immortality; sea serpent taming; snake magic; storm magic; Altmer hatred events |
| **Sload** | Canon (UESP) — Slug necromancers of Thras | Thrassian Plague event chain; All-Flags Navy; Coral Tower siege |
| **Kothringi** | Canon (UESP) — Silver-skin humans of Black Marsh | Knahaten Flu outbreak + spread; Crimson Ship exile; Clavicus Vile bargain (Stillrise Village) |
| **Kamal** | Canon (UESP) — Akaviri snow demons | Seasonal invasion mechanic; Ada'Soom Dir-Kamal NPC; Vivec intervention event |
| **Tang Mo** | Canon (UESP) — Monkey-folk of Akavir | Community rally vs Kamal; Ka Po' Tun alliance |
| **Elder Towers** | Canon (UESP) — White-Gold, Adamantine, Red Mountain, Coral | Tower Stone as relic/holding; world stability tracker; Tower sabotage decision |
| **Dreugh** | Canon (UESP) — Ancient aquatic humanoids | Land/sea life-cycle trait swap; Old Knocker worship events |
| **Imga** | Canon (UESP) — Great Apes of Valenwood | Altmer-imitating aristocrats; Marukh's legacy event |
| **Keptu / Nedes** | Canon (UESP) — Pre-Imperial human tribes | Bloodroot Forge discovery; Nedic oral history events |

---

---

## Daedric Princes Included

| Prince | Domain | Invasion Style |
|---|---|---|
| **Mehrunes Dagon** | Destruction, Change | Direct military assault; heavy armies; most common |
| **Molag Bal** | Domination, Corruption | Dread-focused; corrupts rulers; vampiric armies |
| **Boethiah** | Plots, Assassination | Intrigue-heavy; seeds court traitors; weaker armies but deadly off-map |
| **Hircine** | The Hunt | Werewolf packs; prowess-heavy champions; targets isolated rulers |
| **Namira** | Decay, Darkness | Plague-like spread; unchecked Gates cause disease modifiers |

---

## Mechanics Breakdown — Daedric Invasion

### Invasion Trigger
- Fires from the **yearly random pulse** (`on_yearly_pulse`).
- Hard-blocked if another invasion is already active (`global_var:active_daedric_prince`).
- Requires at least one realm of size ≥ 30 as a target.
- Guarded by a minimum date (`2E.100`) to prevent early-game triggers.

### Phases
| Phase | Description | Gates Opened |
|---|---|---|
| 1 | Initial breach — 3 Gates, standard army | 3 |
| 2 | Escalation — 2 more Gates, reinforcements | +2 |
| 3 | Full power — 2 more Gates, elite Dremora | +2 |

Phase advances every ~5 in-game years (tracked via `global_var:daedric_invasion_started_days`).

### Oblivion Gates
- Stored as a **county variable** (`oblivion_gate_active`).
- Apply a permanent province modifier (`oblivion_gate_province_modifier`) until closed.
- Can also spawn during **county occupation** events.
- Closing a Gate requires martial ≥ 14 **or** prowess ≥ 16, and awards the `oblivion_slayer` trait + prestige/piety.

### Ending the Invasion
The invasion ends when:
1. The **Banish decision** succeeds (requires `oblivion_slayer` or `daedric_champion`, 2 000 prestige, 1 000 piety, martial ≥ 12, prowess ≥ 15).
2. The Prince's **war phase counter** reaches 0 through repeated military defeats (each defeat subtracts 1 phase).

---

## Lore Races & Mechanics Breakdown

### Echmer (Yneslea Bat-Mer — Uutak Mythos)
The Echmer are uplifted bats, engineered by the Noraken clan of Dwemer using tonal architecture. They inhabit the remote Yneslea archipelago in the Padomaic Ocean and have developed a society built on science, isolationism, and their unique **Echolalia Fantasia** — a sound-based magical discipline.

**What needs to be in EK2 first:** `title:k_yneslea` holding and Echmer culture/faith identifiers.

| Feature | Details |
|---|---|
| Expedition Decision | Coastal rulers may spend prestige + gold to send ships east; establishes contact |
| Echolalia Study | Decision to learn the art from an Echmer court scholar; progresses to mastery |
| Dwemer Heritage Reveal | Event chain revealing the Noraken clan's role in their creation |
| Traits | `echmer_heritage`, `echolalia_adept`, `echolalia_master`, `dwemer_uplifted_lineage`, `yneslea_scholar` |

### Maormer (Sea Elves of Pyandonea)
Exiled Aldmer who became masters of the sea, snake magic, and storm sorcery. Led by the immortal King Orgnum — who grows *younger* with each passing century — from their mist-shrouded archipelago of Pyandonea. Perpetually at war with the Altmer.

**What needs to be in EK2 first:** Maormer culture, `maormer_serpent_faith`, `title:k_pyandonea`, and `orgnum_alive` global var if King Orgnum is already in EK2.

| Feature | Details |
|---|---|
| Maormer Raids | Annual random events against coastal rulers; pay tribute or repel |
| Sea Serpent Taming | Decision requiring high martial + prowess; grants powerful command modifiers |
| Orgnum's Blessing | Decision granting immortality; requires very high piety + diplomacy |
| Storm Magic | Sea witch event — calls tempests to penalise neighbouring coastal realms |
| Altmer Hatred | Escalating opinion modifier and war favour against Altmer rulers |
| Traits | `maormer_heritage`, `snake_magic_adept`, `pyandonean_sea_witch`, `sea_serpent_master`, `orgnum_blessed` |

### Sload (Slug Necromancers of Thras)
The most reviled race in Tamriel. These slug-like beings from the Coral Tower archipelago of Thras are necromancers without equal — and in 1E 2200, they unleashed the **Thrassian Plague**, killing half of Tamriel. The response was the All-Flags Navy, which sank Thras entirely.

**What needs to be in EK2 first:** Sload culture, `sload_death_faith`, `title:c_thras` holding.

| Feature | Details |
|---|---|
| Thrassian Plague | World-spanning plague event chain with monthly spread ticks |
| All-Flags Navy | Coalition formation event — coastal rulers unite against Thras |
| Coral Tower Siege | Dramatic multi-option confrontation with failure/success branches |
| Coral Tower Whispers | A Sload High Necromancer channels the Tower's power |
| Traits | `sload_heritage`, `sload_necromancer`, `sload_high_necromancer`, `plague_bearer` |

### Kothringi (Silver-Skinned Humans of Black Marsh)
The "Lustrous Folk" — metallic-skinned humans, accomplished sailors, nearly destroyed by the **Knahaten Flu** in 2E 560. Some fled on the doomed Crimson Ship; others in Stillrise Village bargained with **Clavicus Vile** for survival and became immortal undead.

**What needs to be in EK2 first:** Kothringi culture, `kothringi_pantheon_faith`, Black Marsh geographical region tags.

| Feature | Details |
|---|---|
| Knahaten Flu | Monthly spreading plague; hits Kothringi hardest; Argonian heartland immune |
| Crimson Ship | Decision to flee by sea; subsequent "turned away" event chain |
| Clavicus Vile Bargain | Stillrise Village fate — survival at a Daedric price |
| Traits | `kothringi_heritage`, `knahaten_immune`, `crimson_ship_survivor`, `clavicus_bargain_made` |

### Kamal (Akaviri Snow Demons)
The Kamal freeze solid each winter and thaw each summer to invade their neighbours — usually the Tang Mo of Akavir. In 2E 572 their warlord **Ada'Soom Dir-Kamal** led a catastrophic invasion of Tamriel, repelled largely by the Tribunal god Vivec.

**What needs to be in EK2 first:** Kamal culture, `kamal_war_faith`, `title:d_kamal_lands`.

| Feature | Details |
|---|---|
| Seasonal Invasion | Yearly world event triggers Dir-Kamal spawn + army; winter ends the campaign |
| Vivec Intervention | If Dunmer Tribunal-faith rulers exist at sufficient strength, Vivec can end the invasion |
| Kamal Ice Curse | Occupied counties gain a freezing province penalty |
| Traits | `kamal_heritage`, `kamal_thawed`, `dir_kamal_herald` |

### Elder Towers (Metaphysical Pillars of Mundus)
The Towers of Nirn — Adamantine (Direnni/Ur-Tower), White-Gold, Red Mountain, Orichalc (Yokuda, destroyed), Coral (Thras) — are both physical structures and metaphysical anchors preventing Mundus from dissolving back into Oblivion.

**What needs to be in EK2 first:** `title:c_imperial_city`, `title:c_balfiera`, `title:c_red_mountain`, `title:c_thras` holdings.

| Feature | Details |
|---|---|
| Tower Stone Claim | Decision to become Keeper of a Tower's Stone; grants `tower_stone_keeper` and province buffs |
| Tower Sabotage | Intrigue-based decision to crack a rival's Stone; can trigger reality fracture |
| World Stability Tracker | `global_var:active_tower_count`; drops below 1 → reality fracture events |
| Per-Tower Flavour | White-Gold (Cyrodiil reshaping), Adamantine (Ur-Tower wisdom), Red Mountain (Heart of Lorkhan) |
| Traits | `tower_stone_keeper`, `tower_stone_lost` |

### Dreugh (Ancient Aquatic Humanoids)
Pre-dating most of Tamriel's recorded history, Dreugh are part-crustacean, part-humanoid beings who follow a life cycle alternating between **sea phase** and **land phase**. They revere a deity called Old Knocker.

| Feature | Details |
|---|---|
| Life-Cycle Swap | Yearly event swaps `dreugh_land_phase` ↔ `dreugh_sea_phase` trait |
| Old Knocker Worship | Sea-phase vigil event grants a blessing modifier |
| Traits | `dreugh_heritage`, `dreugh_land_phase`, `dreugh_sea_phase` |

### Imga (Great Apes of Valenwood)
The Imga are intelligent great apes native to Valenwood who developed a deep admiration — and elaborate imitation — of Aldmeri culture. The prophet Marukh, who sparked the First Empire's Alessian Order, was an Imga.

| Feature | Details |
|---|---|
| Court Arrival | An Imga aristocrat arrives — accept their Altmer affectations or react with unease |
| Marukh's Legacy | Choice event: embrace Altmeri emulation or forge an independent Imga identity |
| Traits | `imga_heritage`, `altmer_imitator` |

### Keptu & Nedes (Pre-Imperial Human Tribes)
The Keptu were a distinct human tribe (possibly Nedic) in central Tamriel, renowned for their **Bloodroot Forge** — metalworking rivalling the Ayleids and Dwemer. The Nedes broadly represent the ancient pre-Imperial human tribes whose oral traditions predate written history.

| Feature | Details |
|---|---|
| Bloodroot Forge | Excavation event; grants a men-at-arms maintenance reduction modifier |
| Nedic Elder | Oral history event; grants learning and piety bonuses |
| Traits | `keptu_lineage`, `nedic_elder` |

---

## File Structure

```
mod/
├── descriptor.mod
├── common/
│   ├── on_actions/
│   │   ├── daedric_invasion_on_actions.txt      # Daedric invasion hooks
│   │   └── lore_races_on_actions.txt            # Yearly/monthly hooks for all lore races
│   ├── decisions/
│   │   ├── daedric_invasion_decisions.txt       # Rally, submit, banish
│   │   └── lore_races_decisions.txt             # Expedition, sea serpent, plague, Tower, etc.
│   ├── scripted_triggers/
│   │   ├── daedric_invasion_triggers.txt        # Invasion state guards
│   │   └── lore_races_triggers.txt              # Per-race trigger conditions
│   ├── scripted_effects/
│   │   ├── daedric_invasion_effects.txt         # begin/open gate/close gate/escalate/end
│   │   └── lore_races_effects.txt               # Echmer contact, Maormer raid, plague, Tower, etc.
│   ├── character_templates/
│   │   ├── daedric_princes.txt                  # 5 Daedric Prince NPC templates
│   │   └── lore_races.txt                       # Echmer, Maormer, Sload, Kothringi, Kamal, etc.
│   ├── traits/
│   │   ├── daedric_invasion_traits.txt          # Invasion-specific traits
│   │   └── lore_races_traits.txt                # All obscure race traits
│   ├── modifiers/
│   │   └── lore_races_modifiers.txt             # Province/character modifiers for all modules
│   └── casus_belli_types/
│       └── daedric_invasion_cb.txt              # Invasion CB
├── events/
│   ├── daedric_invasion_events.txt              # Main invasion chain
│   ├── oblivion_gate_events.txt                 # Gate open/close events
│   ├── echmer_events.txt                        # Yneslea expedition, Echolalia Fantasia
│   ├── maormer_events.txt                       # Raids, sea serpents, Orgnum, storm magic
│   ├── sload_events.txt                         # Thrassian Plague, All-Flags Navy, Coral Tower
│   ├── kothringi_events.txt                     # Knahaten Flu, Crimson Ship, Clavicus Vile
│   ├── kamal_events.txt                         # Seasonal invasion, Dir-Kamal, Vivec
│   ├── towers_events.txt                        # Tower claim, sabotage, world stability
│   └── minor_lore_races_events.txt              # Dreugh, Imga, Tang Mo, Keptu, Nedes
└── localization/
    └── english/
        ├── daedric_invasion_l_english.yml       # Daedric invasion strings
        └── lore_races_l_english.yml             # All obscure lore race strings
```

---

## Installation

1. Place the `mod/` folder inside your CK3 mod directory:  
   `Documents/Paradox Interactive/Crusader Kings III/mod/lore_expansion/`
2. Copy `descriptor.mod` to the same `mod/` root folder.
3. Enable **Elder Kings 2** first, then enable **EK2 — Daedric Invasion** in the CK3 launcher.
4. Load order: EK2 → this submod.

---

## Implementation Roadmap

### Already scripted
- [x] Mod descriptor
- [x] Daedric Prince character templates (5 Princes)
- [x] Daedric invasion traits (prince markers, aspect traits, mortal rewards)
- [x] Daedric invasion scripted triggers + effects
- [x] Daedric Invasion CB
- [x] Daedric invasion on-actions (monthly tick, yearly trigger, occupation hook, death cleanup)
- [x] Player decisions (rally, submit, banish)
- [x] Daedric invasion event chain (`.000` – `.060`)
- [x] Oblivion Gate event chain (`.001` – `.010`)
- [x] **Echmer** — traits, NPC templates, expedition + Echolalia Fantasia events, decisions
- [x] **Maormer** — King Orgnum template, sea witch template, traits, 8 events, 2 decisions
- [x] **Sload** — Archmaster template, traits, Thrassian Plague event chain (6 events), 1 decision
- [x] **Kothringi** — Chief template, traits, Knahaten Flu event chain (5 events), 2 decisions
- [x] **Kamal** — Dir-Kamal template, traits, seasonal invasion chain (5 events)
- [x] **Tang Mo** — Hero template, traits, community rally + Ka Po' Tun alliance events
- [x] **Elder Towers** — world stability tracker, 8 events, 2 decisions, per-tower flavour
- [x] **Dreugh** — Life-cycle trait swap event, Old Knocker worship event
- [x] **Imga** — Court arrival event, Marukh's Legacy event
- [x] **Keptu / Nedes** — Bloodroot Forge event, Nedic Elder oral history event
- [x] Province modifiers for all modules (`lore_races_modifiers.txt`)
- [x] Full English localisation for all modules

### Still needed before release
- [ ] **Men-at-arms types** — `daedra_footsoldiers`, `daedra_cavalry`, `clannfear`, `golden_saint`, `dremora`, `kamal_warriors`, `kamal_ice_mages` (EK2 may already have some)
- [ ] **Opinion modifiers** — `rallied_together_opinion`, `welcomed_envoy_opinion`, `tolerated_necromancer`, etc.
- [ ] **Faith & culture identifiers** — confirm EK2 ids for all race faiths/cultures; update templates
- [ ] **Title scopes** — verify `title:k_yneslea`, `title:k_pyandonea`, `title:c_thras`, `title:c_balfiera`, `title:c_red_mountain`, `title:d_deadlands`, `title:d_kamal_lands`
- [ ] **Geographical regions** — confirm EK2 region identifiers (`world_black_marsh`, `world_skyrim_north`, etc.)
- [ ] **GFX** — decision icons, event illustrations (CK3 `.dds` format)
- [ ] **Balance pass** — playtest all event chains, stat thresholds, plague spread rates, army sizes
- [ ] **Additional Daedric Princes** — Sheogorath, Malacath, Meridia, Vaermina
- [ ] **Sload CB** — a custom CB for the All-Flags Navy war declaration
- [ ] **Tang Mo / Ka Po' Tun cultures** — confirm or create EK2 Akaviri culture identifiers

---

## Modding Notes & EK2 Integration Points

### Daedric Invasion
- All global state is stored in `global_var` variables prefixed `daedric_invasion_` or `active_daedric_prince` — safe to check from other mods.
- The `daedric_prince` trait flag can be used by other event chains to gate content.
- The `oblivion_gate_active` county variable is the canonical source of truth for Gate presence.
- EK2 religious identifiers (e.g. `mehrunes_dagon_faith`) must match whatever EK2 uses; adjust `character_templates/daedric_princes.txt` if the names differ.
- The minimum date guard in `daedric_invasion_triggers.txt` uses `2E.100`. Adjust to fit your intended campaign start dates.

### Obscure Lore Races
- **Echmer**: Set `global_var:echmer_contact_established` to `yes` externally to skip the expedition and start with contact already made.
- **Maormer**: Set `global_var:orgnum_alive` to `yes` at game start if King Orgnum is a playable/NPC character in EK2; the blessing decision checks this.
- **Sload**: The `thrassian_plague_active` global var gates the Plague CB and prevents stacking with the Knahaten flu.
- **Kothringi**: The Knahaten Flu date range (`2E.550`–`2E.600`) matches the canonical outbreak period. Adjust if EK2's campaign window differs.
- **Elder Towers**: The `active_tower_count` global var is the single source of truth for world stability. Other mods can read and write it safely with `change_global_variable`.
- **Plague precedence**: The `sload_plague_can_trigger` trigger blocks the Thrassian Plague if the Knahaten Flu is active, and vice versa — only one world-spanning plague at a time.
- All lore race traits use the `flag = <trait_name>` convention for cross-module detection.

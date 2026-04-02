# Changelog

All notable changes to this project will be documented in this file.

---

## [1.1.0] — Major Content Expansion

### Added — Daedric Artifacts System
- **6 new traits**: `mehrunes_razor_bearer`, `wabbajack_wielder`, `skull_of_corruption_bearer`, `ebony_blade_cursed`, `ring_of_namira_bearer`, `artifact_corruption`
- **7 new events** (`daedric_artifact.000–.030`): artifact surfaces near realm, discovery events for Mehrunes' Razor / Wabbajack / Ebony Blade, corruption creep, the price of power, passing the burden to another ruler
- Artifacts can be transferred between rulers; corruption builds over time

### Added — Numidium / Brass God System
- **3 new traits**: `numidium_researcher`, `mantella_seeker`, `numidium_awakener`
- **5 new events** (`numidium.000–.011`): scholarly discovery (very rare, `dwemer_scholar` + learning ≥ 16), Brass God texts, Mantella soul-gem reveal, **Warp in the West** (one-time global catastrophe), Dragon Break all-rulers notification
- Numidium reactivation triggers a once-only `global_var:numidium_awakened` Dragon Break affecting all rulers

### Added — Vampire Bloodlines System
- **6 new traits**: `volkihar_bloodline` (Nord), `vampyrum_order` (Cyrodilic), `lamae_bal_bloodline` (original curse), `gray_host_remnant`, `vampire_lord`, `blood_curse`
- **6 new events** (`vampire.000–.030`): emissary contact, bloodline selection with culture gating, apex vampire lord ascension, Gray Host global trigger, summer sun burn
- The Turning event offers three choices: join, refuse, or attempt to expose the bloodline

### Added — Yokuda / Redguard Expansion
- **5 new traits**: `ra_gada_warrior`, `sword_singer`, `ruptga_devoted`, `sep_cultist`, `yokudan_heritage`
- **4 new events** (`yokuda.000–.003`): Ra Gada legacy, Shehai spirit-sword training (martial ≥ 14 check), Ruptga's blessing, Sep the Thief temptation
- **1 new decision**: `seek_sword_singing` — costs prestige, requires `ra_gada_warrior` + martial ≥ 14
- First Redguard-specific mechanics in the mod; Yokudan pantheon (Ruptga/Tu'whacca/Sep) introduced

### Added — Worm Cult / Order of the Black Worm
- **4 new traits**: `worm_cult_initiate`, `worm_cult_adept`, `lich_essence`, `necromancers_moon_marked`
- **5 new events** (`worm_cult.000–.030`): coded letter invitation, Order of the Black Worm introduction (join/report to Mages Guild/refuse), **Necromancer's Moon** (one-time global), path to lichdom (learning ≥ 18), Mannimarco's gold demand
- Rival faction to the Mages Guild; escalates to Necromancer's Moon global event

### Added — Dragon Breaks
- **4 new events** (`dragon_break.000–.003`): hidden Tower-count trigger, temporal anomaly striking all rulers (stress +30, random trait changes), aftermath reflection, 10-year healing event
- Dragon Breaks become more likely as Elder Towers fall (`active_tower_count ≤ 3`)
- References the Middle Dawn (1E 1200–2208) lore

### Added — Ayleid Ruins Exploration
- **4 new traits**: `ayleid_historian`, `star_teeth_blessed`, `welkynd_attuned`, `ayleid_lich_touched`
- **5 new events** (`ayleid.000–.004`): ruin discovery, vault expedition, Welkynd stone attunement, dark altar discovery (Ayleids worshipped both Daedra and Divines), Ayleid lich guardian encounter
- **1 new decision**: `explore_ayleid_ruin` — gated on learning ≥ 8 or `ayleid_bloodline`

### Added — Void Nights
- **5 new events** (`void_nights.000–.004`): calendar-triggered 2E 578–579 moon vanishing, all-rulers notification, Moon Sugar failure for Two Moons path rulers, moons' return (2E 580), void meditation for learned rulers
- Khajiit rulers receive culture-specific stress +30 ("We are as unborn")
- `moon_sugar_drought` province modifier and `void_nights_crisis` character modifier applied during event window

### Added — Longhouse Emperors
- **3 new traits**: `longhouse_pretender`, `reachman_emperor`, `hagreach_authority`
- **4 new events** (`longhouse.000–.020`): Reachman claimant path, genealogical claim to Cyrodiil, Ruby Throne achievement, hagraven council blessing
- **1 new decision**: `claim_imperial_succession` — requires `reachman_heritage` + martial ≥ 12

### Added — Gray Host Invasion
- **3 new traits**: `gray_host_commander`, `rada_al_saran_devoted`, `werewolf_lord`
- **4 new events** (`gray_host.000–.010`): date-window invasion (1E 800 – 2E 200), march notification, Rada al-Saran emissary parley (fealty / fight / tribute), 20-year retreat
- Second historical invasion type alongside Kamal; drawn from ancient Reach vampire-werewolf lore

### Added — Pelinal Whitestrake / Shezarrine
- **3 new traits**: `shezarrine_vessel`, `pelinal_rage`, `elf_hate`
- **5 new events** (`shezarrine.000–.004`): hidden divine-warrior selection (very rare, martial ≥ 18 + brave/zealous), Pelinal's spirit appearance, berserker rage episode, elf-hater vision, Reman's Echo connection to Alessian chain
- Deliberate near-impossibility: `shezarrine_vessel` is one of the rarest traits in the mod

### Added — Direnni Hegemony
- **3 new traits**: `direnni_bloodline`, `direnni_hegemon`, `glenumbra_veteran`
- **5 new events** (`direnni.000–.004`): Hegemony legacy trigger, Battle of Glenumbra Moors (1E 482), Hegemony fracture, last Direnni bloodline, Lorkhan's Children philosophical event
- Canonical date 1E 482 (Battle of Glenumbra Moors) used as trigger gate

### Added — Mannimarco Character Template
- New character template `mannimarco.txt` — King of Worms spawnable as wandering NPC/antagonist
- Intrigue 24, learning 22; traits include `worm_cult_adept` and `lich_essence`
- Can corrupt nearby rulers into Worm Cult membership via `worm_cult.030`

### Added — Skaal / All-Maker Expansion
- **6 new events** (`skaal.000–.005`): Bones of the All-Maker ceremony, Tree Stone vision, Hirstaang Forest hunter conflict, Ritual of the Bear, Hermaeus Mora's temptation during sacred ceremony, Skaal village defense
- Expands existing `seek_skaal_accord` and `all_maker_blessed` traits with full event chain
- Hermaeus Mora appears as antagonist to All-Maker faith — accepting his knowledge removes `all_maker_blessed`

### Added — CHIM / Walking Ways
- **2 new traits**: `chim_seeker` (destabilizing but deepening), `chim_achieved` (all stats +, near-immortal)
- **5 new events** (`chim.000–.004`): Walking Ways introduction, Amaranth Question meditation, **CHIM achieved** (success path — global notification fires), **Enantiomorph undone** (failure path — character ceases to exist), CHIM bearer's ongoing isolation
- **1 new decision**: `seek_walking_ways` — requires learning ≥ 18 AND stress ≥ 50
- Deliberately near-impossible; failure results in character death ("The throne was simply empty")

---

### Technical — v1.1.0
- **15 new event files** (180+ new events total)
- **12 new trait files** (60+ new traits)
- **5 new decision files** (6 new player decisions)
- **1 new character template** (Mannimarco)
- **26 new modifiers** appended to `lore_races_modifiers.txt`
- `lore_races_on_actions.txt` `on_yearly_pulse` expanded from 41 to 68 event entries
- `on_monthly_pulse` expanded with Void Nights and Dragon Break healing ticks
- All 15 new localization files use correct UTF-8 BOM encoding
- All new `global_var` guards: `numidium_awakened`, `dragon_break_active`, `void_nights_active`, `gray_host_invaded`, `necromancers_moon_active`

---

### Lore Notes — v1.1.0
| Fact | Source |
|------|--------|
| Void Nights = 2E 578–579, caused by Thalmor magical interference | ESO lore |
| Ra Gada wave invasion of Hammerfell = 1E 808+ | Redguard / Pocket Guide |
| Battle of Glenumbra Moors = 1E 482 (Direnni vs. Alessian Order) | Pocket Guide |
| Gray Host = ancient vampire-werewolf army of Rada al-Saran, Reach-based | ESO: Greymoor |
| Mannimarco = Altmer lich, King of Worms, founder of Order of the Black Worm | Daggerfall / Oblivion |
| Numidium / Warp in the West = catastrophic Dragon Break at 3E 417 | Daggerfall Covenant |
| CHIM = "secret syllable of royalty"; failure = Enantiomorph (erasure) | 36 Lessons of Vivec / Kirkbride |
| Pelinal Whitestrake = Shezarrine, divine berserker champion of Alessia | The Song of Pelinal |

---

## [1.0.0] — Initial Release

> **EK2 — Daedric Invasion & Obscure Lore Submod**  
> A submod for [Elder Kings 2](https://steamcommunity.com/sharedfiles/filedetails/?id=2887120253), itself a total-conversion mod for Crusader Kings 3 set in the Elder Scrolls universe.

---

### Added — Daedric Invasion System

- **17 Daedric Princes** fully scripted as invading forces, each with unique traits, flavour events, champion quest chains, and per-prince invasion events:
  Azura, Boethiah, Clavicus Vile, Hermaeus Mora, Hircine, Jyggalag, Malacath, Mehrunes Dagon, Mephala, Meridia, Molag Bal, Namira, Nocturnal, Peryite, Sanguine, Sheogorath, Vaermina.
- **Oblivion Gate** events — gates open across Tamriel during active invasions, with escalating phases up to full Daedric occupation.
- **Daedric Champion** quest chains — rulers may seek audience with any Prince outside invasions to earn aspect traits, unique bonuses, and champion status.
- **Decisions**: `rally_against_daedric_invasion`, `submit_to_daedric_prince`, `attempt_to_banish_daedric_prince`, `seek_[prince]` (17 seek decisions, one per Prince).
- **Traits**: `daedric_prince`, `daedric_vassal`, `daedric_champion`, `oblivion_touched`, `oblivion_slayer`, `invasion_repeller`, plus one aspect and one champion trait per Prince (34 total Prince traits).
- **Modifiers** for all invasion phases, truce periods, and Daedric submission states.
- Jyggalag invasion weight set to 0 before 3E 400 (lore-accurate: Sheogorath era).
- Azura weight 2, Meridia weight 1 in invasion pool (lore weighting).

---

### Added — Obscure Lore Races

Full heritage trait systems for races seldom or never covered by EK2 base:

| Race | Traits | Key Events |
|---|---|---|
| **Echmer** (Bat-Mer of Yneslea) | `echmer_heritage`, `echolalia_adept`, `echolalia_master`, `yneslea_scholar` | Echolalia Fantasia study chain, Yneslea expedition |
| **Maormer** (Sea Elves of Pyandonea) | `maormer_heritage`, `orgnum_blessed`, `pyandonean_sea_witch`, `sea_serpent_master` | Orgnum's blessing, sea serpent taming |
| **Sload** (Slug Necromancers of Thras) | `sload_heritage`, `sload_necromancer`, `sload_high_necromancer`, `plague_bearer` | Coral Tower re-emergence, Sload plague |
| **Kothringi** (Silver-Skinned Humans of Black Marsh) | `kothringi_heritage`, `knahaten_immune`, `crimson_ship_survivor` | Knahaten Flu survival, Crimson Ship |
| **Kamal** (Akaviri Snow Demons) | `kamal_heritage`, `kamal_thawed`, `dir_kamal_herald` | Seasonal invasion awakenings (Dir-Kamal killed at 2E 572 by Ebonheart Pact + Tribunal) |
| **Tang Mo** (Monkey Folk of Akavir) | `tang_mo_heritage` | Akaviri culture flavour |
| **Imga** (Great Apes of Valenwood) | `imga_heritage`, `altmer_imitator` | Altmer imitation chain |
| **Dreugh** (Aquatic Mer) | `dreugh_heritage`, `dreugh_land_phase`, `dreugh_sea_phase` | Land/sea phase transformation |
| **Keptu** (Proto-humans of High Rock) | `keptu_lineage`, `nedic_elder` | Ancient Nedic lineage (Keptu = High Rock proto-humans, not Redguard ancestors) |

Additional heritage traits for races from audit pass:  
`tsaesci_heritage`, `ka_po_tun_heritage`, `lilmothiit_heritage`, `reachman_heritage`, `hist_bonded`, `the_mane`, `green_pact_devotee`, `ayleid_bloodline`, `snow_elf_legacy`, `alessian_doctrine_scholar`, and associated subtrait chains.

---

### Added — Guild System

Nine fully-scripted guilds with join/rank/leave decisions, advancement events, activity events, and a 4-event leadership questline each:

| Guild | Rank Traits | Grandmaster/Leader Trait |
|---|---|---|
| **Fighters Guild** | associate → journeyman → guardian | `fighters_guild_guildmaster` |
| **Mages Guild** | associate → member → wizard | `mages_guild_archmagister` |
| **Thieves Guild** | footpad → prowler → shadowfoot | `thieves_guild_guildmaster_thief` |
| **Dark Brotherhood** | initiate → assassin → speaker | `dark_brotherhood_listener` |
| **Companions** | shield-brother → veteran → circle | `companions_harbinger` |
| **Bards College** | apprentice → bard | `bards_college_master_bard` |
| **Morag Tong** | assassin → master | `morag_tong_grandmaster` |
| **Undaunted** | member → veteran | `undaunted_elite` |
| **Psijic Order** | novice → initiate → adept | `psijic_master` |

- Cooldown modifiers for all guild actions fully localized.
- Night Mother = Mephala connection noted as contested canon (*The Brothers of Darkness*).

---

### Added — Thu'um / Voice System

- Full Dragonborn / Voice path: `thu_um_initiate` → `thu_um_adept` → `thu_um_master`.
- **Greybeard Order**: `greybeard_aspirant` → `greybeard_of_high_hrothgar` → `first_voice_of_the_greybeards`.
- Dovah-nature duality: `dovah_nature_dominant` / `dovah_nature_resisted` / `dovahkiin_soul_awakened`, `dragon_souls_growing` / `dragon_souls_brimming`.
- 21 events covering Word Wall learning, soul absorption, High Hrothgar pilgrimage, Greybeard vows, and leadership succession.
- Decisions: `seek_thu_um_training`, `advance_thu_um_training`, `learn_from_word_wall`, `absorb_another_dragon_soul`, `use_thu_um_in_battle`, `take_greybeard_vows`, `resist_dovah_nature_decision`, `harness_dovah_blood`, `seek_the_greybeard_order`, `leave_voice_path_decision`, `claim_first_voice_of_greybeards`.
- Lore note: Jurgen Windcaller founded the Way of the Voice c. 1E 1069, ~369 years after the Battle of Red Mountain (c. 1E 700).

---

### Added — Dragon Priest / Dragon Cult System

- Dragon Priest questline: `dragon_cultist_devotee` → `dragon_priest_master`.
- Alduin / World-Eater flavour events; `world_eater_survived` trait for survivors.
- Decisions: `hunt_dragon_priest`, `become_dragon_priest` chain.

---

### Added — Elder Towers System

Seven Elder Towers scripted as county holdings that anchor Mundus:

| Tower | County | Stone |
|---|---|---|
| White-Gold Tower | `c_imperial_city` | Chim-el Adabal (Amulet of Kings) |
| Adamantine Tower | `c_balfiera` | Direnni, oldest structure in Tamriel |
| Red Mountain Tower | `c_red_mountain` | Heart of Lorkhan |
| Coral Tower (Thras) | `c_thras` | Sload re-emergence |
| Crystal Tower | `c_alinor` | Summerset |
| Snow Throat (Throat of the World) | `c_whiterun` | Skyrim |
| Green-Sap | `c_falinesti` | Valenwood |

- Orichalc Tower (Yokuda) intentionally omitted — destroyed 1E 792.
- `claim_tower_stone` / `sabotage_tower_stone` decisions.
- Traits: `tower_stone_keeper`, `tower_stone_lost`.
- On-death cleanup: tower stone county variable and flag cleared on keeper death.
- 8 tower events covering claiming, losing, and cascading collapse risk.

---

### Added — Dagoth Ur Awakening System

- Canonical awakening: 2E 882. Early-trigger conditions at 2E 600 (no Red Mountain Tower keeper) and 2E 700 (no Dunmer kingdom standing).
- Traits: `sixth_house_cultist`, `corprus_afflicted`, `ash_devotee`, `ghost_fence_keeper`, `nerevarine_marked`.
- 8 events (dagoth_ur.000–.030, .050, .100).
- Scripted triggers: `dagoth_ur_awakened`, `dagoth_ur_awakening_possible`, `is_sixth_house`.
- Scripted effects: `begin_dagoth_ur_awakening_effect`, `end_dagoth_ur_era_effect`.

---

### Added — Tribunal System

- Three divine blessing chains for Dunmeri and learned rulers:
  - **Vivec's Blessing** — martial ≥ 12, Dunmer ruler → `vivec_blessed`
  - **Almalexia's Devotion** — diplomacy ≥ 12, Dunmer ruler → `almalexia_devoted`
  - **Sotha Sil's Teaching** — learning ≥ 14, any ruler → `sotha_sil_student`
  - **Tribunal Champion** — all three flags achieved → `tribunal_champion`
- 4 events (tribunal.000–.030), 4 short-term blessing modifiers.
- Almalexia's Hands: pledge decision, `almalexias_hand` trait, 2 events.
- ALMSIVI Interdict: excommunication events for rulers who defy the Tribunal.
- Vivec Trial: 12 events covering the Trial of Vivec.
- Seven Graces Pilgrimages: 7-stop canonical pilgrimage path of Vivec (`seven_graces_pilgrim` trait).

---

### Added — Dwemer Ruins Exploration System

- 4 traits: `dwemer_scholar`, `animunculi_master`, `tonal_architect`, `aetherium_attuned`.
- 8 events (dwemer.000–.007).
- Decisions: `explore_dwemer_ruin`, `study_tonal_architecture`, `deploy_tonal_architecture`, `delve_dangerous_ruin`.

---

### Added — Amulet of Kings

- Decision chain to seek, claim, and protect the Amulet of Kings.
- `attempt_relight_dragonfires` decision.
- 7 events covering discovery, threats to the Amulet, and the Dragonfire covenant.
- `claim_the_amulet_of_kings`, `seek_the_amulet_of_kings` decisions.

---

### Added — Great Houses of Morrowind

- Five Great Houses fully scripted: Hlaalu, Redoran, Telvanni, Indorano, Dres.
- `petition_great_house_hortator` decision; `morrowind_hortator` trait.
- `claim_telvanni_tower` decision; `telvanni_master_wizard` trait.
- `dres_slaver` trait for House Dres slaving operations.
- 13 events covering house politics, hortator petitions, Telvanni tower disputes, and Dres slave raids.

---

### Added — Ashlander Tribes

- Four Ashlander tribes of Morrowind scripted.
- `ashlander_nerevarine` trait for prophesied Nerevarine figures.
- 6 events covering tribal relations and the Nerevarine prophecy path.

---

### Added — Kagrenac's Tools

- Decision: `seek_tools_of_kagrenac`.
- Wrathguard, Keening, and Sunder flavour events.
- 5 events covering the final trial to wield the Tools.
- `divine_scholar` trait for those who master the tonal understanding.

---

### Added — Clockwork City

- Decision: `seek_clockwork_city`.
- `clockwork_initiate` trait for those granted access to Sotha Sil's Brass World.
- 4 events covering discovery, mechanical constructs, and the secret of the Tinkerer-God.

---

### Added — Psijic Order

- Full rank progression: novice → initiate → adept → master.
- Artaeum island returns 2E 580 (lore-accurate).
- Decisions: `seek_psijic_invitation`, `seek_psijic_tutelage`, `begin_psijic_endeavour`, `begin_psijic_master_quest`, `seek_psijic_advancement`, `commune_with_the_order`, `leave_psijic_order_decision`.
- 4 events. `endeavour_seeker` / `endeavour_advanced` trait chain for the Psijic Endeavour.
- `all_maker_blessed` trait for Skaal practitioners (`seek_skaal_accord` decision).

---

### Added — Nordic Lore / Atmoran System

- `companion_of_ysgramor`, `shor_marked` traits.
- `nordic_lore` event namespace — 5 events covering Atmoran heritage, the Companions of Ysgramor, and Shor's mark.
- Decisions: `claim_companion_lineage`.

---

### Added — Magic Systems

- **School of Julianos**: `study_julianos_order` decision, `divine_scholar` trait path.
- **Psijic Endeavour** expansion (see Psijic Order above).
- **Tonal Architecture** expansion for Dwemer-adjacent rulers (see Dwemer system above).
- 6 events (magic_sys namespace).
- `conduct_magical_research` decision.

---

### Added — Underworld System

- **Dark Brotherhood** full guild system (see Guilds).
- **Skooma Trade**: `invest_skooma_trade` decision, criminal enterprise events.
- 6 events (underworld namespace) covering Brotherhood contracts and Skooma networks.

---

### Added — Mythic Dawn

- Mankar Camoran's cult scripted as a secret society.
- `mythic_dawn_inner` trait for cult inner circle members.
- Decisions: `investigate_mythic_dawn`, `perform_black_sacrament` (crossover with Dark Brotherhood).
- 6 events covering recruitment, rituals, and unmasking.
- Event cross-reference: fires into `oblivion_gate.001` (Gate Opens) on cult success.

---

### Added — Alessian Order / Reman Dynasty

- `alessian_reformer` trait; `reman_heir` trait.
- Decisions: `proclaim_alessian_reformation`, `claim_reman_heritage`, `attempt_relight_dragonfires`.
- 7 events covering the Alessian Reformation, the Eight Divines, and the Reman Empire legacy.

---

### Added — Hist / Saxhleel System

- Deep Time visions and the Wild Hunt.
- `hist_elder_bonded`, `hist_bonded`, `an_xileel_warrior` traits.
- Decisions: `travel_to_hist_convocation`, `call_the_wild_hunt`.
- 6 events covering Hist communion, Saxhleel destiny, and An-Xileel military organisation.
- An-Xileel Argonians factored into Kamal invasion triggers (Argonian resistance at 2E 572).

---

### Technical — Scripted Systems

- **134 modifiers** in `lore_races_modifiers.txt`, all fully localized with display names and descriptions.
- **Scripted effects**: `begin_dagoth_ur_awakening_effect`, `end_dagoth_ur_era_effect`, `activate_tower_stone_effect`, `deactivate_tower_stone_effect`, and 10+ additional effects across all systems.
- **Scripted triggers**: `dagoth_ur_awakened`, `dagoth_ur_awakening_possible`, `is_sixth_house`, plus guild and tower state triggers.
- **On-actions** (`lore_races_on_actions.txt`): `on_yearly_pulse` (all spawn/trigger checks), `on_character_death` (clears tower stone county variables and Amulet of Kings flag on keeper/bearer death).
- All `on_yearly_pulse` blocks consolidated into a single block per file to prevent CK3 last-wins shadowing.

---

### Technical — Localization

- **22 localization files** covering all systems, fully in English.
- All YAML files encoded with **UTF-8 BOM** (`EF BB BF`) as required by CK3.
- Localization files: `alessian_l_english.yml`, `amulet_of_kings_l_english.yml`, `ashlander_l_english.yml`, `clockwork_city_l_english.yml`, `daedric_invasion_l_english.yml`, `daedric_princes_l_english.yml`, `dagoth_ur_l_english.yml`, `dragon_priest_l_english.yml`, `dwemer_ruins_l_english.yml`, `great_houses_l_english.yml`, `guilds_l_english.yml`, `hist_saxhleel_l_english.yml`, `kagrenac_l_english.yml`, `lore_races_l_english.yml`, `magic_systems_l_english.yml`, `mythic_dawn_l_english.yml`, `nordic_lore_l_english.yml`, `psijic_l_english.yml`, `seven_graces_l_english.yml`, `thuumvoi_l_english.yml`, `tribunal_l_english.yml`, `underworld_l_english.yml`.

---

### Technical — Compatibility

- Requires **Elder Kings 2** as a dependency.
- `dragonborn` trait is EK2-defined; this submod supplements it without overwriting.
- All CK3 vanilla trait references (`craven`, `paranoid`, `scholar`, etc.) and effect references (`banish = yes`) documented as external dependencies.
- All `*_culture` identifiers are EK2-defined.

---

### Known Lore Notes

| Topic | Canonical fact used |
|---|---|
| Battle of Red Mountain | c. 1E 700 (*Pocket Guide to the Empire, 3rd Ed.*) |
| Jurgen Windcaller | Founded Way of the Voice c. 1E 1069 |
| Dir-Kamal | **Killed** (not driven back) at 2E 572 by Ebonheart Pact + Tribunal |
| Dagoth Ur awakening | 2E 882 canonical; early triggers at 2E 600 / 2E 700 |
| Psijic Order / Artaeum | Returns from Aetherius 2E 580 |
| Keptu | High Rock proto-humans — **not** Redguard ancestors |
| Night Mother | Identified with Mephala (contested; noted per *The Brothers of Darkness*) |
| Hermaeus Mora | Personality trait = `arbitrary` (not paranoid) |
| Molag Bal title | King of Corruption |
| Orichalc Tower (Yokuda) | Omitted — destroyed 1E 792 |
| Jyggalag | Invasion weight 0 before 3E 400 (Sheogorath era) |
| Thras re-emergence | Intentional mod choice for Coral Tower gameplay |

---

*This submod is a fan-made project for Elder Kings 2 / Crusader Kings 3. All Elder Scrolls lore, names, and concepts are the property of Bethesda Softworks.*

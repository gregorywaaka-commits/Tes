# Changelog

All notable changes to this mod are documented here.
Dates use the format YYYY-MM-DD.  Versions follow semver-like tagging; the mod
was initially created and then iteratively audited and fixed.

---

## [Unreleased] — 2026-04-01 (Audit Pass 3)

### Fixed — Critical
- **`lore_races_effects.txt`**: Deleted orphaned duplicate of `establish_echmer_contact`
  body (lines 324–339) that was pasted outside any effect definition after
  `deactivate_tower_stone_effect`.  This caused a negative brace depth (depth −1
  at EOF) and would have prevented CK3 from parsing the entire file.
- **`thuumvoi_effects.txt`**: Deleted entire second copy of all 14 scripted effects
  (lines 337–522 — a complete duplicate of lines 81–336).  CK3 silently uses only
  the *last* definition of any symbol per file; the duplicate block was stripping
  all inline comments from every effect without changing any game logic.

### Fixed — Lore
- **`daedric_invasion_l_english.yml` line 135**: `molag_bal_aspect_desc` used the
  archaic 1st-edition title "King of Rape" → corrected to "King of Corruption"
  (the title consistently used in ESO and later TES material; see header comment
  on lines 57–61 of the same file for the full lore note).
- **`daedric_princes_l_english.yml` line 378**: `daedric_champion.molag.001.desc`
  used "King of Rape" → corrected to "King of Corruption".
- **`kamal_events.txt` lines 31–33**: Header LORE BASIS comment stated Dir-Kamal
  was "driven back" → corrected to "killed at the Battle of Vivec by the Ebonheart
  Pact and the Tribunal".  (Dir-Kamal was slain, not merely repelled — 2E 572.)

### Added — Documentation (External Dependency Comments)
Added structured `EXTERNAL DEPENDENCIES` comment blocks to key files so that
future audits can immediately identify references to EK2 or CK3 vanilla that are
*intentional* and must not be locally redefined:

- **`lore_races_effects.txt`**: Full list of externally-defined traits, cultures, and
  CK3 vanilla effects (`banish = yes`) used in this file.
- **`daedric_invasion_effects.txt`**: Note on `necromancy`, `oathbreaker`, `craven`,
  `shortsighted` traits.
- **`guild_triggers.txt`**: Complete header with external trait list (`murderer`,
  `scholar`, `greedy`, `adventurous`, `callous`, `sadistic`) and EK2 culture
  (`altmer_culture`).
- **`sload_events.txt`**: External dependency block noting `banish = yes` (CK3
  vanilla), `sload_culture` (EK2), inline comment at usage site.
- **`kamal_events.txt`**: External dependency block noting `dunmer_culture`,
  `argonian_culture`, `kamal_culture` as EK2-defined.
- **`daedric_invasion_decisions.txt`**: Header noting `craven`, `shortsighted` (CK3 vanilla).
- **`lore_races_decisions.txt`**: Header noting `curious`, `craven` (CK3 vanilla).
- **`daedric_prince_decisions.txt`**: Header noting `paranoid` (CK3 vanilla),
  `oathbreaker` (EK2), `greedy` (CK3 vanilla).

---

## [0.2.0] — 2026-04-01 (Audit Pass 2)

### Fixed — Critical Functional Bug
- **`kamal_events.txt` — `kamal.050`**: The monthly hidden world event was supposed
  to toggle `global_var:current_season_summer` on/off each month based on
  `current_date.month` to drive `kamal_summer_active`.  The previous implementation
  only *set* the variable (once, when it didn't already exist) and never cleared it,
  making `kamal_summer_active` permanently `true` after the first monthly pulse.
  Fixed with proper `current_date.month >= 5 / <= 9` comparison and an `else` branch
  calling `remove_global_variable`.

### Fixed — Missing Localization
- **`daedric_invasion_l_english.yml`**: Added missing `daedric_invasion.000.a` key
  for the sole option of the `daedric_invasion.000` world event.  CK3 was displaying
  the raw key string.  Text: *"Brace yourselves — the invasion has begun."*

---

## [0.1.0] — 2026-04-01 (Initial Release + Audit Pass 1)

### Added — Initial Mod Content
Full initial creation of the EK2 submod (52 files, ~20 000 lines):
- Daedric invasion system: 17 Princes, 3-phase escalation, Oblivion Gates, CB types.
- Obscure lore races: Echmer, Maormer, Sload (All-Flags Navy), Kothringi (Knahaten
  Flu), Kamal (Dir-Kamal invasion), Tang Mo, Dreugh, Imga, Keptu/Nedes.
- Elder Towers system with 9 tower-stone mechanics.
- Thu'um / Voice path and Greybeard Order progression.
- Amulet of Kings and Dragonfires relighting quest chain.
- Guild system: Mages Guild, Fighters Guild, Thieves Guild, Dark Brotherhood,
  Morag Tong, Companions, Psijic Order, Bards College, Undaunted.
- Daedric Champion trait path for each of the 17 Princes.
- Character templates for Daedric Princes and lore-race leaders.
- Daedric men-at-arms unit types.
- Full localization for all content.

### Fixed — Structural (Audit Pass 1)
- Added missing `tolerated_necromancer` and `rejected_daedric_submission` modifiers
  to `lore_races_modifiers.txt`.
- Wired both modifiers to the rally-against-invasion decision.
- Multiple lore text corrections across localization files (see commit history).

### Lore Notes
- **Molag Bal**: Titled "King of Corruption" throughout (archaic 1E title
  "King of Rape" from Pocket Guide to the Empire replaced with modern canonical
  title from ESO onwards).  Both are canonical; "King of Corruption" is preferred.
- **Dir-Kamal**: Killed (not driven back) at the Battle of Vivec, 2E 572, by
  the Ebonheart Pact and the full Tribunal.
- **Hermaeus Mora**: Uses trait `arbitrary` (not `paranoid` — omniscience
  contradicts paranoia).
- **Jyggalag**: Invasion weight = 0 before 3E 400 (base 2, modifier −2).
  He is trapped as Sheogorath throughout the 2E Interregnum.
- **Azura**: Invasion weight = 2 (non-hostile "invasion" — prophetic visitation).
- **Meridia**: Invasion weight = 1 (Aedric-adjacent; her events are net beneficial).
- **Keptu**: High Rock proto-humans (NOT Redguard/Yokudan ancestors — that is a
  common conflation in fan writing).
- **Psijic Order / Artaeum**: Gated to `current_date >= 2E.580` (historical return).
- **Night Mother / Mephala**: Contested canon per *The Brothers of Darkness* —
  acknowledged in `guild_traits.txt` and `daedric_princes.txt`.
- **Jurgen Windcaller / Way of Voice**: Founded c.1E 1069.

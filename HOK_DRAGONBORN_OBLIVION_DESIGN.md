# §25 — Hero of Kvatch / Dragonborn / Oblivion Multi-Prophecy System Design

---

## Lore Reference Notes (Verified)

- **Hero of Kvatch** (TES IV: Oblivion): No canon personal name. Known as the "Hero of Kvatch" or "Champion of Cyrodiil."
- **Jauffre**: Grandmaster of the Blades, disguised as a monk at Weynon Priory. He is the NPC the Emperor tasks with delivering the Amulet of Kings — NOT "Geoffrey." His correct name is **Jauffre**.
- **Named Blades in the Imperial Prison sequence (3E 433)**: Baurus, Glenroy, and Captain Renault. These are the *canonical* Blades present. Delphine is a Blade from *Skyrim* (4E 201) and must NOT appear in any Oblivion-era events unless the timeline has advanced.
- **Martin Septim**: Illegitimate son of Uriel Septim VII. Priest of Akatosh in Kvatch. The canonical heir who eventually mantles Akatosh.
- **Mankar Camoran**: Leader of the Mythic Dawn cult. Steals the Amulet of Kings and retreats to Camoran's Paradise (Oblivion plane).
- **Amulet of Kings**: Required to light the Dragonfires and maintain the covenant between Alessia's bloodline and Akatosh. Without it, the barrier preventing Daedric invasion weakens.
- **Dragonfires**: The covenant flame in the Imperial City's Temple of the One. Must be lit by one of Dragonblood. If extinguished or never lit, Mehrunes Dagon and other Daedric Princes can invade Mundus.
- **Cloud Ruler Temple**: Blades headquarters near Bruma, Cyrodiil. This is where Martin is taken for protection.
- **Bendu Olo**: Canonical Breton Champion of Cyrodiil referenced in Shivering Isles lore. Went on to mantle Sheogorath after the main events.
- **Blades formation**: The Blades as an institution protecting the Dragonborn Emperor formed long before 3E 433. They trace back to the Akaviri Dragonguard of the late 1st Era. They should NOT be spawned at game start if the timeline is pre-2E; their founding accelerant requires Talos ascending (2E 852+) since Tiber Septim reorganized the Dragonguard into the Blades.
- **Mythic Dawn**: Founded by Mankar Camoran. Active in secret long before 3E 433 but major mobilization is triggered by the right conditions. Not present at game start in 2E.

---

## §25.1 — Timeline Gate Overview

All events in this system are blocked at game start (EK2 baseline 2E 440–582).
They unlock progressively based on lore-accurate requirements:

| System | Canonical Date | Early Trigger Conditions |
|---|---|---|
| Blades Formation (Tiber's reorganization) | 2E 852 | `talos_ascended = yes` OR `tiber_septim_alive = yes` AND martial ≥ 20 |
| Mythic Dawn Mobilization | 3E ~400 | `blades_formed = yes` AND `dragonfires_threatened = yes` |
| Hero of Kvatch (HoK) Prophecy | 3E 433 | `mythic_dawn_active = yes` AND Emperor assassinated or at risk |
| Dragonborn Prophecy (Alduin) | 4E 201 | `civil_war_skyrim_active = yes` AND `dragon_crisis_begun = yes` |
| Shivering Isles Champion | Post-3E 433 | `oblivion_crisis_resolved = yes` OR `akatosh_mantled = yes` |

---

## §25.2 — The Blades: Dynamic Temporal Spawning

### Problem
If the HoK questline fires before 3E 433, spawning Baurus, Glenroy, and Delphine by name is lore-inaccurate.

### Solution
**Time-gated named NPC spawning:**

- **Before 3E 433**: Spawn 3 generic anonymous Blades (random Imperial/Breton/Nord characters with `blade_agent` trait). No named characters.
- **At/after 3E 433 (canonical era)**: Spawn Baurus, Glenroy, and Captain Renault as named NPCs with correct traits. Delphine is NOT in this sequence — she is a Blade survivor of the Great Purge (4E era).

### Empire Strength Modifier on Imperial Prison Escort

| Empire State | Effect |
|---|---|
| `empire_strong = yes` (high crown authority, low unrest) | Full Blades escort aids the Emperor; all 3 Blades present and combat-capable |
| `empire_weak = yes` (civil war, low authority) | Reduced or no Blades escort; Emperor gets no help |
| Player IS the Emperor | Event becomes personal — escort is specifically the Emperor's personal guard |

**Global flag**: `hok_prison_blades_spawned` prevents duplicate spawning.

---

## §25.3 — HoK Candidate System (Imperial Prison)

### Core Mechanic
Multiple HoK candidates are spawned when the conditions are met. They all accompany the Emperor through the Imperial Prison escape sequence.

**Default outcome**: All candidates die except one — the **Imperial HoK** (human, Imperial culture preferred). This mirrors the canonical Champion of Cyrodiil.

### Candidate Spawning
- Spawn `active_hok_candidate_count` (global var) candidates — minimum 4, maximum 8.
- Each candidate gets trait `hok_candidate`.
- The canonical survivor gets `hok_canonical_vessel` flag.
- If the player is NOT the Emperor, one candidate may be the player character (joining the escape).

### Player Interference Options
Players can:
1. **Save additional candidates** — intervene to keep more alive, gaining allies with `hok_companion` trait.
2. **Kill candidates** — including the canonical survivor, making themselves or another the sole living HoK.
3. **Be the Emperor** — in which case the player IS the central figure; normal HoK candidates protect them rather than the reverse.
4. **Insert themselves as a candidate** — if not Emperor, can join the escape as an additional prophecy holder.

### Succession on Candidate Death
- Track via `on_character_death` hook.
- When all non-player candidates die, if player is the only survivor: `player_is_sole_hok = yes`.
- Demote all other candidates to `hok_pretender` trait when the victor completes the questline.

---

## §25.4 — Hero of Kvatch Questline: Player Emperor Branch

### Condition
`player_is_emperor = yes` AND assassination attempt fires.

### Assassination Attempt Survival Decision
Before the Mythic Dawn assassination fires, a player Emperor has access to the decision:
**"Secure the Succession"** — Send heirs into hiding with Weynon Priory (Jauffre's protection).
- Requires: `blades_formed = yes` AND `jauffre_alive = yes`
- Effect: Sets `heirs_in_hiding = yes`; heirs gain `weynon_hidden` flag.

### If Player Emperor Survives the Assassination
- All canonical heirs die UNLESS `heirs_in_hiding = yes`.
- The Amulet of Kings is stolen by Mythic Dawn agents **in the sewers** during the escape (modified from canon where the Emperor gives it to the Hero — here the Emperor keeps it, but it is pickpocketed/stolen by a Mythic Dawn sleeper agent).
- Sets: `amulet_of_kings_stolen = yes`, `mankar_has_amulet = yes`.
- A randomized NPC heir of the ruling dynasty is spawned as "Martin" (name is dynasty-appropriate, not always "Martin Septim" unless the Septim dynasty rules).

### Accelerated Questline for Surviving Emperor
Skip milestones:
- ~~Travel to Weynon Priory for Jauffre~~ (already knows Jauffre personally)
- ~~Travel to Kvatch to find Martin~~ (can go directly, or use heir-in-hiding shortcut)
- Go directly to **Cloud Ruler Temple** for Blades protection.

### Amulet Recovery
Since the Amulet was stolen, Mankar Camoran's Paradise questline is required to retrieve it:
- Emperor must go to Paradise to recover the Amulet personally.
- Sets `amulet_recovered = yes` on success.

---

## §25.5 — Heir in Hiding: Alternative Martin Path

If `heirs_in_hiding = yes` before the assassination:
- Player Emperor can travel to Kvatch and personally rescue the hidden heir.
- Heir gains `dragonblood_vessel` trait.
- This heir can substitute for the canonical Martin in the final confrontation.
- The heir can choose to mantle Akatosh in place of the Emperor.

If the heir mantles Akatosh:
- Player Emperor survives.
- `dragonfires_ended = yes` (pact changed).
- Amulet is semi-permanently lost.
- Player Emperor gains `akatosh_covenant_holder` modifier (reduced, as they no longer need to bear it).

---

## §25.6 — Final Oblivion Crisis: Two Endings for Player Emperor

### Ending A: Mantle Akatosh (Like Canonical Martin)
- Player Emperor chooses to use the Amulet at the Temple of the One.
- Effect: Player character "dies" (transforms), gains `akatosh_mantled` trait (a death-like removal from play with legacy effects).
- Dragonfires no longer needed — pact altered.
- Daedric invasions permanently blocked for this cycle.
- Amulet of Kings is lost (semi-permanently; can potentially be recovered through a later quest chain).
- **Triggers Shivering Isles launch** (see §25.8).

### Ending B: Light the Dragonfires (Keep Living)
- Player Emperor uses the Amulet to light the Dragonfires traditionally.
- Player survives. Amulet retained.
- Dragonfires must be maintained — any future Daedric Prince can re-trigger the crisis.
- `dragonfires_lit = yes` global flag; resets periodically or when conditions arise.
- Sets recurring decision: **"Maintain the Covenant"** — available to keep the Dragonfires burning.

---

## §25.7 — Talos Special Case: What If Talos Is Emperor?

If the player has mantled Talos (via Walking Ways Path B) AND currently holds the throne when the HoK assassination events fire:

- **Talos's combat ability**: Talos can physically overpower the assassins. Add special outcome: "Talos kicks the assassin across the room" — assassination attempt fails automatically.
- This may repeat multiple times (Talos is nearly unkillable pre-apotheosis).
- **Delay mechanic**: Player can keep Talos alive indefinitely by successfully defending against each attempt.
- Talos's canonical end is apotheosis to godhood. If player keeps him alive long enough without completing godhood, a forced event fires eventually: "The Time of Talos Ends" — he ascends regardless, following Martin's canonical apotheosis pattern.
- Players CAN delay this ascent but cannot prevent it permanently unless they find a lore-accurate workaround (e.g., CHIM or a specific Walking Ways interaction).

---

## §25.8 — Shivering Isles: Champion of Sheogorath Succession

Triggers when:
- `akatosh_mantled = yes` (player Emperor OR heir has mantled Akatosh), OR
- The HoK questline completes and Sheogorath needs a new champion.

### Champion Search
System searches for a living HoK candidate with `hok_canonical_vessel`:
1. If one exists → they become Sheogorath's champion.
2. If none exist (all HoK candidates dead AND player interfered by killing the canonical survivor) → spawn a new AI character: **Breton**, named Bendu Olo (or Bendu Olo dynasty member), with `shivering_isles_champion` trait.
3. Bendu Olo then progresses through the Shivering Isles questline automatically (AI-driven).
4. At completion, Bendu Olo mantles Sheogorath unless the player interferes.

### Player Interference with Shivering Isles
- Player can insert themselves as the champion before Bendu Olo is chosen.
- Player can kill Bendu Olo mid-questline, forcing themselves to continue.
- If player Emperor chose Ending B (kept Dragonfires, didn't mantle Akatosh) AND is still the last HoK prophecy holder → Bendu Olo is NOT spawned automatically. The player Emperor IS still the holder of the Shivering Isles prophecy potential.
- If player Emperor's heir mantled Akatosh instead (saving the Emperor), and the Emperor sacrificed their heir → the Emperor can choose to mantle Sheogorath themselves as heir to the champion lineage.

---

## §25.9 — Dragonborn Prophecy (Skyrim/Alduin System)

### Entry Point: The Ambush Event
Instead of a static game-start, the Dragonborn prophecy activates dynamically:
- **Ambush event**: Player character (or a candidate NPC) goes for a walk / travel and is ambushed.
- The ambushing faction is determined by who controls Windhelm:
  - Stormcloaks control Windhelm → Stormcloak soldiers capture the player.
  - Another faction controls Windhelm → That faction's soldiers capture the player.
  - Civil war active in Skyrim between multiple factions → Any warring faction can trigger the ambush.
- The captured character is put on the execution cart to Helgen.

### Player Emperor Variation
If the player IS the Emperor and is captured:
- Soldiers don't believe the claim. Player is thrown on the cart regardless.
- **High Skyrim Control** modifier (`skyrim_imperial_control ≥ high`): The Helgen captain recognizes the Emperor and the execution is halted — player escapes at the Helgen gate without going to the block.
- **Low Skyrim Control**: Player goes to the block with the others.

### Dragonborn Candidate System (Mirrors HoK)
Multiple Dragonborn candidates spawned at Helgen:
- Default: All die except one — the canonical **Nord Dragonborn** (Ysmir Dragonborn type).
- `active_dragonborn_candidate_count` global var.
- Each candidate has `dragonborn_candidate` trait.
- Canonical survivor gets `dragonborn_canonical_vessel` flag.

Player options at Helgen:
1. **Join as a candidate** — insert as another prophecy holder.
2. **Save other candidates** — keep more alive.
3. **Kill candidates** including the canonical survivor — become sole Dragonborn.
4. If sole Dragonborn, player must complete the Alduin questline themselves.

---

## §25.10 — Multi-Prophecy Cascade Logic

### If All HoK Candidates Die Before Dagon's Defeat
- If player INTERFERED (e.g., killed the Imperial HoK themselves):
  - A new AI Breton HoK is spawned (Bendu Olo lineage) to fulfill Shivering Isles potential.
  - EXCEPTION: If player Emperor survived with Ending B (kept Dragonfires, no Akatosh mantle) → Player Emperor is still the last prophecy holder → Bendu Olo NOT spawned. Player Emperor carries the Shivering Isles prophecy weight.
  - EXCEPTION: If player Emperor sacrificed their hidden heir to mantle Akatosh → Player Emperor still eligible to mantle Sheogorath in heir's stead.

### Cross-Prophecy Eligibility
- A character can hold multiple prophecy eligibilities simultaneously (HoK + Dragonborn + Shivering Isles champion).
- Each active prophecy adds the relevant candidate trait.
- Completing one prophecy does NOT automatically complete others.
- Completing all three grants a unique convergence modifier.

---

## §25.11 — Dynasty Flexibility: Not Just Septims

The throne holder who dies in the assassination can be ANY dynasty:
- If an NPC (non-player) holds the throne when assassination fires → NPC Emperor dies.
- A random NPC of the same dynasty is spawned as "Martin" equivalent (the illegitimate or hidden heir). Name reflects dynasty. They follow the canonical questline.
- If the Septim dynasty specifically holds the throne at 3E 433 → canonical Martin Septim spawned by name.
- If another dynasty holds the throne → "Martin" is a dynasty-appropriate NPC with `dragonblood` trait (reflecting the Covenant still binds whomever Akatosh has chosen).

---

## §25.12 — Mythic Dawn Formation Requirements

The Mythic Dawn does NOT exist at game start. Formation requires:
- **Accelerant conditions** (any one): `blades_formed = yes` OR `talos_ascending = yes` OR `dragonfires_threatened = yes`
- **Block conditions** (all must be false): `oblivion_crisis_resolved = yes`, `akatosh_mantled = yes`
- Once formed, Mythic Dawn gains `mythic_dawn_active = yes` global flag.
- Mankar Camoran NPC spawned (if 3E era reached or conditions met early).
- They begin plotting the assassination of the Emperor.

---

## §25.13 — Global Flags Reference

| Flag | Description |
|---|---|
| `hok_prison_blades_spawned` | Prevents duplicate Blades spawning in prison |
| `hok_canonical_spawned` | Prevents duplicate HoK candidate spawning |
| `hok_canonical_vessel` | Character flag: the default-surviving HoK |
| `heirs_in_hiding` | Player emperor hid heirs at Weynon Priory |
| `amulet_of_kings_stolen` | Amulet stolen in sewers during emperor escape |
| `mankar_has_amulet` | Mankar Camoran possesses the Amulet |
| `amulet_recovered` | Amulet retrieved from Paradise |
| `dragonfires_lit` | Dragonfires currently burning |
| `dragonfires_ended` | Pact changed — fires no longer needed |
| `akatosh_mantled` | A character has mantled Akatosh |
| `player_is_sole_hok` | Player is the only surviving HoK candidate |
| `blades_formed` | The Blades organization formally exists |
| `mythic_dawn_active` | Mythic Dawn is actively plotting |
| `civil_war_skyrim_active` | Skyrim civil war in progress |
| `dragon_crisis_begun` | Alduin/dragon crisis underway |
| `dragonborn_canonical_vessel` | Character flag: the default Nord Dragonborn |
| `shivering_isles_champion` | Character is champion of Sheogorath |
| `shivering_isles_champion_needed` | System searching for new champion |
| `bendu_olo_spawned` | Canonical Breton champion has been created |
| `oblivion_crisis_resolved` | Oblivion crisis complete (any ending) |

---

## §25.14 — Traits Reference

| Trait | Description |
|---|---|
| `hok_candidate` | Character is a Hero of Kvatch candidate |
| `hok_pretender` | Former candidate; another has claimed the mantle |
| `hok_champion` | Completed the Hero of Kvatch questline |
| `dragonborn_candidate` | Character is a Dragonborn candidate |
| `dragonborn_pretender` | Former candidate |
| `dragonborn_ascendant` | Completed the Dragonborn questline |
| `blade_agent` | Generic pre-canonical Blade (before named era) |
| `dragonblood` | Carries Akatosh's covenant blood |
| `akatosh_covenant_holder` | Bears the responsibility of the Dragonfires |
| `shivering_isles_champion` | Named champion of Sheogorath |
| `weynon_hidden` | Heir is hidden under Jauffre's protection |

---

## §25.15 — Implementation Notes for Next Session

1. Create namespace `hok_events` (.000–.050) for Hero of Kvatch events.
2. Create namespace `dragonborn_events` (.000–.040) for Dragonborn/Helgen events.
3. Create namespace `oblivion_crisis_events` (.000–.030) for Dragonfires/Paradise/Akatosh events.
4. Create namespace `shivering_isles_events` (.000–.020) for champion selection.
5. Add all global flags to a new `on_actions` registration file.
6. Add all new traits to a new `hok_traits.txt` file.
7. Add all new modifiers to `lore_races_modifiers.txt` (per existing convention).
8. All new localization `.yml` files must start with UTF-8 BOM.
9. Register all `on_yearly_pulse` and `on_character_death` hooks in `lore_races_on_actions.txt`.

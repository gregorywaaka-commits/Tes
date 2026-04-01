# EK2 — Daedric Invasion Submod

A submod for **Elder Kings 2** (EK2) — itself a total-conversion mod for **Crusader Kings 3** (CK3) set in the Elder Scrolls universe.  
This submod introduces the **Daedric Princes** as a late-game invading force, complete with Oblivion Gates, escalating phases, unique decisions, and dramatic banishment events.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Daedric Princes Included](#daedric-princes-included)
4. [Mechanics Breakdown](#mechanics-breakdown)
5. [File Structure](#file-structure)
6. [Installation](#installation)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Modding Notes & EK2 Integration Points](#modding-notes--ek2-integration-points)

---

## Overview

Once certain in-game conditions are met (or via a random yearly pulse), a Daedric Prince is chosen to lead an invasion of Mundus.  
The invasion unfolds in **up to three escalating phases**, each opening more Oblivion Gates and adding more Daedric armies to the map.  
Mortal rulers can resist, rally together, individually close Gates, or even bend the knee to survive.

---

## Features

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

## Daedric Princes Included

| Prince | Domain | Invasion Style |
|---|---|---|
| **Mehrunes Dagon** | Destruction, Change | Direct military assault; heavy armies; most common |
| **Molag Bal** | Domination, Corruption | Dread-focused; corrupts rulers; vampiric armies |
| **Boethiah** | Plots, Assassination | Intrigue-heavy; seeds court traitors; weaker armies but deadly off-map |
| **Hircine** | The Hunt | Werewolf packs; prowess-heavy champions; targets isolated rulers |
| **Namira** | Decay, Darkness | Plague-like spread; unchecked Gates cause disease modifiers |

---

## Mechanics Breakdown

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

## File Structure

```
mod/
├── descriptor.mod                               # Mod metadata
├── common/
│   ├── on_actions/
│   │   └── daedric_invasion_on_actions.txt      # Monthly/yearly hooks
│   ├── decisions/
│   │   └── daedric_invasion_decisions.txt       # Player decisions
│   ├── scripted_triggers/
│   │   └── daedric_invasion_triggers.txt        # Reusable trigger checks
│   ├── scripted_effects/
│   │   └── daedric_invasion_effects.txt         # begin/open/close/end effects
│   ├── character_templates/
│   │   └── daedric_princes.txt                  # NPC Prince templates
│   ├── traits/
│   │   └── daedric_invasion_traits.txt          # All custom traits
│   └── casus_belli_types/
│       └── daedric_invasion_cb.txt              # Invasion CB definition
├── events/
│   ├── daedric_invasion_events.txt              # Main invasion event chain
│   └── oblivion_gate_events.txt                 # Gate open/close events
└── localization/
    └── english/
        └── daedric_invasion_l_english.yml       # Full English localisation
```

---

## Installation

1. Place the `mod/` folder inside your CK3 mod directory:  
   `Documents/Paradox Interactive/Crusader Kings III/mod/daedric_invasion/`
2. Copy `descriptor.mod` to the same `mod/` root folder.
3. Enable **Elder Kings 2** first, then enable **EK2 — Daedric Invasion** in the CK3 launcher.
4. Load order: EK2 → this submod.

---

## Implementation Roadmap

### Already scripted (this PR)
- [x] Mod descriptor
- [x] Daedric Prince character templates (5 Princes)
- [x] Custom traits (prince markers, aspect traits, mortal rewards)
- [x] Scripted triggers
- [x] Scripted effects (begin / open gate / close gate / escalate / end)
- [x] Daedric Invasion CB
- [x] On-actions (monthly tick, yearly trigger, occupation hook, death cleanup)
- [x] Player decisions (rally, submit, banish)
- [x] Main invasion event chain (`.000` – `.060`)
- [x] Oblivion Gate event chain (`.001` – `.010`)
- [x] Full English localisation

### Still needed before release
- [ ] **Province modifiers** — define `oblivion_gate_province_modifier`, `oblivion_gate_unchecked`, `oblivion_gate_daedra_surge`, `rallied_against_daedra` in `common/modifiers/`
- [ ] **Men-at-arms types** — define `daedra_footsoldiers`, `daedra_cavalry`, `clannfear`, `golden_saint`, `dremora` in `common/men_at_arms_types/` (EK2 may already have some)
- [ ] **Opinion modifiers** — `rallied_together_opinion`, `ignored_call_opinion`, `submitted_to_daedra_opinion` in `common/opinion_modifiers/`
- [ ] **Faith & culture** — confirm EK2 identifiers for `mehrunes_dagon_faith`, `daedra_culture`, etc. and update templates accordingly
- [ ] **Title scope** — verify `title:d_deadlands` exists in EK2; create or remap if not
- [ ] **GFX** — decision icons, event illustrations (CK3 `.dds` format)
- [ ] **Balance pass** — playtest phase timing, stat thresholds, army sizes
- [ ] **Additional Princes** — Sheogorath, Malacath, Meridia, Vaermina (lower priority)

---

## Modding Notes & EK2 Integration Points

- All global state is stored in `global_var` variables prefixed `daedric_invasion_` or `active_daedric_prince` — safe to check from other mods.
- The `daedric_prince` trait flag can be used by other event chains to gate content.
- The `oblivion_gate_active` county variable is the canonical source of truth for Gate presence.
- EK2 religious identifiers (e.g. `mehrunes_dagon_faith`) must match whatever EK2 uses; adjust `character_templates/daedric_princes.txt` if the names differ.
- The minimum date guard in `daedric_invasion_triggers.txt` uses `2E.100` (Second Era, year 100). Adjust to fit your intended campaign start dates.

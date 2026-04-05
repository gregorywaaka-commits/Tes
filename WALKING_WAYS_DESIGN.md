# Design Notes — The Walking Ways Progression System
### A Mandela-Analog Divine Ascension Track for CK3 / TES Mod

> **Status:** Design notes only. Nothing here is implemented.
> **Author:** Concept session 2026-04-05.
> **Purpose:** Expand the existing four-event CHIM chain into a long-form,
> multi-year character progression track — structurally equivalent to CK3's
> Mandela system — grounded in Elder Scrolls lore.

---

## Table of Contents

1. [What the Mandela System Does — and Why It Maps to TES](#1-what-the-mandela-system-does--and-why-it-maps-to-tes)
2. [Lore Foundation: The Eight Walking Ways](#2-lore-foundation-the-eight-walking-ways)
3. [System Architecture Overview](#3-system-architecture-overview)
4. [Stage 1 — Awareness (Entry Points)](#4-stage-1--awareness-entry-points)
5. [Stage 2 — Path Selection](#5-stage-2--path-selection)
6. [Stage 3 — The Progress Engine](#6-stage-3--the-progress-engine)
7. [The Five Paths — Detailed Design](#7-the-five-paths--detailed-design)
   - [Path A: CHIM Expanded](#path-a-chim-expanded)
   - [Path B: Mantling](#path-b-mantling--the-core-mandela-analog)
   - [Path C: The Psijic Endeavour](#path-c-the-psijic-endeavour)
   - [Path D: The Enantiomorph](#path-d-the-enantiomorph-dark-path)
   - [Path E: The Amaranth](#path-e-the-amaranth-hidden--endgame)
8. [Stage 4 — Apotheosis Events](#8-stage-4--apotheosis-events)
9. [World Notification System](#9-world-notification-system)
10. [Integration with Existing Mod Systems](#10-integration-with-existing-mod-systems)
11. [New Files Required](#11-new-files-required)
12. [New Traits Required](#12-new-traits-required)
13. [New Modifiers Required](#13-new-modifiers-required)
14. [Lore Accuracy / Canon Status Notes](#14-lore-accuracy--canon-status-notes)
15. [Implementation Pitfalls and CK3 Mechanics Notes](#15-implementation-pitfalls-and-ck3-mechanics-notes)

---

## 1. What the Mandela System Does — and Why It Maps to TES

The **CK3 Mandela system** (from *Fate of Iberia* / *Friends & Foes*) is a long-form
character-level progression track with these structural properties:

| Mandela Property | TES / Walking Ways Equivalent |
|---|---|
| A visible **progress meter** (0–100) | `walking_ways_progress` character variable |
| A **declared goal** chosen at commitment | The chosen Walking Way (path) |
| Progress advances by **completing qualifying actions** spread over years | Milestone actions specific to each path |
| **Setback events** roll back progress if player fails checks | Failed skill checks at each milestone stage |
| **Threshold events** fire at 25/50/75/100 | Lore-flavor events at each quarter, cosmological notification at 100 |
| A **climactic finale** event at 100 that grants a unique outcome | Apotheosis event — apex trait granted |
| The system is **rare** — most rulers never attempt it | High entry barriers; low AI weighting |
| **World-state consequences** at completion | Notification to all rulers; secondary effects on the realm |

Elder Scrolls has a direct lore concept for all of this: the **Walking Ways** — the
metaphysical paths toward *becoming* rather than merely *being*. The canonical examples
are CHIM (Vivec, Tiber Septim), Mantling (Tiber Septim mantling Lorkhan/Shor),
and the Psijic "Old Ways." The structure of the Mandela system maps almost perfectly
onto how these work in TES lore: long pursuit → dangerous threshold → transformation
or destruction.

**The existing CHIM system in this mod** is too short — one decision, four events,
one outcome. It has no meter, no path commitment, no multi-year investment, no
world-state consequence. This design expands it into a full multi-year track and
adds four additional paths around it.

---

## 2. Lore Foundation: The Eight Walking Ways

> **Sources:** Michael Kirkbride supplementary texts; in-game books *The Monomyth*,
> *The Loveletter from the Fifth Era*, *The Arcturian Heresy*, *36 Lessons of Vivec*.
> **Canon status:** `[SOFT CANON — MK texts + in-game inference]`. See §14.

The Walking Ways are eight metaphysical paths described in obscure Psijic and
Dunmeri philosophical texts. They are:

1. **CHIM** — Understanding that one exists within the Godhead's dream, and remaining.
2. **Mantling** — Becoming a god by walking in their footsteps until the distinction erases.
3. **The Psijic Endeavour** — The Psijic Order's "Old Ways"; achieving divine perception through total discipline.
4. **The Enantiomorph** — Completing the divine pattern of Hero/Rebel/Witness by becoming the void-reflection.
5. **Amaranth** — The ultimate: dreaming your own dream. Creating a new Aurbis. [MOST SPECULATIVE]
6–8. Three additional Walking Ways that are unnamed or lost in the existing in-universe texts.
   (These are not candidates for mod implementation.)

This design implements Ways 1–5 as playable paths. Ways 6–8 are intentionally omitted
as they have no lore content to model.

---

## 3. System Architecture Overview

```
                    ┌─────────────────────────┐
                    │  AWARENESS EVENT fires  │
                    │  (walking_ways.000)     │
                    │  Entry: 3 possible gates│
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  PATH SELECTION         │
                    │  Decision:              │
                    │  choose_walking_way     │
                    │  Sets chosen_path flag  │
                    │  Sets progress = 0      │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │   PROGRESS ENGINE (hidden yearly)   │
              │   walking_ways.progress_check       │
              │   • Checks milestone flags          │
              │   • Advances progress 0→100         │
              │   • Fires threshold events at 25/50/75 │
              │   • Decay if no action taken        │
              └──────────────────┬──────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  APOTHEOSIS EVENT       │
                    │  (progress = 100)       │
                    │  Path-specific finale   │
                    │  Grants apex trait      │
                    │  World notification     │
                    └─────────────────────────┘
```

The progress variable (`walking_ways_progress`) uses the same `set_variable` /
`change_variable` / `has_variable` pattern already established by `dragon_masks_count`
in `dragon_priest_events.txt` — no new CK3 mechanics are required.

---

## 4. Stage 1 — Awareness (Entry Points)

A single shared awareness event (`walking_ways.000`) introduces the concept of the
Walking Ways. Three independent gates can trigger it. The event sets the
`walking_ways_awareness` character flag and queues the path selection decision.

### Gate A — The Scholar's Gate
- **Trigger:** `learning >= 18` AND `has_trait = scholar`
- **Flavor:** A Psijic monk (or a text they left) reaches the ruler's library.
  The words arrive before the languages do.
- **Cross-reference:** Extends the existing `chim.000` concept to a wider entry
  point that doesn't require the ruler to already be seeking CHIM.

### Gate B — The Warrior's Gate
- **Trigger:** `martial >= 18` AND (`has_trait = shezarrine_vessel` OR `has_trait = brave`)
  AND **did not take** `chim.000.b` (the "I will not hear this" option)
- **Flavor:** The White Warrior's voice, during a dream, suggests that rage is
  the surface of something much larger. The mantle Pelinal carried was only one
  of many mantles.
- **Cross-reference:** Extends the `shezarrine` system naturally; a Shezarrine who
  has already accepted Pelinal's burden is a natural candidate for something deeper.

### Gate C — The CHIM Graduate's Gate
- **Trigger:** `has_trait = chim_achieved`
- **Flavor:** CHIM is not the end. The Psijic scholar returns — or appears to
  return — and says: *you understand the dream. Now consider: what happens if
  you dream your own?*
- **Cross-reference:** This gate is the only entry point to **Path E (Amaranth)**.
  It also gives the CHIM-achieved ruler a reason to continue engaging with the
  system after reaching what currently feels like a final endpoint.

### What the Awareness Event Offers
The `walking_ways.000` event presents:
- **Option A:** "Tell me more. I will consider the paths." → Sets flag, queues decision.
- **Option B:** "I have walked far enough." → Sets `walking_ways_refused` flag for
  10 years; prevents re-triggering.
- No mechanical commitment yet. The player chooses only that they are *willing to
  consider* the Walking Ways, not which one they will pursue.

---

## 5. Stage 2 — Path Selection

Decision: `choose_walking_way`

- **Shown when:** `has_character_flag = walking_ways_awareness`
  AND `NOT = { has_character_flag = walking_ways_path_active }`
- **Cost:** None. This is a commitment of intent, not resources.
- **Effect:** Sets `walking_ways_chosen_path` flag to the chosen path key.
  Sets `walking_ways_progress = 0`. Sets `walking_ways_path_active` flag.
  Fires path-specific intro event (days = 30).

The decision UI presents the five available paths as named options, each with
a brief lore summary. Prerequisites are checked per option — options not yet
available are greyed out with a visible requirement tooltip.

| Path | Key | Minimum Requirements |
|---|---|---|
| CHIM (Expanded) | `path_chim` | `has_trait = chim_achieved` |
| Mantling | `path_mantling` | `learning >= 16` OR `martial >= 16` |
| Psijic Endeavour | `path_psijic` | `learning >= 16` + relevant flag |
| Enantiomorph | `path_enantiomorph` | `intrigue >= 16` + betrayal-adjacent trait |
| Amaranth | `path_amaranth` | `has_trait = chim_achieved` + any other path completed |

---

## 6. Stage 3 — The Progress Engine

### The Hidden Yearly Event

`walking_ways.progress_check` is a **hidden** yearly event registered in
`lore_races_on_actions.txt` under `on_yearly_pulse`. It:

1. Checks `has_character_flag = walking_ways_path_active`
2. Checks `walking_ways_chosen_path`
3. For the active path, iterates through a list of **milestone flags** for that path
4. If one or more milestone flags were set since the last check:
   - `change_variable = { name = walking_ways_progress add = [milestone_value] }`
   - Clears the processed milestone flag to prevent double-counting
   - If progress crossed 25/50/75: triggers the appropriate threshold event
5. If **no milestone flags** were set in a year, and progress is below 75:
   - `change_variable = { name = walking_ways_progress add = -3 }` (soft decay)
   - This prevents abandonment without commitment; the path requires active pursuit

### Progress Thresholds

| Progress | Effect |
|---|---|
| 0 → 1 | Path-intro flavor event fires |
| 25 | First cosmological sign event fires; other rulers get a vague notification |
| 50 | Midpoint event — the path deepens; stress increases; unique opportunity offered |
| 75 | Final approach event — the pressure of imminent transformation is visible |
| 100 | **Apotheosis event fires immediately** |

### Milestone Flag Mechanism

Each path defines 6–8 **milestone actions**. These are specific gameplay behaviors
that, when performed, set a character flag of the form `ww_[path]_milestone_[n]`.

Milestone flags are **set by other event systems as side effects** when relevant
events fire — not by the Walking Ways system directly. This means the Walking Ways
system **interlocks with every other system** already built rather than requiring
new mechanics:

```
# Example: in thu'um_events.txt, when a shout is successfully mastered:
#   if { limit = { has_character_flag = ww_mantling_talos_active } }
#       set_character_flag = ww_mantling_talos_milestone_shout
```

This approach means the Walking Ways system acts as an *achievement layer* on top
of the existing event systems rather than a parallel track that competes with them.

### Milestone Values per Path

Each milestone advances progress by a different amount depending on difficulty:
- Minor milestone: +8 progress
- Standard milestone: +15 progress
- Major milestone: +20 progress

6 standard milestones = 90. The final 10 points are automatic once all 6 are
completed, to avoid artificial padding near the end.

---

## 7. The Five Paths — Detailed Design

---

### Path A: CHIM Expanded

> *"The paradox held. But there is more. CHIM is a door, not a destination."*

**Entry requirement:** `has_trait = chim_achieved`

**Lore basis:** The 36 Lessons of Vivec describe CHIM not as an endpoint but as
a perspective — a ruler who has achieved CHIM can *edit reality*, not simply
understand it. This path models the transition from *understanding* the dream to
*actively operating within it as a sovereign*.

**Tone:** Philosophical. Quiet. The events here are subtle — small realities bending
around the ruler in ways that others notice but cannot explain. `[SOFT CANON — MK texts]`

#### Milestones (6)

| # | Name | Flag | Trigger Source | Value |
|---|---|---|---|---|
| 1 | *The First Edit* | `ww_chim_milestone_first_edit` | Rule for 5+ years post-chim_achieved; fires from yearly check | +15 |
| 2 | *The Unwanted Truth* | `ww_chim_milestone_truth` | Witness a court event that the ruler perceives as "scripted"; flavor option chosen | +15 |
| 3 | *The Ruler's Mercy* | `ww_chim_milestone_mercy` | Choose mercy in a capital punishment decision when revenge would be politically optimal | +15 |
| 4 | *The Dream Stable* | `ww_chim_milestone_stable` | Survive a succession crisis or war without losing core demesne | +15 |
| 5 | *The Silence* | `ww_chim_milestone_silence` | Enter deep study for 1 year (decision: costs time/opportunity) | +15 |
| 6 | *The Name Remembered* | `ww_chim_milestone_name` | Have a legendary reputation (`prestige_level >= 4`) | +15 |

#### Midpoint Event (progress = 50)

*"The court has begun to notice."*
Courtiers report that the ruler's presence feels different — time around them
moves oddly; spoken promises seem binding in a way that cannot be explained.
The ruler must choose whether to lean into this perception (gain fear, lose
diplomacy, gain stress relief) or suppress it (diplomacy maintained, small progress penalty).

#### Failure Risk

No failure risk on this path. CHIM is already achieved — the expanded path is about
*extension*, not a new gamble. The stress cost is real but not catastrophic.

#### Apex Trait: `chim_sovereign`

**Modifiers:**
- All stats +3
- `monthly_prestige = 10`
- `stress_gain_mult = -0.50` (the dream does not pressure you; you are outside it)
- `health = 3.0` (beyond ordinary mortality's schedule)
- `dread_gain_mult = 0.30` (reality bends in your presence; this is frightening)

**Unique yearly event:** Once per year, the `chim_sovereign` ruler may choose to
*perceive* an ongoing event differently — represented as a flavor event where they
narrate what they "actually see" versus what everyone else sees. No mechanical
effect beyond stress relief and piety. Pure flavor.

---

### Path B: Mantling — The Core Mandela Analog

> *"Walk in their footsteps until you and they are indistinguishable."*
> — *The Arcturian Heresy* (paraphrased)

**Entry requirement:** `learning >= 16` OR `martial >= 16`
(Some divine mantles require specific skills — see table below)

**Lore basis:** Mantling is explicitly described in *The Arcturian Heresy* — Tiber
Septim mantled Lorkhan/Shor by completing the same archetypal actions. You *become*
the divine by becoming *consistent with* the divine. The divine's pattern overlaps
with yours until the distinction is meaningless. `[CANON — in-game book: The Arcturian Heresy]`

**Tone:** Epic. Transformative. The longest and most demanding path. Each divine has
a unique set of required actions that are genuinely tied to their domain.

**Sub-choice:** Upon selecting this path, the ruler also chooses *which divine to mantle*.
This is a second nested choice in the decision UI.

#### Available Divine Mantles

##### Mantling Talos
> *The once-mortal god. The man who became divine by becoming the embodiment of human will.*

- **Prerequisites:** `has_trait = shezarrine_vessel` OR `martial >= 20` AND `culture = imperial`
  OR `culture = nord`
- **Milestones:** 6 required

| # | Milestone | Required Action |
|---|---|---|
| 1 | *The Shout* | Use the Thu'um at least once (flag set by `thu'um_events.txt`) |
| 2 | *The Empire* | Rule directly over at least 3 Imperial-culture provinces simultaneously |
| 3 | *The Wound* | Survive an assassination attempt |
| 4 | *The Mercy of the Strong* | Execute a mercy decision that costs significant political capital |
| 5 | *The Shezarrine Echo* | Have `has_trait = shezarrine_vessel` OR complete the Shezarrine chain |
| 6 | *The Ruby Throne* | Be the single paramount ruler of Cyrodiil (title-based check) |

- **Apex Trait:** `mantle_talos`
- **Stats:** Martial +6, Diplomacy +4, all stats +2, `monthly_prestige = 15`
- **Special:** Doubles the rate at which new Talos worship traits spread in the ruler's realm.
  Other rulers with `thalmor_agent` traits gain opinion -30 automatically.
- **Flavor:** The ruler is now *an aspect* of Talos — not a god, but a living expression
  of the same archetypal pattern. In-universe, their legacy will be comparable to
  Reman Cyrodiil's.

##### Mantling Arkay
> *The god of the cycle. Some texts suggest he was once a mortal merchant who died
> and returned with divine knowledge. The cycle can be walked as well as observed.*
> `[SOFT CANON — The Monomyth]`

- **Prerequisites:** `learning >= 14` AND (`has_trait = compassionate` OR `has_trait = zealous`)
- **Milestones:** 6 required

| # | Milestone | Required Action |
|---|---|---|
| 1 | *The Burial* | Personally attend the execution/honorable death of a major character in your realm |
| 2 | *The Plague Witness* | Survive a plague event in your realm without fleeing court |
| 3 | *The Near-Death* | Survive a health crisis (`health` drops below 1.5 at some point) |
| 4 | *The Season's Turn* | Rule for at least 20 years from first becoming a ruler |
| 5 | *The Grief Without Anger* | Lose a close family member without retaliating against anyone |
| 6 | *The Old Age* | Reach age 55+ while still ruling |

- **Apex Trait:** `mantle_arkay`
- **Stats:** Health +3.0 (paradoxically — Arkay does not cheat death, but governs it; the mantler
  is no longer subject to arbitrary death), Learning +5, Piety +100 (immediate)
- **Special:** The `mantle_arkay` ruler is immune to the `death_chim_erasure` cause and
  any event that triggers character death from spiritual or metaphysical sources.
  Undead characters in the realm gain -20 opinion.

##### Mantling Kynareth / Kyne
> *Goddess of the sky, wind, and natural world. Nordic form is Kyne — Shor's widow
> and mother of men. The Throat of the World is sacred to her.*

- **Prerequisites:** `has_trait = brave` AND culture is Nordic OR has completed
  any Word Wall discovery event
- **Milestones:** 6 required

| # | Milestone | Required Action |
|---|---|---|
| 1 | *The Word on the Wind* | Discover a Word Wall (flag set by `barrow_events.txt`) |
| 2 | *The Wild Journey* | Complete the Companions questline or equivalent exploration chain |
| 3 | *The Open Hand* | Grant independence or full autonomy to a subordinate without cause |
| 4 | *The Sky Witnessed* | Win a battle fought in mountainous or coastal terrain |
| 5 | *The Shor Remembered* | If Nordic culture: refuse to retaliate against a Shezarrine rival |
| 6 | *The Storm's Eye* | Survive a war in which you were heavily outnumbered |

- **Apex Trait:** `mantle_kynareth`

##### Mantling Azura *(Daedric Mantle — higher risk/reward)*
> *Azura's domain is dusk and dawn — the moments of transformation. She is a
> Daedric Prince, which makes this Mantling dangerous and theologically complex.*
> `[CONTESTED — Daedra cannot be mantled in the same way as Aedra; some texts
> suggest the process is 'Daedric' rather than 'Mantling' proper]`

- **Prerequisites:** `has_trait = chim_seeker` OR `has_trait = chim_achieved`;
  AND Dunmer culture/faith adjacency
- **Failure Risk:** Unlike Aedric mantles, Daedric mantles have a 25% chance
  at the final threshold event to result in **possession** rather than apotheosis —
  the ruler becomes Azura's champion rather than her aspect, losing the
  `mantle_azura` trait and gaining `daedric_champion` instead.
- **Milestones:** 6 required (including actions tied to Dunmer and the
  Tribunal system — protecting Dunmer people, predicting a future event,
  forming a covenant at dusk/dawn in a sacred location)
- **Apex Trait:** `mantle_azura`

##### Mantling Meridia *(Daedric Mantle)*
> *Goddess of light and life energy. Despises undead with absolute conviction.
> An unusual Daedric Prince to mantle — but Meridia's pattern (purification,
> uncompromising opposition to corruption) is entirely walkable.*

- **Prerequisites:** `has_trait = dawnguard_commander` OR equivalent; must have
  participated in Dawnguard events
- **Milestones:** Include destroying vampire/undead threats, refusing to pardon
  necromancers, refusing to deal with Molag Bal agents
- **Failure Risk:** Same 25% possession risk as Azura mantle

---

### Path C: The Psijic Endeavour

> *"The Old Ways. Not learned — remembered. The Psijic Order does not teach
> magic. It reminds those who have always known."*

**Entry requirement:** `learning >= 16` AND any of:
- `has_trait = scholar`
- `has_character_flag = psijic_contact` (set by contact events to be designed)
- `has_trait = chim_seeker` (the intellectual hunger is the same kind)

**Lore basis:** The Psijic Order practices a form of magic that predates the
Mages Guild's six schools — the "Old Ways." The Endeavour is their specific
philosophical framework for achieving a state of perception that transcends
ordinary time. The Eye of Magnus (from *Skyrim*) is related. `[PARTIALLY CANON — UESP:Psijic Order]`

**Tone:** Meditative. Slow. Each milestone is a meditation or a discovery, not
an action. This path suits scholar rulers who never go to war.

#### Milestones (6)

| # | Milestone | Required Action |
|---|---|---|
| 1 | *The Silence Found* | Spend 180 days without triggering any stress event (decision-based) |
| 2 | *The Text Understood* | Achieve `learning_lifestyle_xp` threshold — Scholar perk tree |
| 3 | *The Eye's Echo* | Discover a Dwemer/ancient ruin and encounter the metaphysical resonance (flag from `dwemer_ruins_events.txt`) |
| 4 | *The Word Heard Before It Was Spoken* | Receive a court event and correctly "predict" its outcome (flavor decision) |
| 5 | *The Past Not Grieved* | Reach age 40+ without the `grief` stress trait |
| 6 | *The Endeavour Complete* | Have `learning >= 22` when the final check fires |

#### Midpoint Event (progress = 50)

*"The advisors have begun to notice that you sometimes answer their questions
before they ask them."*
The ruler's perception of time has begun to blur slightly. They now see the
dream's seams — not with CHIM's total sovereignty, but with the Psijic's
patient observation. Option: share this with a trusted courtier (gains them
as an **Intellectual Friend** with high opinion), or keep it entirely private
(small stress reduction).

#### Apex Trait: `psijic_adept_supreme`

- Learning +8, Stewardship +4, Intrigue +3
- `monthly_prestige = 6`
- **Special mechanic — *The Rewind*:** Once per ruler lifetime (not per reign),
  the player may use a decision `invoke_psijic_rewind` to re-trigger the most
  recent major negative event at their court — effectively undoing a single
  catastrophic outcome. (This is cosmetically framed as the ruler having
  perceived the moment before it happened and acted differently. Mechanically
  it fires the event again with `option_b` being automatically selected, or a
  new option added.)
- **Flavor:** The Psijic adept is still mortal and still aging — but their
  awareness of time makes ordinary urgency feel trivial. Stress gain from
  court pressures is reduced significantly.

---

### Path D: The Enantiomorph (Dark Path)

> *"Every Hero needs a Witness. And every pattern requires its opposite.
> You are not the Hero of this story. That is the point."*

**Entry requirement:** `intrigue >= 16` AND (`has_trait = deceitful` OR
`has_trait = paranoid` OR `has_trait = ruthless` OR has committed regicide)

**Lore basis:** The Enantiomorph is the divine pattern of Hero/Rebel/Witness
described in Vivec's 36 Lessons — the three-role cosmological drama that
creates Dragon Breaks and defines the nature of divine conflict. Normally the
mortal is the Witness. This path is about *choosing to be the Rebel* —
the necessary opposition that makes the Hero real. `[SOFT CANON — 36 Lessons of Vivec, Sermon 11]`

**Tone:** Dark. Destabilising. The ruler is not pursuing wisdom or divinity in
any conventional sense. They are pursuing *opposition* — becoming the void at
the centre of someone else's story. This path has the highest failure rate and
the most dramatic failure outcome.

**Important lore note:** The Enantiomorph is not evil per se — it is a
*necessary cosmological function*. The Rebel is as essential as the Hero.
The path should not be moralized; it should be presented as unsettling, alien,
and entirely consistent with TES metaphysics.

#### Milestones (6)

| # | Milestone | Required Action |
|---|---|---|
| 1 | *The Throne Taken* | Seize a title by usurpation or intrigue rather than inheritance or war |
| 2 | *The Ally Betrayed* | Betray an ally with positive opinion above +50 |
| 3 | *The Witness Removed* | Assassinate a ruler who was narratively positioned as a "hero" (martial >= 18, brave, zealous) |
| 4 | *The Pattern Recognised* | Survive an assassination attempt that was your own fault (someone retaliating) |
| 5 | *The Rebel's Creed* | Refuse to join any religious crusade or holy war, ever |
| 6 | *The Void Named* | Accept your role consciously — via a specific event where the ruler is offered "redemption" and refuses it |

#### Failure Risk — The Enantiomorph Consumes (40% failure at progress = 75)

Unlike all other paths, at the 75% threshold event there is a **40% chance of
immediate catastrophic failure** rather than a setback. On failure:

- All territory ruled directly by the character experiences a **Dragon Break** —
  a minor, realm-limited version — for 2 years (all decisions suspended, chaos events fire)
- The character gains `enantiomorph_consumed` trait (debilitating; Learning -5, Intrigue -5, stress +100)
- They cannot attempt this path again this reign

On success at the 75% threshold: the path continues, and the failure risk drops to 15% at the apotheosis.

#### Apex Trait: `enantiomorph_ascendant`

- Intrigue +8, Martial +5, Diplomacy -4 (they are genuinely frightening now)
- `monthly_prestige = 8`
- `dread_gain_mult = 0.50`
- `stress_gain_mult = -0.30`
- **Special mechanic — *Dragon Break Anchor*:** Once per 20 years, the ruler may
  trigger a minor Dragon Break centered on a **rival's realm** (not their own).
  This fires a 1-year chaos event chain on the target that scrambles succession
  and creates artificial claim disputes. Highly disruptive; costs no gold but costs
  300 prestige.
- **World effect:** All rulers with `shezarrine_vessel` or `chim_achieved` gain
  a notification: *"Something has gone wrong with the pattern."* They gain a
  permanent opinion modifier of -20 toward the Enantiomorph ascendant.

---

### Path E: The Amaranth (Hidden / Endgame)

> *"CHIM is the dream understood. The Amaranth is dreaming your own.
> You are not becoming a god. You are becoming a Godhead."*
> — paraphrase, *Loveletter from the Fifth Era* `[MK TEXT — HIGHLY SPECULATIVE]`

**Entry requirement:** `has_trait = chim_achieved` AND `has_character_flag = walking_ways_any_path_completed`
(any other Walking Way path must have been completed first)

**Availability:** Hidden from the decision UI until both requirements are met.
This is a **final-stage path** — it is not something a ruler stumbles into.

**Lore basis:** The Amaranth is described in Kirkbride's *Loveletter from the Fifth Era*
as the ultimate act — a CHIM-achieved being who achieves *infinite dreaming*,
creating a new Aurbis entirely. The cosmological implication is that every
universe exists because a previous being achieved the Amaranth. `[MK SUPPLEMENTARY — NOT IN-GAME CANON]`

**Tone:** Transcendent. Incomprehensible. The events here should feel like reading
something that exists at the edge of language. The ruler is not becoming more powerful —
they are becoming *less here*.

**Only 3 milestones** (the path is short because the ruler has already walked all
other paths — the Amaranth is a culmination, not a grind):

| # | Milestone | Required Action |
|---|---|---|
| 1 | *The Other Dream Glimpsed* | A unique event where the ruler sees a flash of a world that is *not* the Aurbis — a brief impossible vision with no explanation | +30 |
| 2 | *The Name Unrequired* | The ruler willingly gives up their dynasty name (decision, flavor only, no mechanical title change) — acknowledging that identity is now irrelevant | +35 |
| 3 | *The Godhead's Question* | A final event: the Godhead's dream pauses, briefly, to ask the ruler a question. The answer — any answer — completes the path | +35 |

#### Apotheosis — The Amaranth

This is the only path with a **narrative ending** rather than a trait grant.

The apotheosis event fires. The ruler does not gain a trait. Instead:

1. The character receives `amaranth_achieved` (a hidden flag, not a visible trait)
2. A **world event** fires to every ruler in Tamriel: *"The dream has changed. Something
   new has begun in a direction no compass names."* No mechanical effect. Pure lore.
3. The ruler's **lifespan is extended by 200 years** (set_character_flag workaround
   for extreme longevity — or a health modifier of +10 that effectively prevents natural death)
4. The ruler's court begins generating unique **"Dreamer's Court" events** — each one
   describes the ruler perceiving their own realm as a story they are writing, rather
   than living. Pure flavor. No stress gain ever again. Piety at maximum.
5. **The ruler cannot die of natural causes.** They can still be killed by assassination,
   war, or event-driven death — but `natural_death` is effectively removed.

**Design note:** The Amaranth should *feel* like a win condition for a specific
philosophical playstyle. It is not the "best" outcome in terms of raw stats — the
Talos mantle is more militarily powerful. The Amaranth is for the player who
engaged with all the lore systems and wants a meaningful narrative conclusion.

---

## 8. Stage 4 — Apotheosis Events

Each path's apotheosis event should:

- Be **long-form prose** — 2,500–4,000 characters of event description
- Offer **2–3 option choices** that affect flavor only (not pass/fail — you've already
  passed by reaching progress = 100)
- Apply the apex trait via `immediate = {}` so it is granted regardless of which
  option is chosen
- Fire a **world notification** to every ruler (see §9)
- Have a unique `theme` tag matching the path's tone

### Prose Guidance per Path

| Path | Tone | Point of View | Key Image |
|---|---|---|---|
| CHIM Expanded | Crystalline clarity; serene | Third-person watching self | *"The court continues below."* |
| Mantling | Epic; the moment of convergence | Second-person | *"You look in the mirror and see them."* |
| Psijic Endeavour | Quiet; the sound stopping | First-person memory | *"You remember what you have always known."* |
| Enantiomorph | Unsettling; cosmic void | Second-person inverse | *"The pattern is complete. You are the hole."* |
| Amaranth | Incomprehensible; language failing | All POVs simultaneously | *"[the text does not continue in any direction you can follow]"* |

---

## 9. World Notification System

When any ruler completes a Walking Ways path, a **world-notification event** fires
to every living ruler using:

```
every_ruler = {
    limit = { NOT = { this = root } }
    trigger_event = { id = walking_ways.world_notify days = 3 }
}
```

The notification event is non-interactive (no options with mechanical effects) but
carries flavor text describing what the rest of the world perceives:

- **CHIM:** *"A philosopher-king in [REALM] has ceased to dream, and yet continues."*
- **Mantling (Talos):** *"In [REALM], a mortal has walked in Talos's footsteps long
  enough that the footsteps are now theirs."*
- **Psijic Endeavour:** *"The Psijic Order has sent a rare message: one who pursued
  the Old Ways has completed the Endeavour."*
- **Enantiomorph:** *"Something has gone wrong with the pattern. The Hero of [REALM]
  is no longer the Hero."*
- **Amaranth:** *"The dream has changed."*

Rulers with specific traits react differently to these notifications:
- Rulers with `chim_achieved` get a more informed version of the text
- Rulers with `thalmor_agent` get a hostile version for Talos/CHIM notifications
- Rulers with `shezarrine_vessel` get a resonant, deeply personal notification

---

## 10. Integration with Existing Mod Systems

This section documents exactly which existing systems would need a small addition
(a flag-set line in one of their option blocks) to feed into the Walking Ways
progress engine. No existing events need structural changes — only a single
`if { limit = { ... } }` block added per integration point.

| Existing System | Event(s) to Modify | Flag Set | Path Served |
|---|---|---|---|
| `thu'um_events.txt` | Any successful shout mastery event | `ww_mantling_talos_milestone_shout` | Talos Mantle |
| `shezarrine_events.txt` | `shezarrine.001.a` (accept mantle) | `ww_mantling_talos_milestone_shezarrine` | Talos Mantle |
| `barrow_events.txt` | Word Wall discovery event | `ww_mantling_kynareth_milestone_wordwall` | Kynareth Mantle |
| `dragon_priest_events.txt` | Dragon mask acquisition event | `ww_psijic_milestone_eye_echo` | Psijic Endeavour |
| `dwemer_ruins_events.txt` | Aetherium/memory stone discovery | `ww_psijic_milestone_eye_echo` | Psijic Endeavour |
| `dawnguard_events.txt` | Volkihar defeat event | `ww_mantling_meridia_milestone_undead_slain` | Meridia Mantle |
| `chim_events.txt` | `chim.002.a` (CHIM achieved) | `ww_chim_gate_open` | Gates Path C/A |
| `daedric_champion_events.txt` | Azura champion event | `ww_mantling_azura_milestone_covenant` | Azura Mantle |
| `tribunal_events.txt` | Any Tribunal saint-path event | `ww_mantling_azura_milestone_dunmer_covenant` | Azura Mantle |
| `black_books_events.txt` | Apocrypha visit event | Prerequisite flag for Amaranth path awareness | Path E gate |

---

## 11. New Files Required

### Event Files

| File | Namespace | Events | Notes |
|---|---|---|---|
| `mod/events/walking_ways_events.txt` | `walking_ways` | `walking_ways.000`–`walking_ways.019` | Core engine, awareness, thresholds, world notify |
| `mod/events/mantling_talos_events.txt` | `mantling_talos` | 8 events | Path-specific milestones + apotheosis |
| `mod/events/mantling_arkay_events.txt` | `mantling_arkay` | 8 events | Path-specific milestones + apotheosis |
| `mod/events/mantling_kynareth_events.txt` | `mantling_kynareth` | 8 events | Path-specific milestones + apotheosis |
| `mod/events/mantling_daedric_events.txt` | `mantling_daedric` | 10 events | Covers Azura + Meridia; shared failure mechanic |
| `mod/events/psijic_endeavour_events.txt` | `psijic_endeavour` | 10 events | Meditation events + rewind mechanic setup |
| `mod/events/enantiomorph_events.txt` | `enantiomorph` | 8 events | Dark path milestones + Dragon Break trigger |
| `mod/events/amaranth_events.txt` | `amaranth` | 5 events | Short path; final apotheosis + world event |

### Trait Files

| File | Traits Defined |
|---|---|
| `mod/common/traits/walking_ways_traits.txt` | `walking_ways_seeker`, all path-progress traits |
| `mod/common/traits/mantling_traits.txt` | All 7 mantle apex traits |
| `mod/common/traits/psijic_adept_traits.txt` | `psijic_adept_supreme` |
| `mod/common/traits/enantiomorph_traits.txt` | `enantiomorph_ascendant`, `enantiomorph_consumed` |
| `mod/common/traits/amaranth_traits.txt` | `amaranth_achieved` (hidden) |

### Decision Files

| File | Decisions Defined |
|---|---|
| `mod/common/decisions/walking_ways_decisions.txt` | `choose_walking_way`, `invoke_psijic_rewind`, `enantiomorph_rebel_creed` |

### Modifier Files

All new modifiers should be appended to the existing
`mod/common/modifiers/lore_races_modifiers.txt` (currently ~246 modifiers).
See §13 for the full list.

### Localization Files

| File | Keys |
|---|---|
| `mod/localization/english/walking_ways_l_english.yml` | Core system + awareness + selection |
| `mod/localization/english/mantling_l_english.yml` | All mantle paths (all 5 available mantles) |
| `mod/localization/english/psijic_endeavour_l_english.yml` | Psijic path events + traits |
| `mod/localization/english/enantiomorph_l_english.yml` | Dark path events + traits |
| `mod/localization/english/amaranth_l_english.yml` | Endgame path events + traits |

**Reminder:** All `.yml` files MUST start with UTF-8 BOM (`EF BB BF` bytes).
Use: `printf '\xef\xbb\xbf' | cat - file > tmp && mv tmp file`

### on_actions Registration

The following must be added to `lore_races_on_actions.txt` under `on_yearly_pulse`:

```
# Walking Ways — progress engine (weight 5 = ~1 in 41 chance per year)
5 = walking_ways.progress_check
```

Do **not** register the awareness event (`walking_ways.000`) in on_yearly_pulse —
it is triggered directly by the three gateway conditions (via decisions or
existing events), not by yearly random check.

---

## 12. New Traits Required

| Trait ID | Category | Description | Path |
|---|---|---|---|
| `walking_ways_seeker` | lifestyle | Awareness gained; path not chosen | Shared gate |
| `chim_sovereign` | fame | CHIM expanded apex | Path A |
| `mantle_talos` | fame | Talos mantle apex | Path B |
| `mantle_arkay` | fame | Arkay mantle apex | Path B |
| `mantle_kynareth` | fame | Kynareth mantle apex | Path B |
| `mantle_azura` | fame | Azura mantle apex (Daedric) | Path B |
| `mantle_meridia` | fame | Meridia mantle apex (Daedric) | Path B |
| `psijic_adept_supreme` | fame | Psijic Endeavour apex | Path C |
| `enantiomorph_ascendant` | fame | Enantiomorph apex | Path D |
| `enantiomorph_consumed` | lifestyle | Enantiomorph failure state | Path D |
| `amaranth_achieved` | fame (hidden) | Amaranth endgame | Path E |

**Total new traits:** 11

---

## 13. New Modifiers Required

These should be appended to `lore_races_modifiers.txt` in a clearly labeled block
titled `# THE WALKING WAYS — PROGRESSION MODIFIERS`.

| Modifier ID | Mechanical Effect | When Active |
|---|---|---|
| `ww_progress_25_aura` | Prestige +2/month; learning +1 | Progress >= 25, any path |
| `ww_progress_50_aura` | Prestige +4/month; learning +2; stress -10% | Progress >= 50 |
| `ww_progress_75_aura` | Prestige +6/month; all stats +1; stress -20% | Progress >= 75 |
| `ww_path_chim_active` | Learning +3; stress +10% (the expansion of CHIM is not comfortable) | During Path A |
| `ww_path_mantling_active` | Prowess +2; prestige +2/month | During Path B |
| `ww_path_psijic_active` | Learning +2; stress -10% | During Path C |
| `ww_path_enantiomorph_active` | Intrigue +3; diplomacy -2; dread +20% | During Path D |
| `ww_path_amaranth_active` | All stats +1; stress gain mult -0.30 | During Path E |
| `enantiomorph_consumed_penalty` | Learning -5; intrigue -5; stress gain mult +0.40 | After Enantiomorph failure |
| `mantling_daedric_risk` | Nothing visible — internal logic flag for the 25% possession check | During Daedric mantle |
| `amaranth_dreaming` | Stress gain mult -1.00 (zero stress); piety +5/month | After Amaranth apex |
| `chim_sovereign_presence` | Dread +30%; opinion from scholar characters +20 | After CHIM apex |
| `talos_mantle_world_shift` | +20 opinion from Imperial-culture characters; -30 from Thalmor agents | After Talos mantle |
| `arkay_mantle_deathsight` | Immune to metaphysical death events; +20 opinion from priests | After Arkay mantle |
| `psijic_rewind_ready` | Flavor indicator that the rewind ability is available | After Psijic apex; removed on use |

**Total new modifiers:** ~15

---

## 14. Lore Accuracy / Canon Status Notes

Every lore concept used in this system is documented below with its canon status
and primary source. This section should be consulted before writing any event prose.

| Concept | Canon Status | Source |
|---|---|---|
| CHIM — the secret syllable of royalty | `[SOFT CANON]` | *36 Lessons of Vivec*; *The Loveletter from the Fifth Era* (MK) |
| The Walking Ways (as a framework of 8 paths) | `[SOFT CANON — MK]` | Michael Kirkbride supplementary texts; not in-game directly |
| Mantling — becoming by walking in footsteps | `[CANON]` | *The Arcturian Heresy* (in-game book, Morrowind/Oblivion) |
| Tiber Septim mantling Lorkhan/Shor | `[CANON — contested interpretation]` | *The Arcturian Heresy*; Talos entry on UESP |
| Psijic Order's "Old Ways" | `[CANON]` | UESP Lore:Psijic Order; referenced in *ESO* and *Skyrim* |
| The Enantiomorph (Hero/Rebel/Witness) | `[SOFT CANON — MK]` | *36 Lessons of Vivec*, Sermon 11 |
| The Amaranth — dreaming a new Aurbis | `[MK SUPPLEMENTARY — NOT IN-GAME]` | *Loveletter from the Fifth Era* (Michael Kirkbride, not official canon) |
| Azura as a mantleable Daedric Prince | `[CONTESTED — interpretive]` | Extrapolated from mantling concept; no direct source |
| Arkay as former mortal | `[SOFT CANON]` | *The Monomyth* (in-game book); heavily contested |
| The Psijic Rewind mechanic (time perception) | `[EXTRAPOLATED]` | Psijic time-stop ability in *Skyrim:College of Winterhold*; ESO Psijic quests |
| Shezarrine → Talos mantle connection | `[CANON — interpretive]` | Reman Cyrodiil = Shezarrine; Talos = Shezarrine apex; both described in UESP |

### Canon Tier Key
- `[CANON]` — Directly stated in official in-game text
- `[SOFT CANON]` — Inferred from in-game texts; not stated directly
- `[MK SUPPLEMENTARY]` — From Michael Kirkbride's supplementary writings; interesting
  and commonly accepted by the community but not official
- `[EXTRAPOLATED]` — Logical extension of canon; no direct source
- `[CONTESTED]` — Disputed; multiple contradictory interpretations exist

**Design rule:** Any event prose drawing on `[MK SUPPLEMENTARY]` or `[EXTRAPOLATED]`
concepts should acknowledge the ambiguity in the text — the unreliable narrator or
the scholar who is unsure. Prose should never claim these things as fact.

---

## 15. Implementation Pitfalls and CK3 Mechanics Notes

### Variable Usage
The `walking_ways_progress` variable should use `set_variable`, `change_variable`,
and `has_variable` — the same pattern as `dragon_masks_count` in
`dragon_priest_events.txt`. This is already verified working in the mod.

Do **not** use `clamp_variable` if the CK3 version in use does not support it —
instead, add an `if = { limit = { var:walking_ways_progress >= 100 } }` guard
before any `change_variable add = X` calls to prevent overflow.

### Preventing Duplicate Completion
Set `walking_ways_path_completed = [path_key]` flag **in the apotheosis event's
`immediate = {}` block** before granting the trait. Add `NOT = { has_character_flag = walking_ways_path_completed_[X] }`
to the apotheosis event trigger to prevent it firing twice.

### AI Weighting
The `ai_will_do` block for `choose_walking_way` should have a very low base weight.
Most AI rulers should not pursue this — it should remain rare and meaningful:

```
ai_will_do = {
    base = 1
    modifier = {
        add = 8
        learning >= 22
        has_trait = scholar
    }
    modifier = {
        add = 5
        # Mantling path: martial rulers
        martial >= 22
    }
}
```

### Stress Calibration
The Walking Ways system adds significant stress at several points. Verify that
no path can kill a character through stress cascade in under 2 years. The
intended experience is *pressure*, not immediate death. Cap single-event stress
additions at 30 unless the event is specifically a catastrophic failure event.

### Daedric Mantle Possession Risk
The 25% possession-at-finale mechanic for Daedric mantles requires careful
implementation. Use `random = { chance = 25 ... }` inside the apotheosis event's
`immediate = {}` block, not in an option — so it fires regardless of which option
the player clicks. The player should not be able to dodge the risk by option choice.

### Localization Length
Event descriptions for apotheosis events will be long (2,500–4,000 characters).
CK3 handles this fine but test in-game to verify text box scrolling works
correctly for the longest descriptions (Amaranth in particular).

### The Amaranth's "Narrative Ending" Concern
Making the Amaranth a de-facto win-condition/narrative endpoint means the ruler
continues to be playable but the game loop changes. Verify this does not cause
issues with succession or the game's end-conditions. The `amaranth_achieved`
flag should be checked by the world-notification system only — it should not
interact with any game-ending conditions.

---

## 16. Revision Notes — CK3 & EK2 Mechanic Alignment

> **Added:** Session 2026-04-05 — this section reviews §§1–15 against the existing
> mod's actual coding patterns (Thu'um, Dragon Priest, Psijic, Dragon Break, CHIM,
> Shezarrine) and CK3/EK2 mechanics to identify structural improvements. Nothing
> here reverses the design above; it refines and extends it.

---

### 16.1 Replace the 0–100 Integer Variable with a Rank Ladder

**Problem:** §3 and §6 specify a `walking_ways_progress` variable ranging 0–100,
with decay and overflow guards. This is an atypical pattern for this mod.

**Evidence:** The Thu'um system uses `thuumvoi_rank` as a 1/2/3 integer, and
`dragon_masks_count` counts discrete items. No existing system uses a 0–100 meter
with drift. The 0–100 approach requires overflow guards on every `change_variable`
call, and a hidden yearly decay makes failure feedback invisible and frustrating.

**Revised approach:** Use a **rank variable with 4 stages** instead:

| Rank | `ww_rank` value | Meaning | Threshold event |
|---|---|---|---|
| — | 0 (or not set) | Path declared, no milestones done | Path-intro event |
| Seeking | 1 | 1–2 milestones completed | First cosmological sign |
| Striving | 2 | 3–4 milestones completed | Midpoint pressure event |
| Threshold | 3 | 5–6 milestones completed | Final approach event |
| Apex | 4 | All milestones completed | Apotheosis event fires immediately |

Each path stores its rank in `var:ww_[path]_rank`. The progress engine checks
`var:ww_[path]_milestones_done` (integer; counts completed milestone flags) and
advances the rank variable whenever the milestone count crosses 2 / 4 / 6.

This mirrors exactly how `thuumvoi_rank` advances from 1→2→3 via `advance_voice_training`.
No overflow. No decay. Clear, visible feedback.

**On abandonment/decay:** Rather than silent decay, use the momentum modifier system
described in §16.5 below — a visible modifier that expires after 2 years of inactivity,
triggering a reminder event. The player always knows where they stand.

---

### 16.2 Scripted Effects File (Essential — Missing from §11)

**Problem:** §11 does not specify scripted effects files. Every major mod system
(Thu'um, Daedric Invasion, Dwemer Ruins, Guilds) uses `mod/common/scripted_effects/`
files. Without these, the event code becomes massive and unrepeatable.

**Required file:** `mod/common/scripted_effects/walking_ways_effects.txt`

**Required named effects** (mirroring `thuumvoi_effects.txt` structure exactly):

```
# State transitions — one set per path
begin_path_chim_expanded = { ... }       # Set flag, set var:ww_chim_rank = 0, give walking_ways_seeker, fire intro event
advance_path_chim_expanded = { ... }     # Increment var:ww_chim_rank; fire threshold event if at 1/2/3; fire apotheosis if = 4
complete_path_chim_expanded = { ... }    # Grant apex trait, world notify, set completed flag, remove seeker trait
abandon_path_chim_expanded = { ... }     # Remove rank var, remove seeker, fire abandonment event, cooldown flag

# One set per path — chim_expanded, mantling_talos, mantling_arkay, mantling_kynareth,
#                     mantling_azura, mantling_meridia, psijic_endeavour,
#                     enantiomorph, amaranth

# Shared utilities
count_ww_milestone = {                   # Checks and counts milestone flags; increments var:ww_[path]_milestones_done
    # Called from the hidden yearly event
}
notify_world_ww_completion = {           # Fires world-notification event to every ruler
    every_ruler = {
        limit = { NOT = { this = root } }
        trigger_event = { id = walking_ways.world_notify days = 3 }
    }
}
```

**Revised §11 — New Files Required** should add:

| File | Effects Defined |
|---|---|
| `mod/common/scripted_effects/walking_ways_effects.txt` | All begin/advance/complete/abandon effects for all 9 paths; shared utilities |

---

### 16.3 Scripted Triggers File (Essential — Missing from §11)

**Problem:** §11 does not specify scripted triggers files. Every major system
uses `mod/common/scripted_triggers/` files for `is_valid`/`is_shown`/`trigger` blocks.

**Required file:** `mod/common/scripted_triggers/walking_ways_triggers.txt`

**Required named triggers:**

```
is_on_walking_way = {                    # Any path is currently active
    has_character_flag = walking_ways_path_active
}
has_completed_walking_way = {            # Any path has been completed
    OR = {
        has_character_flag = ww_chim_expanded_completed
        has_character_flag = ww_mantling_talos_completed
        # ... etc for all paths
    }
}
can_begin_walking_ways = {              # Shared eligibility: is a ruler, is adult, not already on a path
    is_ruler = yes
    is_adult = yes
    NOT = { is_on_walking_way = yes }
    NOT = { has_character_flag = walking_ways_refused }
}
can_begin_path_chim_expanded = {
    can_begin_walking_ways = yes
    has_trait = chim_achieved
}
can_begin_path_mantling_talos = {
    can_begin_walking_ways = yes
    OR = {
        has_trait = shezarrine_vessel
        AND = {
            martial >= 20
            OR = { culture = { has_cultural_pillar = ethos_bellicose } }
        }
    }
}
# ... one per path
```

**Revised §11 — New Files Required** should add:

| File | Triggers Defined |
|---|---|
| `mod/common/scripted_triggers/walking_ways_triggers.txt` | All path availability checks; shared eligibility trigger; completion checks |

---

### 16.4 The Existing CHIM System — Conflict Resolution

**Problem:** `mod/events/chim_events.txt` already implements `chim.000`–`chim.004`
(the decision `seek_walking_ways`, a 4-event chain, and a yearly flavor event).
§4–6 of this design effectively duplicate or replace most of this.

**The conflict:**
- `chim.000` = the awareness event. §4's Gate A/B/C replaces this.
- `chim.001` = the learning check. §6's progress engine replaces this.
- `chim.002` = CHIM achieved. §7 Path A's apotheosis replaces this.
- `chim.003` = CHIM failure/erasure. Still needed — kept as-is.
- `chim.004` = yearly flavor for `chim_achieved`. Needs updating.

**Resolution strategy — "Wrap, Don't Replace":**

Keep the existing `chim.000`–`chim.003` chain intact. It remains the fast-path
for rulers with `learning >= 20` who don't want the extended system.

Modify `chim.002` (CHIM achieved) to also check:
```
if = { limit = { has_character_flag = walking_ways_path_active } }
    # Do not fire Walking Ways apotheosis here — the Walking Ways engine handles it
else = {
    # original behavior — grant chim_achieved via the fast path
}
```

The Walking Ways system adds **Path A (CHIM Expanded)** as something only
`chim_achieved` rulers (those who completed the existing fast-path) can pursue.
So the two systems are sequential, not competitive.

`chim.004` (yearly flavor) should be updated to check `NOT = { has_character_flag = ww_chim_expanded_active }` —
if the ruler is on Path A, the richer Walking Ways yearly events fire instead.

**Net result:** The existing 4-event system and the Walking Ways system coexist cleanly.
No existing events need to be deleted — only small `if/else` guards added.

---

### 16.5 Momentum Modifier — Replacing Silent Decay

**Problem:** §6 describes a soft-decay mechanic (−3 progress per year without milestones).
This is punishing and invisible. The player may not notice their progress is eroding.

**Better pattern — Momentum Modifier (drawn from CK3's Struggle mechanic):**

When any milestone is completed, the `advance_path_[X]` scripted effect:
1. Grants `ww_momentum_[path]` modifier for 730 days (2 years)
2. This modifier provides a small stat bonus (e.g., learning +1, prestige +2/month)
   and a visible icon indicating "the path demands attention"
3. If the modifier expires without a new milestone advancing it:
   - A **reminder event** fires: `walking_ways.reminder`
   - The event notes that the path is fading — the ruler has not acted
   - Options: (a) recommit (costs 15 stress, resets the momentum timer WITHOUT advancing rank);
     (b) abandon the path (fires the abandonment event chain)
4. If the reminder is dismissed with option (b), the path is cleanly abandoned

**No invisible progress erosion. No overflow risk. Clear player feedback at all times.**

The modifier file for `ww_momentum_[path]` entries should use a shared base modifier
(`ww_path_momentum_base`) with path-specific bonuses layered on top — approximately
12 new modifier entries total (one per path + variants), appended to
`lore_races_modifiers.txt` in the Walking Ways block.

---

### 16.6 EK2 Dependency Map — Which Paths Need EK2

The mod's `thuumvoi_events.txt` header states: *"EK2 is required. 'dragonborn' is EK2's trait."*
The Walking Ways design must specify the same clearly:

| Path | EK2 Dependency | Notes |
|---|---|---|
| CHIM Expanded | **Standalone** | Builds on existing `chim_events.txt`, which is standalone |
| Mantling Talos | **EK2 required** for `shezarrine_vessel` prereq | `shezarrine_vessel` is defined in EK2; Talos mantle via martial path is standalone |
| Mantling Arkay | **Standalone** | No EK2 traits required |
| Mantling Kynareth | **EK2 recommended** | Milestone 1 ("The Word on the Wind") is most naturally triggered by EK2's Barrow/Word Wall system; can have a fallback flag for non-EK2 runs |
| Mantling Azura | **Standalone** (with EK2 bonus) | Dunmer culture flag is standalone; EK2 provides richer Dunmer options |
| Mantling Meridia | **EK2 recommended** | `dawnguard_commander` trait is this mod's own trait; standalone |
| Psijic Endeavour | **Standalone** | Builds on existing `psijic_events.txt`, which is standalone |
| Enantiomorph | **Standalone** | All triggers are core CK3 stats/traits |
| Amaranth | **Standalone** | Requires CHIM, which is standalone |

**Files that should carry the EK2 note:**
The header block of `mantling_talos_events.txt` should mirror the same note as
`thuumvoi_events.txt`: *"EK2 is required for the full Shezarrine path; a fallback
trigger (martial >= 22 + culture check) is available for non-EK2 runs."*

---

### 16.7 The Psijic Counsel Integration Gap

**Problem:** §7 Path C says the Psijic Endeavour requires `has_character_flag = psijic_contact`.
But `psijic_contact` is already set by `psijic.000` (An Invitation from Artaeum) in the
existing `psijic_events.txt`. This is correct but underspecified.

**What the design should also note:**

The Gate B awareness event (`walking_ways.000`) that opens the Psijic Endeavour should
check whether the `psijic_counsel.000` NPC is still present at court as a patron
character. The existing `psijic_counsel.txt` system establishes an emissary character
who may still be lingering. If present, the Psijic Endeavour intro event should
reference this specific character by scope (` save_scope_as = psijic_mentor`).

**Interaction sequence that works cleanly:**

```
psijic.000      → sets psijic_contact flag (existing)
psijic.001      → Novice path begins (existing)  
psijic.002      → Adept's test (existing)
psijic.003      → Artaeum withdraws (existing)
  ↓
[years later]
psijic_counsel.000 → emissary arrives at court (existing)
  ↓
walking_ways.000 (Gate B) → fires for rulers with psijic_contact + psijic_adept + learning >= 16
  ↓
Path C (Psijic Endeavour) begins
```

The Walking Ways Psijic path is thus the *culmination* of the existing two-system
Psijic chain — not a competitor to it. The existing `psijic_adept` trait becomes
a natural prerequisite rather than just a learning threshold.

**Revised prerequisite for Path C:**
- `has_trait = psijic_adept` (upgraded from `has_character_flag = psijic_contact`)
- This ensures the ruler has completed `psijic.002` (the Adept's Test) before
  entering the deeper Endeavour path

---

### 16.8 The Enantiomorph — Witness Character Mechanic

**Problem:** §7 Path D describes the Enantiomorph as Hero/Rebel/Witness but never
specifies who the *Witness* is. Without a named Witness character, the path is
a list of actions without the cosmological structure the 36 Lessons describes.

**The Lore requirement:** *"The Enantiomorph is the pattern. The Hero and the Rebel
require each other. But both require the Witness — the one who observes and makes
the event real."* — 36 Lessons of Vivec, Sermon 11. `[SOFT CANON — MK texts]`

**Proposed Witness mechanic:**

When the Enantiomorph path begins (path intro event fires ~30 days after path selection):

1. **Identify the Witness character.** The event scans neighboring rulers and
   powerful courtiers for someone who could serve as the lore-Witness. Priority:
   - A neighboring ruler with `has_trait = brave` + `martial >= 16` (potential "Hero")
   - A powerful courtier with `has_trait = zealous` (an observer of faith)
   - Fallback: the most prestigious courtier in the ruler's court

2. **Save scope:** `save_scope_as = enantiomorph_witness`; flag the character
   `set_character_flag = is_enantiomorph_witness`

3. **The Witness gains an opinion modifier** — `witnessed_the_rebel` (+15 opinion,
   curiosity-flavored, not hostile). They sense something is happening. They
   are drawn to observe without understanding why.

4. **Two of the six milestones become Witness-dependent:**
   - Milestone 3 (*The Witness Removed*): the option to "remove" the Witness character
     (assassinate or exile) is a dramatic milestone — but at the cost of the pattern
     becoming *incomplete*. If the Witness is killed, a fork event fires:
     - **Pattern Completed** (if the Witness's death was witnessed by a third party):
       progress advances as normal but the ruler gains `stress += 30`
     - **Pattern Broken** (if the Witness was removed in secret): the path suffers a
       50% chance of failure at the next threshold (as the Enantiomorph consumed the
       Witness before the Witness could complete their function — cosmologically invalid)
   - Milestone 6 (*The Void Named*): the refusal of redemption event now specifically
     shows the Witness character as the one offering redemption — making the scene
     visceral and personal. The Witness *sees* the Enantiomorph refuse salvation.
     This is the completion of the three-body pattern.

5. **World notification at apotheosis** should specifically note the Witness:
   *"In [REALM], [CHARACTER_NAME] has stood as Witness to a transformation no
   prayer-book contains words for."* If the Witness is a neighboring ruler, they
   receive an additional personal notification with a `dread += 25` effect.

---

### 16.9 Competing Mantlers — Mantle Rivalry System

**Problem:** §7 Path B doesn't address what happens if two rulers simultaneously
pursue the same divine mantle. Lore-wise, a divine can only be mantled once — the
second mantler is pursuing a path that has already been walked to its conclusion.

**Proposed mechanic:**

When any ruler advances the `mantling_[divine]` path to Rank 2 (Striving), a hidden
check fires across all other living rulers. If another ruler also has
`var:ww_mantling_[same_divine]_rank >= 1`:

1. **Both rulers receive the `mantle_rival` event** (~`walking_ways.mantle_rival`)
   - Flavor: *"The [divine]'s pattern has felt more than one hand tracing it.
     Somewhere in Tamriel, another soul walks the same footsteps. Only one
     of you can complete this."*
   - Effect: Permanent opinion modifier between them: `rival_mantler_opinion` (-30,
     duration: until one completes or abandons)

2. **Only the FIRST to reach Rank 4 completes the mantle.** When the apotheosis
   fires, a check runs:
   ```
   NOT = { any_ruler = { has_character_flag = ww_mantling_[divine]_completed } }
   ```
   If the divine has already been mantled, the second ruler's apotheosis event fires
   a *failed* version: the footsteps are already someone else's. The path collapses.
   The second ruler gains `enantiomorph_echo` trait (minor negative; the failed mantler
   is now the Rebel to someone else's Hero, without having sought that role).

3. **AI behavior:** An AI ruler on a competing mantle path gains `ai_will_do` +10
   toward aggressive decisions toward the rival mantler — but no direct war mandate
   (this avoids artificial AI aggression while adding flavor).

4. **There can be exceptions:** The Arkay mantle specifically cannot have competing
   mantlers in lore terms (Arkay governs death cycles; two living practitioners of
   death's pattern is self-contradicting). The Arkay mantle should block the rivalry
   system entirely — only one ruler can even attempt it at a time (soft first-mover
   lock at Rank 1).

---

### 16.10 Path Abandonment — Graceful Exit Events

**Problem:** §6 mentions abandonment decisions but §7 doesn't define what abandonment
*means* for each path. The Thu'um system has `leave_voice_path_decision` with flavor
text explaining what it means to walk away from the Voice. Walking Ways needs equivalents.

**General abandonment structure:**

Decision `abandon_walking_way`:
- Available when: `is_on_walking_way = yes` AND `ww_momentum_[path]` modifier is absent
  (i.e., the momentum has already expired — you've already been reminded once)
- Effect: calls `abandon_path_[X]` scripted effect → fires `walking_ways.abandon_[path]` event → sets
  `ww_[path]_abandoned` flag for 10 years (blocking re-entry to the same path)

**Per-path abandonment flavor:**

| Path | What Abandonment Means Narratively |
|---|---|
| CHIM Expanded | *"The dream tightens again. You step back into it. You are less, but you remain."* — No trait penalty; the ruler simply stops. The CHIM they hold is not revoked. |
| Mantling (Talos) | *"The footsteps fade. You were not consistent enough."* — Lose `ww_momentum_talos` modifier; the rival mantler (if any) receives a notification. |
| Mantling (Arkay) | *"The cycle does not judge the living for choosing to live fully."* — No penalty; the path closes without recrimination. |
| Mantling (Daedric) | *"The Prince's attention moves on. For now."* — The ruler loses the Daedric contact modifier. If they had the possession-risk modifier active, it is removed (the Prince simply stops caring). |
| Psijic Endeavour | *"The stillness disperses. Artaeum has already withdrawn. What remains is ordinary quiet."* — No penalty; `psijic_adept` trait remains but no further progress is available. |
| Enantiomorph | *"The Rebel accepts the Hero's dominance. The pattern resets."* — If a Witness character exists: they receive a `witnessed_rebel_recede` opinion modifier (+20, relieved). The rival "Hero" ruler gains a permanent minor prestige bonus. |
| Amaranth | *"The dream turns inward again. You are still dreaming it. That will have to be enough."* — Massive stress relief (-80, the weight of the attempt lifts). The ruler retains `chim_achieved` and all prior path completions. The Amaranth cannot be re-attempted for 25 years. |

---

### 16.11 Stress Threshold Targeting

**Problem:** §6 and §7 use arbitrary stress numbers ("+15 stress", "+80 stress").
CK3's stress system has explicit mechanical tiers that the events should target
deliberately, not accidentally.

**CK3 Stress Levels:**
- **Level 1:** 25–74 — debuffs begin, coping behaviors available
- **Level 2:** 75–124 — serious debuffs, mental break possible
- **Level 3:** 125+ — mental break imminent; health penalty

**Design rule for Walking Ways events:**

| Event Type | Target Stress Change | Intent |
|---|---|---|
| Milestone completion | -15 to -20 | Achievement; brief relief |
| Threshold event (Rank 1→2) | +15 | First signs of pressure |
| Threshold event (Rank 2→3) | +20 | Path deepens; the cost is real |
| Threshold event (Rank 3→4) | +25 | Final approach; stress peaks |
| Apotheosis (success) | -60 to -80 | Transformation; stress lifts dramatically |
| Apotheosis failure (Enantiomorph) | +60 | Catastrophic; risks Level 3 |
| Abandonment | -30 | Relief of walking away |
| Momentum expired (reminder) | +10 | Gentle pressure to act |

**Specific adjustments from §7:**
- `chim.001` already adds +80 stress — this is fine for a pass/fail moment, but
  the Walking Ways expansion events should not also add large stress. The Path A
  journey should average net-neutral on stress until the apotheosis, where the
  accumulated pressure releases.
- Enantiomorph milestone 2 (*The Ally Betrayed*) should check current stress level
  before adding: `if = { limit = { stress >= 75 } } add_stress = 10` /
  `else = { add_stress = 20 }` — to avoid accidentally killing the ruler early.

---

### 16.12 Court Position — The Path Mentor

**CK3 inspiration:** CK3 has court positions (councillors, court chaplain, etc.)
that modify gameplay. EK2 adds several TES-specific positions.

**Proposal: `walking_ways_mentor` court position**

A ruler on any Walking Way path can appoint a court character as their Path Mentor.
This position:

- **Eligibility:** The appointee must have `learning >= 14` AND one of:
  `has_trait = psijic_adept`, `has_trait = chim_achieved`,
  `has_trait = shezarrine_vessel`, or `has_trait = scholar`
- **Effect on appointment:**
  - The Mentor character gains `mentor_of_the_way` modifier (+2 learning, monthly
    prestige +3)
  - The ruler's `ww_momentum_[path]` duration is extended by 180 days per year of
    mentorship (i.e., the path moves faster with guidance)
  - A unique yearly event fires for Mentor + Ruler pairs (dialogue events,
    `psijic_counsel.txt` style)
- **Conflict:** If the Mentor dies or leaves court, the ruler loses the momentum bonus
  and receives a stress event (+15). The path is not abandoned — but the loss is felt.
- **For the Enantiomorph:** The "Mentor" in this case is called the *Witness* instead,
  and is not a court position — it is the designated character from §16.8. The
  court position system is unavailable for Path D (the Enantiomorph does not seek guidance).

---

### 16.13 Dragon Break Interaction — Making the Enantiomorph's Power Lore-Consistent

**Problem:** §7 Path D gives `enantiomorph_ascendant` rulers the ability to trigger
"minor Dragon Breaks" in rival realms. This needs to connect properly to the
existing `dragon_break_events.txt` system.

**Existing system:** `dragon_break.000`–`dragon_break.003` trigger automatically
based on `global_var:active_tower_count <= 3`. This system is *cosmological* —
it is not character-triggered.

**How to make the Enantiomorph's power consistent:**

The Enantiomorph ruler's "Dragon Break" ability should NOT trigger the main
`dragon_break.001` event (which affects all rulers and requires Tower collapse).
Instead, it fires a **localized, personal Dragon Break** — `enantiomorph.dragon_break`
— a private event chain that only affects the target ruler's realm:

- The target ruler experiences `enantiomorph_chaos` modifier for 365 days:
  - All skill stats -3, all decisions have a 10% chance of triggering a wrong
    outcome (using `random = { chance = 10 ... add_stress = 30 }` in the decision)
  - Monthly prestige -5, piety -5
- A world notification fires: *"Something has gone wrong with the pattern in [REALM].
  Advisors speak of days that seem to repeat, of decrees that no one remembers giving."*
- The cosmological Dragon Break system (`dragon_break.000`) is *not* triggered —
  the Enantiomorph's power is real but not Tower-destroying. The real Dragon Break
  still requires Tower collapse.

This keeps the Enantiomorph's ability meaningful and powerful without breaking the
Tower system's established mechanics.

---

### 16.14 Revised File Architecture (Full Updated §11 Replacement)

This replaces §11 with a complete updated list:

#### Event Files

| File | Namespace | Event Count | Notes |
|---|---|---|---|
| `mod/events/walking_ways_events.txt` | `walking_ways` | ~20 | Core: awareness, path selection, momentum reminder, world notify, mantle rivalry, abandonment |
| `mod/events/mantling_talos_events.txt` | `mantling_talos` | ~10 | Milestones, Witness, rival mantler, apotheosis |
| `mod/events/mantling_arkay_events.txt` | `mantling_arkay` | ~10 | Milestones, apotheosis |
| `mod/events/mantling_kynareth_events.txt` | `mantling_kynareth` | ~10 | Milestones, apotheosis |
| `mod/events/mantling_daedric_events.txt` | `mantling_daedric` | ~12 | Azura + Meridia; shared possession mechanic |
| `mod/events/psijic_endeavour_events.txt` | `psijic_endeavour` | ~10 | Path C milestones; rewind mechanic |
| `mod/events/enantiomorph_events.txt` | `enantiomorph` | ~12 | Witness mechanic; all milestones; Dragon Break trigger |
| `mod/events/amaranth_events.txt` | `amaranth` | ~6 | Short path; final apotheosis |

#### New Common Files

| File | Purpose |
|---|---|
| `mod/common/scripted_effects/walking_ways_effects.txt` | All begin/advance/complete/abandon effects; world notify utility |
| `mod/common/scripted_triggers/walking_ways_triggers.txt` | All path eligibility triggers; `is_on_walking_way`; `has_completed_walking_way` |
| `mod/common/decisions/walking_ways_decisions.txt` | `choose_walking_way`, `abandon_walking_way`, `invoke_psijic_rewind`, `appoint_path_mentor` |
| `mod/common/traits/walking_ways_traits.txt` | `walking_ways_seeker`, all 11 apex traits (see §12) |
| `mod/common/court_positions/walking_ways_positions.txt` | `walking_ways_mentor` court position |

#### Modifiers — Revised Count

Append ~20 new modifiers to `lore_races_modifiers.txt` (up from the ~15 in §13):
- 9 `ww_path_[name]_active` modifiers (one per path, while pursuing)
- 4 `ww_rank_[1-4]_aura` shared rank-based aura modifiers
- 1 `ww_momentum_[shared]` base momentum modifier (path-specific versions derived via scripted effect arguments)
- 1 `enantiomorph_chaos` (applied to target of Dragon Break ability)
- 1 `mantle_rival_tension` (applied during competing mantler rivalry)
- 1 `rival_mantler_opinion` (opinion modifier for competing mantlers)
- 1 `witnessed_rebel_recede` (Witness opinion on Enantiomorph abandonment)
- 1 `enantiomorph_echo` (failed mantler's minor negative trait modifier)
- 1 `mentor_of_the_way` (Path Mentor court position holder)
- 1 `amaranth_dreaming` (post-Amaranth)

#### Localization Files (unchanged from §11 + court position file)

| File | Keys |
|---|---|
| `mod/localization/english/walking_ways_l_english.yml` | Core keys + awareness + selection + abandonment + world notify + rivalry |
| `mod/localization/english/mantling_l_english.yml` | All 5 mantle paths |
| `mod/localization/english/psijic_endeavour_l_english.yml` | Path C |
| `mod/localization/english/enantiomorph_l_english.yml` | Path D + Witness |
| `mod/localization/english/amaranth_l_english.yml` | Path E |
| `mod/localization/english/walking_ways_positions_l_english.yml` | Path Mentor court position |

**All `.yml` files MUST start with UTF-8 BOM.** Use `printf '\xef\xbb\xbf' | cat - file > tmp && mv tmp file`.

---

### 16.15 The "chim.003 Death" Compatibility Check

The existing `chim.003` (Enantiomorph Consumes) causes character death via
`death_reason = death_chim_erasure`. The Walking Ways design in §7 Path D also
uses the term "Enantiomorph Consumes" for Path D's failure state.

These are **two different things** and must not be confused:
- `chim.003` = the failure state of *pursuing CHIM* (trying to achieve CHIM and failing)
  — character death by erasure. Not changed.
- `enantiomorph_consumed` in Path D = a debilitating *trait* acquired by someone who
  *chose* the Enantiomorph path and failed at the 75% threshold
  — character survives but is spiritually broken.

**Rename `enantiomorph_consumed` to `void_consumed`** in Path D's failure state to
avoid confusion with the existing lore concept from `chim.003`. The `void_consumed`
trait represents being absorbed by the role of the Rebel without achieving the
transcendence of the Enantiomorph Ascendant — you became the void but couldn't hold it.

---

*End of revision notes — session 2026-04-05.*

*These notes supersede §§1–15 where there is a direct conflict. The core design in §§1–15 remains the primary reference; this section adds precision and identifies implementation hazards.*

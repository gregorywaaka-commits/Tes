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
     - B-Jyggalag: Jyggalag's Champion (§20.2)
     - B-Sheogorath-Echo: Sheogorath's Echo (§20.3)
   - [Path C: The Psijic Endeavour](#path-c-the-psijic-endeavour)
   - [Path D: The Enantiomorph](#path-d-the-enantiomorph-dark-path)
   - [Path E: The Amaranth](#path-e-the-amaranth-hidden--endgame)
   - [Path F: Kagrenac's Ambition (§19)](#19-path-f--kagrenacs-ambition-the-borrowed-divinity)
   - [Path G: Tonal Architecture (§25)](#25-path-g--tonal-architecture-the-wrong-walking-way)
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

##### Concurrent Aspect-Holder Death: Sole Heir Mechanic

> *DESIGN NOTE — Lore basis: The Arcturian Heresy*
>
> Talos was not a single man. He was Hjalti Early-Beard (the tactician), Ysmir Wulfharth
> (the fire), and Zurin Arctus (the clever man). Each contributed a soul-fragment to the
> composite Oversoul. When Wulfharth was consumed by Numidium and Arctus's soul was crushed
> into the Mantella, those fragments did not vanish — they fed the surviving vessel.
> Tiber Septim became Talos **because he was the last aspect-holder standing**.
> This mechanic is therefore not a gameplay convenience; it is the lore outcome.

When multiple characters are concurrently walking the Talos path and one dies mid-path:

**Fragment Absorption (2+ survivors):**
- All surviving active walkers receive the `mantling_talos.aspect_dies_notify` event
- Each survivor gains `ww_aspect_fragment_absorbed` modifier (Martial +2, prestige/month +2, dread +10%) for 15 years
- One free bonus milestone is granted (the absorbed fragment counts as pattern recognition)
- Flavor distinguishes a peer dying vs. a rival being killed

**Sole Heir (last walker remaining):**
- If only one active walker survives, `mantling_talos.sole_heir_ascendant` fires
- Grants `talos_sole_heir` modifier (Martial +4, Learning +2, prestige +4/month, stress gain −25%) for the remainder of the path
- Two bonus milestones are granted (one for each absorbed peer, capped at 6 total)
- The path's rank can now advance to 4 even if milestones would otherwise fall short
- The Sole Heir still must reach Rank 4 through active play — the mantle is never automatic

**Global Tracking:**
- `active_talos_aspects_count` (global var) is incremented by `begin_path_mantling_talos` and decremented on death or abandonment
- The death hook fires `aspect_dies_notify` to all living concurrent walkers before firing the existing `path_broken` world event

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
| `mod/events/mantling_daedric_events.txt` | `mantling_daedric` | 22 events | Covers Azura + Meridia + Boethiah + Mephala + Hircine; shared failure mechanic |
| `mod/events/mantling_lorkhan_events.txt` | `mantling_lorkhan` | 7 events | Path-specific milestones + apotheosis |
| `mod/events/mantling_stendarr_events.txt` | `mantling_stendarr` | 7 events | Path-specific milestones + apotheosis |
| `mod/events/psijic_endeavour_events.txt` | `psijic_endeavour` | 10 events | Meditation events + rewind mechanic setup |
| `mod/events/enantiomorph_events.txt` | `enantiomorph` | 8 events | Dark path milestones + Dragon Break trigger |
| `mod/events/amaranth_events.txt` | `amaranth` | 5 events | Short path; final apotheosis + world event |

### Trait Files

| File | Traits Defined |
|---|---|
| `mod/common/traits/walking_ways_traits.txt` | `walking_ways_seeker`, all path-progress traits |
| `mod/common/traits/mantling_traits.txt` | All 12 mantle apex traits |
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
| `mantle_lorkhan` | fame | Lorkhan/Shor mantle apex | Path B |
| `mantle_stendarr` | fame | Stendarr mantle apex | Path B |
| `mantle_boethiah` | fame | Boethiah mantle apex (Daedric) | Path B |
| `mantle_mephala` | fame | Mephala mantle apex (Daedric) | Path B |
| `mantle_hircine` | fame | Hircine mantle apex (Daedric) | Path B |
| `jyggalag_ascendant` | fame | Jyggalag's Champion apex (Order embodied) | Path B (B-Jyggalag) |
| `madness_prophet` | fame | Sheogorath's Echo apex (madness as insight) | Path B (B-Sheogorath-Echo) |
| `psijic_adept_supreme` | fame | Psijic Endeavour apex | Path C |
| `enantiomorph_ascendant` | fame | Enantiomorph apex | Path D |
| `enantiomorph_consumed` | lifestyle | Enantiomorph failure state | Path D |
| `amaranth_achieved` | fame (hidden) | Amaranth endgame | Path E |
| `tonal_transcendent` | fame | Tonal Architecture apex (Dwemer transcendence) | Path G |

**Total new traits:** 14

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

---

## 17. EK2 Timeline Windows, Date Guards, and Lore Accuracy per Path

> **Added:** Session 2026-04-05 (second pass) — the previous section (§16) established
> which paths *need* EK2 as a dependency. This section goes further: for each path,
> it specifies the **lore-accurate date windows** when the path is available, how to
> implement those windows using `current_date` and `game_start_date` guards matching
> the patterns already established in this mod, and where lore conflicts need explicit
> design decisions.

**Pattern reference:** This mod uses two date guard patterns (taken from verified
working event files):

```
# Pattern A — current_date (fires at a specific moment in game-time)
trigger = {
    current_date >= 2.580.1.1      # Artaeum returns
    current_date < 2.582.1.1
}

# Pattern B — game_start_date (constrains to a scenario start window)
trigger = {
    game_start_date >= 2.440.1.1   # EK2 default start
    game_start_date <= 2.896.1.1   # Interregnum ends
}
```

For the Walking Ways system, **Pattern B is preferred** for path availability guards —
the game-start constrains which scenario the path makes historical sense in, while
`current_date` guards handle specific one-time triggers (e.g., "the Psijic Endeavour
gates closed in 2E 230").

---

### 17.1 Path A — CHIM Expanded: Date Window and Lore Notes

**Lore-accurate window:** CHIM as a concept is not time-bound — the Walking Ways are
metaphysical, not historical. No date guard is required for availability. However,
lore accuracy requires the following note in the event file header:

> *CHIM is described in Mankar Camoran's Paradise text (Commentaries on the Mysterium
> Xarxes) — a Third Era document — and in Michael Kirkbride's supplementary texts.
> In the Second Era Interregnum (EK2's timeframe), CHIM is not a widely known concept;
> it is pursued by isolated scholars, mystics, and those who have made contact with
> the Psijic Order. The trigger `learning >= 18 + stress >= 50` correctly models this
> rarity. [SOFT CANON — the concept exists; the Second Era scarcity is inferred.]*

**Trigger note for implementation:**

The existing `chim.000` trigger fires for any ruler with `learning >= 18` and
`stress >= 50`. This correctly models rarity without needing a date gate. The
Walking Ways extension should inherit this gating — Path A (`chim_expanded`) should
require `has_trait = chim_achieved`, which already requires `learning >= 20`. No
additional date guard needed.

**Lore accuracy flag:** The event text should use the unreliable-narrator framing
required for `[MK SUPPLEMENTARY]` concepts (already noted in §14). The phrase
*"the secret syllable of royalty"* is canon (Commentaries on the Mysterium Xarxes,
in-game book, Third Era). The *mechanism* of how one achieves it is `[MK SUPPLEMENTARY]`.

---

### 17.2 Path B — Mantling: Date Windows per Divine Target

Each Mantling path has specific lore tensions with the EK2 Second Era timeframe.

#### 17.2a Mantling Talos

**Lore problem:** Tiber Septim (who mantled Lorkhan to become Talos) lived in the
*Third Era* — specifically 2E 830s to 3E 38. He did not complete his mantling until
he used Numidium at 2E 896 (by most accounts). In the EK2 timeframe (2E 440–896):

- **2E 440 to ~2E 820**: Talos does not yet exist as a deity. The mantling path
  cannot represent "becoming Talos" — instead, it should represent *becoming the
  Shezarrine archetype* that Tiber Septim would later embody.
- **2E 854 to 2E 896**: Tiber Septim is alive and consolidating power. A rival
  "mantler" during this period directly conflicts with canonical history.
- **Post-2E 896 (Third Era)**: Talos is a recognised god; mantling is now properly
  "following Tiber's footsteps."

**Revised lore framing for the event text:**

The path should NOT be titled "Mantling Talos" in the event display text during
the Second Era. Use the internal key `mantling_talos` but display:
- Pre-2E 830: *"The Shezarrine Way — the pattern of the Warrior Who Walks"*
- Post-2E 830: *"The Footsteps of the Mountain — the way of the unifier"*

This is handled with a `trigger = { current_date < 2.830.1.1 }` check on the event's
`desc` block using a dual-desc approach:

```
desc = {
    first_valid = {
        triggered_desc = {
            trigger = { current_date < 2.830.1.1 }
            desc = mantling_talos.intro.pre_tiber
        }
        desc = mantling_talos.intro.post_tiber
    }
}
```

**Availability guard — hard block:**
```
# Block the path from firing while Tiber Septim lives (2E 854 – 3E 38)
# to avoid the lore contradiction of a competing mantler during his reign
is_valid = {
    NOT = {
        AND = {
            current_date >= 2.854.1.1
            current_date < 3.38.1.1
        }
    }
}
```

---

### 17.2a-i Wulf — Avatar of Talos: Design Notes Across Timeline Scenarios

#### Canonical Lore Basis (Online-Verified)

Wulf is the avatar of Tiber Septim (Talos) who appears in the Tower of Dusk at
Ghostgate in TES III: Morrowind. He manifests as an aged Imperial legionnaire and
offers the player character ("the Nerevarine") an *Old Man's Lucky Coin*, which
grants the greater power "Luck of the Emperor." He is invisible to everyone else
at Ghostgate. Lalatia Varian, Oracle of the Imperial Chapels at Ebonheart, later
confirms the encounter was a divine visitation — the face of Tiber Septim walking
among the living.

Key canon conditions for the encounter:
- The Nerevarine has received Wraithguard from Vivec (fully committed to the path).
- Dagoth Ur has awakened and the crisis is active (i.e., the confrontation is imminent).
- After the confrontation window closes, Wulf disappears permanently.

His name is lore-significant: Wulf evokes *Ysmir Wulfharth*, one of the three
mortals whose souls Tiber Septim absorbed to form his divine Oversoul. The avatar
therefore embodies the *composite nature* of Talos — not solely Tiber Septim.

[SOURCE: Morrowind:Wulf (UESP); Morrowind:A Lucky Coin (UESP); Lalatia Varian
dialogue; UESP Lore:Wulfharth; UESP Lore:Talos composite Oversoul]

---

#### Scenario A — Pre-Dagoth Awakening (EK2 base window: 2E 440–882)

**Problem:** The current `wulf_encounter` trigger requires `dagoth_ur_awakened`.
In the EK2 base timeline (start ~2E 440–582), a player could be walking the
Talos/Shezarrine path decades or centuries before Dagoth Ur is awakened at 2E 882.
Under the current code, Wulf can never appear during this long window.

**Design intent:** Wulf represents Talos's divine will reaching back to mark the
mortal who carries the Shezarrine pattern. Because Talos exists *across time* (the
divine is not constrained by linear chronology — the 36 Lessons of Vivec describe
the gods acting on mortal history before and after their worship begins), a Talos
mantler in 2E 500 would still attract the avatar's attention.

**Proposed pre-awakening trigger condition for a "harbinger" Wulf encounter:**

```
# Wulf as Harbinger — fires BEFORE Dagoth Ur awakens
# Replaces wulf_encounter when dagoth_ur_awakened is NOT set
trigger = {
    has_character_flag = ww_mantling_talos_active
    NOT = { has_global_flag = dagoth_ur_awakened }
    NOT = { has_character_flag = wulf_visited }
    NOT = { has_character_flag = wulf_encounter_seen }
    var:ww_talos_rank >= 3          # Must be at milestone 3 — the path is serious
    OR = {
        martial >= 16               # High martial mastery
        has_character_flag = ww_mantling_talos_milestone_shezarrine
    }
}
```

**Narrative flavour distinction:** The pre-awakening Wulf encounter should feel
*prophetic* rather than confirmatory. He does not grant "Luck of the Emperor" with
the same certainty — instead his coin carries a *warning* that the work ahead will
determine whether the god exists at all. Event text should reflect:
> *"The old soldier presses the coin into your palm without a word. You have not
> yet faced the test that will make or unmake your legend — but he looks at you as
> though the outcome is already decided."*

The `wulf_blessed` trait and `luck_of_the_emperor` modifier are still granted, but
the Lalatia oracle follow-up (`mantling_talos.lalatia_oracle`) should only fire if
the date is post-2E 854 (when the Imperial Cult has an Ebonheart presence in
Vvardenfell) OR if an alternative oracle stand-in is available.

**Mechanical gate:** Add global flag `wulf_harbinger_seen` so the harbinger
variant and the canonical variant are mutually exclusive (a mantler who saw the
harbinger Wulf still has `wulf_encounter_seen` set and will not see him again
during the Dagoth crisis window unless specifically designed for that).

---

#### Scenario B — Canonical Nerevarine Dead; Successor Holds the Prophecy

**Problem:** The Nerevarine system (§20) implements `nerevarine_shadow` and a
succession hook via `on_character_death`. If the canonical Nerevarine dies before
defeating Dagoth Ur, the `nerevarine_shadow` trait passes to a successor. The
current `wulf_encounter` checks `has_trait = nerevarine_marked` but does not
explicitly handle the `nerevarine_shadow` successor case.

**Design intent:** Wulf's avatar allegiance is to *whoever currently carries the
prophetic burden*, not to the specific original individual. The prophecy of the
Nerevarine is about a pattern — not a person. A successor bearing `nerevarine_shadow`
is, metaphysically, the continuation of the same pattern.

**Proposed adjustment to the Wulf trigger:**

```
trigger = {
    OR = {
        has_character_flag = ww_mantling_talos_active
        has_trait = nerevarine_marked       # Canon Nerevarine
        has_trait = nerevarine_shadow       # Successor who holds the mantle
    }
    OR = {
        has_global_flag = dagoth_ur_awakened    # Crisis is active (canon or early)
        AND = {                                  # Pre-awakening harbinger path
            NOT = { has_global_flag = dagoth_ur_awakened }
            var:ww_talos_rank >= 3
        }
    }
    NOT = { has_character_flag = wulf_visited }
    NOT = { has_character_flag = wulf_encounter_seen }
    NOT = { has_global_flag = dagoth_ur_defeated }
}
```

**Important:** The `nerevarine_shadow` trigger should carry an additional flavour
check. If the original Nerevarine died by `nerevarine_forsaken` (betrayed the
prophecy), Wulf's flavour text for the successor should reflect the extra weight of
carrying a broken lineage:
> *"The old man's eye lingers on you longer than it should. He presses the coin
> into your hand, but his gaze holds no warmth — only the cold arithmetic of what
> must be done, since the first was found wanting."*

---

#### Scenario C — Dagoth Ur Awakened Earlier Than Canon (Divergent Timeline)

**Problem:** In a divergent playthrough, a player could fulfil the in-game
conditions for `dagoth_ur_awakened` before 2E 882 (the canonical date). For
example: Kagrenac's Tools research accelerated via the `borrowed_divinity` system
(§19), or a player-triggered event that stirs Dagoth prematurely. If `dagoth_ur_awakened`
fires at, say, 2E 650, and a Talos mantler exists, the current `wulf_encounter`
would fire — but the Lalatia oracle follow-up assumes the 3E context.

**Design intent:** The encounter itself is fully valid in this scenario. Wulf
appears whenever the Dagoth crisis is active AND a Talos mantler (or Nerevarine
bearer) exists, regardless of the calendar date. The divine does not operate on
the Merethic calendar.

**Required guard for the Lalatia oracle follow-up only:**

```
# mantling_talos.lalatia_oracle
# Only fire if the Imperial Cult's Ebonheart chapter is plausibly present.
# Before 2E 854 the Imperial presence in Morrowind is minimal.
trigger = {
    OR = {
        current_date >= 2.854.1.1        # Imperial Cult established in Vvardenfell
        # Fallback: player holds a county in Morrowind with sufficient Imperial
        # culture presence (EK2 culture flag)
        any_held_county = {
            culture = { has_cultural_tradition = tradition_imperial_cult }
        }
    }
}
```

If the Lalatia oracle cannot fire (pre-854, no Imperial presence), the confirmation
of Wulf's identity is instead provided by an alternative diviner — a Psijic monk
(if the player has `artaeum_correspondence` flag from the Psijic path) or by Vivec
himself (if `vivec_patron` flag is set from the Nerevarine arc).

---

#### Summary — Wulf Trigger Logic (All Scenarios)

| Scenario | Global flags / traits required | Wulf variant | Notes |
|---|---|---|---|
| Pre-Dagoth awakening, Talos mantler | `ww_mantling_talos_active`, `ww_talos_rank >= 3`, NOT `dagoth_ur_awakened` | Harbinger Wulf | Prophetic tone; no Lalatia follow-up pre-854 |
| Canon/late: Dagoth awake, first mantler | `dagoth_ur_awakened`, `ww_mantling_talos_active` OR `nerevarine_marked`, `talos_broken_count < 1` | `wulf_encounter` (existing) | Canonical path; Lalatia fires if post-854 |
| Canon: Dagoth awake, successor mantler | `dagoth_ur_awakened`, `talos_broken_count >= 1` | `wulf_encounter_successor` (existing) | Throne may be occupied — see Sole Heir notes |
| Nerevarine dead, `nerevarine_shadow` successor | `dagoth_ur_awakened`, `nerevarine_shadow` | Extended `wulf_encounter` (add `nerevarine_shadow` to OR block) | Heavier flavour text; "broken lineage" variant |
| Early Dagoth awakening (divergent) | `dagoth_ur_awakened` (any date), mantler or Nerevarine bearer | `wulf_encounter` (no date guard needed) | Lalatia oracle gated by culture/date check |

**Shared invariant across ALL scenarios:**
- `NOT = { has_character_flag = wulf_visited }` — Wulf only ever appears once per character.
- `NOT = { has_global_flag = dagoth_ur_defeated }` — Once the Heart severs from Mundus, the crisis is over and Wulf has no more reason to walk among the living.

---

#### 17.2b Mantling Arkay

**Lore accuracy:** Arkay is an Aedra who governs birth, death, and the cycle of
souls. In the Second Era, his priesthood is active across Tamriel. The mantling
represents becoming so attuned to the death cycle that one *is* the cycle.

**No date conflict.** Arkay's priesthood and relevance span all eras. No availability
date guard needed. However:

- The milestone requiring "witness a great death toll" should check:
  - Wars: `is_at_war = yes`
  - Plague: `any_held_county = { has_province_modifier = plague_modifier }`
- The lore note in the event file should reference **Lamae Beolfag** as the canonical
  example of Arkay's power in the Second Era — Molag Bal created vampirism specifically
  by defiling an Arkay priestess (`[CANON — Opusculus Lamae Bal]`).

**EK2-specific note:** In EK2 the Hall of the Dead mechanic (if implemented) may
interact with the Arkay mantle. The event file header should note:
> *"If EK2 includes an Arkay piety track or Hall of the Dead system, check for
> trait overlap with any 'arkay_devotee' or 'death_priest' traits EK2 defines.
> Do not redefine traits EK2 already provides — check EK2's traits folder first."*

#### 17.2c Mantling Kynareth

**Lore accuracy:** Kynareth is the Aedra of sky, wind, and nature. She is
canonically the first of the Eight Divines to agree to Lorkhan's plan for Mundus
(`[CANON — The Monomyth, in-game book]`). She gave mortals the gift of breath.

**EK2 date consideration:** The Thu'um (Word Wall) system fires across the full
Interregnum (2E 440–896). The Kynareth mantle's Milestone 1 (*"The Word on the Wind"*)
is most cleanly triggered by the player having `has_trait = thu_um_initiate` — which
already exists in this mod and is available throughout EK2's window.

**Fallback for non-EK2 runs:**
```
# Milestone 1 trigger (one of these must be true):
OR = {
    has_trait = thu_um_initiate    # EK2 Voice path (preferred)
    has_character_flag = kynareth_wind_pilgrimage_done  # standalone fallback
    AND = {
        has_trait = scholar
        has_trait = lifestyle_traveler  # or equivalent wanderer trait
    }
}
```

The standalone fallback flag (`kynareth_wind_pilgrimage_done`) is set by a simple
decision that fires for rulers in wind-exposed regions — ideally a county in the
Jerall Mountains, Throat of the World, or coastal Summerset.

#### 17.2d Mantling Azura

**Lore accuracy:** Azura is a Daedric Prince — the mantling here is Daedric, not
Aedric. The distinction matters for piety calculations. Azura canonically maintains
close relationships with the Dunmer (Chimer origin story; the Nerevarine Prophecy
is Azura's own design). `[CANON — Lessons of Vivec; The Anticipations]`.

**EK2 date notes:**
- The Nerevarine Prophecy is active from approximately 2E 700 onward (after Nerevar's
  death at Red Mountain in 1E 700 and the establishment of the Tribunal — which
  Azura condemned). The Azura mantle's flavor should reference the *Star of Azura*
  artifact, which is in use throughout the Second Era.
- Dunmer culture restriction on the Azura mantle should use the same culture guard
  pattern as other events in this mod: `has_culture = dunmer_culture` (as used in
  `alliance_war_events.txt` and `alessian_events.txt`).

**Lore accuracy for the "Possession Risk":** The 25% possession-at-finale mechanic
(§7, Daedric mantles) is well-modeled on the Chimer/Dunmer relationship with Azura —
she demands total devotion and punishes those who stray (`[CANON — events of Morrowind
main questline; Azura's response to the Tribunal]`). Flag the lore source explicitly
in the event text to justify the mechanic.

#### 17.2e Mantling Meridia

**Lore accuracy:** Meridia is a Daedric Prince of life energy — she was herself once
an Aedra (a magna-ge or "Star-made Knight") before being cast out by Auri-El for
consorting with Namira's essence (`[SOFT CANON — Myths of Sheogorath; The House of
Troubles connection is inferred]`). Her hatred of undead is absolute and documented.

**EK2 date note:** The Dawnguard system (this mod's `dawnguard_events.txt`) is
canonically set in the Late Third Era. Using `dawnguard_commander` as a prerequisite
for the Meridia mantle creates a lore-date conflict: the Dawnguard as an institution
does not exist in the Second Era.

**Revised prerequisite for the Meridia mantle** (Second Era compatible):
```
OR = {
    has_trait = dawnguard_commander         # Third Era+ only
    AND = {
        has_trait = zealous
        piety >= 500
        has_character_modifier = vigilant_stendarr_ally  # Second Era undead hunter
    }
    AND = {
        has_trait = chaste
        has_trait = brave
        NOT = { has_trait = undead }          # Meridia does not mantle the undead
    }
}
```

The second and third options are valid across the full EK2 timeframe. The event
header should note: *"dawnguard_commander is only available in Third Era starts;
the vigilant_stendarr_ally and zealous+piety paths are the canonical EK2-era routes."*

---

### 17.3 Path C — Psijic Endeavour: Date Windows and Artaeum Constraints

**This path has a critical date conflict that the current design ignores.**

**Lore facts:**
- Artaeum withdraws from the mundane world at **2E 230** (`[CANON — UESP Lore:Psijic Order]`)
- Artaeum reappears at **2E 580** (`[CANON — same source]`)
- EK2's default start is **2E 440** — well within the withdrawal period

**Consequence:** During 2E 230–580 (which includes all of EK2's primary window from
2E 440 to ~2E 580), Artaeum is **not accessible**. The Psijic Order exists but cannot
be formally contacted through Artaeum. Individual Psijic practitioners still operate
in the world — this is the lore basis for `psijic_counsel.txt` (itinerant Psijic
scholars) — but there is no "invitation to Artaeum."

**Required date guard for the Psijic Endeavour path availability:**

```
OR = {
    # Artaeum is accessible before 2E 230
    current_date < 2.230.1.1
    # Artaeum has returned (after 2E 580)
    current_date >= 2.580.1.1
}
```

**What this means for EK2 starts (2E 440+):**

During 2E 440–580, the Psijic Endeavour path is **unavailable via the Artaeum route**.
Instead, the sole access during this window is through **itinerant Psijic practitioners**
(the `psijic_counsel.txt` emissary system). The path intro event (`psijic_endeavour.000`)
should have two versions:

| Condition | Event Version |
|---|---|
| `current_date < 2.230.1.1` OR `>= 2.580.1.1` | Full Artaeum version — the island is accessible; the ruler travels there |
| `2.230.1.1 <= current_date < 2.580.1.1` | Wandering Scholar version — an itinerant Psijic practitioner guides the ruler through the Old Ways in secret, outside Artaeum's formal structure |

The **Wandering Scholar version** of the milestones should feel more precarious:
- The mentor has no authority — they are acting outside the Order's withdrawn structure
- Two of the six milestones have a `random = { chance = 20 ... trigger_event = psijic_endeavour.mentor_lost }` risk
  — the itinerant scholar may disappear mid-path (Artaeum calls them back, or they die, or simply vanish)
- If the mentor is lost, the ruler must decide: continue alone (+stress, harder milestone thresholds)
  or abandon the path

**Lore accuracy note for this mechanic:**

> *The Psijic Order withdrew Artaeum in 2E 230 due to what they called "the
> Complicated Reaction" — a political and metaphysical position on the Soulburst
> buildup and Interregnum chaos that the Order had foreseen.  Individual Psijics
> who were off-island at the moment of withdrawal were stranded in the mundane world.
> Some chose to stay and teach.  Others simply continued their work alone, without
> the isle's resources, for 350 years.  [CANON — UESP Lore:Psijic Order; the
> off-island practitioners are attested in Morrowind and Skyrim sources.]*

**Lore accuracy note — not adding wrong canon:** The description above uses the
term "Complicated Reaction" for the withdrawal reason — this is `[EXTRAPOLATED]`.
The actual canonical reason for the 2E 230 withdrawal is unstated in primary sources.
The event prose should acknowledge this: *"The Order withdrew without explanation —
the reason was their own. They always are."*

---

### 17.4 Path D — Enantiomorph: Lore Accuracy Notes

**No date conflict** — the Enantiomorph is a metaphysical pattern that operates
outside normal time (the 36 Lessons of Vivec describe it as eternal and recurring).
No date guard needed.

**Lore accuracy — the "three body" requirement:**

The 36 Lessons specify: *Hero, Rebel, Witness.* The Lessons are `[SOFT CANON — in-game
text but written in a deliberately ambiguous, unreliable-narrator style]`.

Event prose should reflect this ambiguity. The ruler pursuing the Enantiomorph path
**believes** they are enacting the cosmic pattern — but the text should never confirm
this. The Witness character should sometimes wonder if they are simply watching
a ruler descend into madness:

> *[The Witness, in the aftermath:] "They called me the Witness. I watched them
> become something. I still do not know what. Neither did they, I think."*

**Lore accuracy — Nerevar as the canonical Rebel/Hero pair:**

The most famous Enantiomorph in TES lore is Nerevar (Hero) and Dagoth Ur (Rebel),
with Azura as the Witness at Red Mountain (`[SOFT CANON — 36 Lessons; Forum of Man
texts]`). The system should acknowledge this in the path intro:

> *"The scholars speak of a pair: a warrior and a shadow, each needing the other
> to be real. At Red Mountain, something of this kind happened. Whether it can
> happen again, and whether you are the one to enact it, is the question the Old
> Ways asks of you."*

This acknowledgment keeps the lore grounded without claiming the player character
IS Nerevar (they are not — they are attempting to enact the same *pattern*).

**Lore accuracy — Talos Enantiomorph:**

A second famous Enantiomorph: Tiber Septim (Hero) and Zurin Arctus / Wulfharth
(Rebel/Underking), with Zurin's soul serving as witness-sacrifice (`[SOFT CANON —
Song of Pelinal; Arcturian Heresy; contested sources]`). Since Tiber Septim lives
in the late 2E/early 3E period overlapping with EK2, the event prose should not
reference him directly during 2E 854–3E 38 (when he lives). Use a conditional:

```
desc = {
    first_valid = {
        triggered_desc = {
            trigger = {
                NOT = {
                    AND = {
                        current_date >= 2.854.1.1
                        current_date < 3.38.1.1
                    }
                }
            }
            desc = enantiomorph.intro.standard  # mentions Tiber pattern abstractly
        }
        desc = enantiomorph.intro.tiber_era  # omits the Tiber reference
    }
}
```

---

### 17.5 Path E — The Amaranth: Lore Accuracy and Timeline Notes

**Lore accuracy — the Amaranth is the most speculative of all paths.**

Sources: Primarily Michael Kirkbride's *"C0DA"* (`[MK SUPPLEMENTARY — not in-game
canon but very commonly accepted]`) and a scattering of forum posts that discuss
the Amaranth as the *next stage after CHIM* — dreaming a new universe from within
the current one's ending.

**Required canon tier statement in the event header:**

```
#  LORE CANON TIER: [MK SUPPLEMENTARY + EXTRAPOLATED]
#  The Amaranth is described in Michael Kirkbride's C0DA (not an
#  in-game text).  The concept of "dreaming a new Aurbis" is
#  entirely MK supplementary.  Per the design rules in
#  WALKING_WAYS_DESIGN.md §14, all Amaranth event prose must use
#  the unreliable narrator frame:
#    — Scholars debate whether this is even possible
#    — The ruler does not know if they have "succeeded"
#    — The world-notification event does not confirm success;
#      it only notes that something has changed that no one
#      can fully describe
```

**Date accuracy:** The Amaranth, if it is possible at all, is implied in C0DA to
occur at the END of Mundus — the last syllable of the current Kalpa. In the EK2
timeframe this is cosmologically impossible (we are in the middle of a Kalpa).

**Design decision required:** Two valid interpretations:

| Interpretation | Implementation |
|---|---|
| **Literal Amaranth** — impossible in-Kalpa | Block the path entirely unless a specific "End of Kalpa" condition is met (e.g., all Towers destroyed). Almost certainly never fires. |
| **Metaphorical Amaranth** — the ruler achieves a *personal* dreaming that is a pale echo of the true Amaranth, contained within their own consciousness | Allow the path; flavor text explicitly acknowledges this is personal/contained: *"You are not dreaming the next Aurbis.  You are dreaming the next you."* |

**Recommendation: the Metaphorical Amaranth.** It preserves lore accuracy (the
TRUE Amaranth is cosmologically impossible in-Kalpa), creates a meaningful gameplay
endpoint (a ruler who has achieved CHIM and then extended that understanding inward),
and avoids a "game-ending condition" problem.

The world-notification event for the Metaphorical Amaranth should be maximally
ambiguous:

> *"In [REALM], [CHARACTER] has closed their eyes and not opened them. Their court
> continues in their name. Their body remains. Advisors report that when they speak,
> they speak of things no living person can verify — or contradict."*

**EK2 compatibility note:** The Amaranth path's requirement of `has_trait = chim_achieved`
means it cannot fire for any ruler who has not completed the CHIM fast-path. Given
`learning >= 20` is required for CHIM, and given EK2's start date of 2E 440, the
path is naturally gated to exceptional late-game rulers. No additional date guard needed.

---

### 17.6 Timeline of Relevant Lore Events — Design Reference Table

This table consolidates all lore dates relevant to the Walking Ways system for
quick reference during implementation. All dates are verified against UESP or
in-game canonical sources (canon tier noted).

| Date | Event | Relevance to Walking Ways | Canon Tier |
|---|---|---|---|
| 1E 700 | Battle of Red Mountain — Nerevar slain; Tribunal formed | Enantiomorph pattern (Nerevar/Dagoth Ur) is established | CANON |
| c. 1E 1200–2208 | Middle Dawn Dragon Break | Dragon Break system reference; Amaranth lore adjacent | CANON |
| 1E 2703 | Reman I rises at Pale Pass | Shezarrine pattern; Mantling Talos pre-echo | CANON |
| 2E 0 | Akaviri Potentate kills last Alessian Emperor | Interregnum begins | CANON |
| **2E 230** | **Artaeum withdraws** | **Psijic Endeavour must split into two versions** | **CANON** |
| 2E 430 | Interregnum proper begins (Potentate assassinated) | EK2 warlord window opens | CANON |
| **2E 440** | **EK2 primary start date** | **All Walking Ways paths calibrated to this baseline** | N/A |
| 2E 578 | Soulburst — Dragonfires extinguished | Major world event; CHIM/Amaranth lore-adjacent | CANON |
| **2E 580** | **Artaeum returns** | **Psijic Endeavour Artaeum path reopens** | **CANON** |
| 2E 582 | ESO Alliance War period begins | EK2 late-game window | CANON |
| 2E 812 | Tiber Septim born (approx.) | Mantling Talos narrative shift point | SOFT CANON |
| **2E 830** | **Tiber Septim begins consolidation** | **Mantling Talos pre/post-Tiber framing shift** | **SOFT CANON** |
| **2E 854** | **Tiber Septim takes Ruby Throne** | **Mantling Talos hard block begins** | **CANON** |
| 2E 882 | Dagoth Ur seizes Heart of Lorkhan | Enantiomorph/Shezarrine flavor window | CANON |
| **2E 896** | **Numidium; formal Third Era begins; Tiber Septim completes his mantle** | **EK2 ends; Interregnum ends; Talos confirmed deity** | **CANON** |
| **3E 38** | **Tiber Septim dies** | **Mantling Talos hard block ends** | **CANON** |
| c. 3E 433 | Oblivion Crisis; Martin Septim's final sacrifice | Amaranth lore-adjacent (MK texts connect these) | SOFT CANON |

**Bold rows** indicate dates that require explicit `current_date` guards in implementation.

---

### 17.7 lore_races_on_actions.txt Registration — Walking Ways Hidden Events

**From the stored memory:** *"ALL new event systems must register their hidden trigger
events in `lore_races_on_actions.txt` `on_yearly_pulse` `random_events` block.
Events NOT registered there will never fire."*

The following Walking Ways hidden events must be registered:

| Event ID | Function | on_actions block | Weight |
|---|---|---|---|
| `walking_ways.000_check` | Yearly momentum timer tick; fires the reminder event if momentum has expired | `on_yearly_pulse` | weight = 100 |
| `walking_ways.mantle_rival_check` | Hidden check for competing mantlers across rulers | `on_yearly_pulse` | weight = 50 |
| `psijic_endeavour.mentor_check` | Checks if the itinerant Psijic mentor is still available | `on_yearly_pulse` | weight = 75 |
| `enantiomorph.witness_check` | Verifies the Witness character is still alive and at court | `on_yearly_pulse` | weight = 75 |
| `amaranth.threshold_check` | Very rare pulse that can push a CHIM-achieved ruler toward the Amaranth | `on_yearly_pulse` | weight = 5 |

**Format:** Register each in the `on_yearly_pulse = { random_events = { ... } }` block
in `lore_races_on_actions.txt`, using the same weight style as existing registrations.

---

### 17.8 CK3 Mechanic Notes — What the Previous Session Missed

These are specific CK3 scripting considerations not previously addressed.

#### 17.8a `first_valid` desc blocks

CK3 supports conditional event descriptions via `first_valid`:

```
desc = {
    first_valid = {
        triggered_desc = {
            trigger = { ... }
            desc = event_key.alt_desc
        }
        desc = event_key.default_desc
    }
}
```

This is the correct implementation pattern for the dual-desc approach described
in §17.2a and §17.4. It is used in vanilla CK3 and EK2 events. Use it for:
- Pre/post-Tiber Mantling Talos descriptions
- Artaeum-present vs Artaeum-withdrawn Psijic Endeavour descriptions
- Enantiomorph descriptions during Tiber's lifetime

#### 17.8b `portrait_modifier` and visual identity for apex trait holders

CK3 allows `portrait_modifier` entries on traits. The apex traits for the Walking
Ways should have subtle visual distinctions:

```
chim_ascendant = {
    category = lifestyle
    portrait_modifier = chim_ascendant_portrait   # must be defined in portrait_modifiers/
    ...
}
```

However, custom portrait modifiers require 3D asset work outside the scope of this
design. **Note in the implementation checklist:** portrait modifiers are optional;
add the `portrait_modifier` key to the trait but point it at a vanilla CK3 modifier
that is close (e.g., the `saint` or `mystic` portrait modifiers if EK2 defines them)
until custom assets are available.

#### 17.8c Scope safety — the Witness and Mentor as `scope:` references

CK3 `save_scope_as` creates a scope reference valid for the current event chain.
For the Witness and Mentor to be referenced across multiple events (milestones, not
just one event chain), their scope must be saved as a **character flag + variable**:

```
# When Witness is first designated:
set_character_flag = is_enantiomorph_witness    # on the Witness character
set_variable = {
    name  = enantiomorph_witness_id
    value = scope:enantiomorph_witness      # saves the character reference
}

# When retrieving the Witness in a later event:
# Use: character:enantiomorph_witness_id or
# scope:enantiomorph_witness (if still in scope)
# The flag on the Witness character (is_enantiomorph_witness) allows
# any_ruler or any_courtier searches to find them:
#   any_courtier_or_guest = {
#       limit = { has_character_flag = is_enantiomorph_witness }
#       save_scope_as = enantiomorph_witness
#   }
```

This pattern is used in EK2 (saving key NPCs as variable references) and should
be adopted here.

#### 17.8d Inheritance and Death — what happens to an in-progress Walking Way

CK3 character variables and flags are **cleared on death**. If a ruler on a Walking
Way path dies mid-progress:
- The `ww_[path]_rank` variable is cleared
- The `walking_ways_seeker` trait is lost (it's a trait, not a flag — but traits
  persist until removed; verify whether CK3 clears them on character death)

**Verdict:** Traits persist through death and are inherited by heirs only if
explicitly copied in inheritance code. Walking Ways traits should NOT be
inheritable (they are personal metaphysical achievements, not bloodlines).

Add to all Walking Ways traits in `walking_ways_traits.txt`:

```
ww_mantling_talos = {
    category   = lifestyle
    # Cannot be inherited — metaphysical path, not bloodline
    inherit    = no
    ...
}
```

**On death mid-path:** The successor does not inherit the path. The path is
abandoned on death (variables cleared anyway). This is lore-accurate — the Walking
Ways are personal, not dynastic.

**Exception:** The Amaranth trait (`amaranth_dreaming`) may have special logic if
the ruler enters a coma-like state. This is already noted in §16.15. If the ruler
"dreams permanently," consider the CK3 `is_imprisoned` or a custom `incapable`-style
modifier rather than character death — the flavor text already states *"Their body
remains."*

---

### 17.9 Lore Accuracy Checklist — Quick Reference for Writers

Use this checklist when writing event prose to ensure lore accuracy:

- [ ] **CHIM events:** Use unreliable narrator. Never state CHIM is definitely
  achievable. Source the *"secret syllable of royalty"* phrase to the
  *Commentaries on the Mysterium Xarxes* if you quote it.
- [ ] **Mantling Talos (pre-2E 830):** Call it the Shezarrine Way or Warrior's
  Pattern. Do NOT use the name "Talos" — he does not exist yet.
- [ ] **Mantling Talos (2E 854–3E 38):** Do not name Tiber Septim or his campaign.
  The path is blocked mechanically; make sure no flavor text leaks through.
- [ ] **Mantling Arkay:** Reference Arkay's role in the soul cycle, not just death.
  He governs both *birth and death* — the cycle, not just the end. Source:
  *The Monomyth* (in-game book, canon).
- [ ] **Mantling Kynareth:** Kynareth gave mortals the *gift of breath* — the Thu'um
  is literally Kynareth's gift expressed as sound. This connection is why the
  Thu'um serves as Milestone 1. Source: *The Monomyth* (canon).
- [ ] **Mantling Azura:** Use the term "Prince" not "Princess" per UESP usage
  for Daedric Lords regardless of gender presentation. Azura uses she/her in
  in-game text but her title is "Prince" (`[CANON — in-game books]`).
- [ ] **Mantling Meridia:** Do NOT refer to Meridia as a Daedric Prince in flavor
  text — she considers herself distinct from the Daedra (she was expelled from
  the Aetherius). Use "the Lady of Infinite Energies" or "the Meridian" — her
  own preferred framing (`[SOFT CANON — Meridia's Shrine text, Skyrim]`).
- [ ] **Psijic Endeavour (2E 230–580 window):** Artaeum is gone. Never show the
  island in event illustrations or prose during this period.
- [ ] **Enantiomorph:** Never confirm the Enantiomorph worked. The unreliable
  narrator is not the player character — it is the Witness. The Witness's
  perspective should be the primary prose voice for apotheosis events.
- [ ] **Amaranth:** Mark all prose `[MK SUPPLEMENTARY + EXTRAPOLATED]` in comments.
  The flavor text must use the Metaphorical Amaranth framing: personal, contained,
  unverifiable.
- [ ] **All events:** Check that no event prose contradicts the established dates
  in §17.6. If prose references a historical figure, verify they are alive
  at the current game date.

---

*End of session 2026-04-05 (second pass) notes.*

*§17 should be consulted alongside §16 before beginning any Walking Ways implementation work.*

---

## 18. Lore Audit — Missed Items and Corrections (Third Pass)

> **Added:** Session 2026-04-05 (third pass) — a comprehensive sweep of every
> event file and lore reference document looking for gaps, date errors, and
> lore-accuracy issues not yet addressed by §§16–17.

---

### 18.1 Ongoing Audit Findings

These items were identified during the sweep and are not yet addressed elsewhere in
this document. Some require changes to existing event files; others are design notes
for future writing.

---

#### 18.1a Ranser's War — Daggerfall Covenant founding date discrepancy

**File:** `mod/events/ranser_war_events.txt`, header comment line 25

**Current text:** *"the seed of the Daggerfall Covenant (formally established 2E 566)"*

**Problem:** This is internally contradictory within the same comment. Ranser's
War is `2E 566–567`. The Covenant is typically cited as formally established
**after** Ranser's defeat at Markwasten Moor — which is 2E 567, not 2E 566 (the
start of the war). UESP dates the Daggerfall Covenant's formal establishment to
**2E 566** as well, but specifically after Ranser attacked — meaning the Covenant
*coalesces* during the war as Emeric builds his coalition. This is a compressed
timeline.

**Verdict:** The current text is technically acceptable but misleading. The event
header comment should clarify: *"The Daggerfall Covenant began crystallising in
2E 566 as Emeric assembled allies against Ranser; it was formally ratified after
Ranser's defeat at Markwasten Moor later that year."*

**Action:** Note only — no code error. Clarify in a future header comment update.

---

#### 18.1b Mythic Dawn / Oblivion Crisis — date guard missing

**File:** `mod/events/mythic_dawn_events.txt`

**Problem:** The Mythic Dawn was active from approximately **2E 582 onward** (when
Mankar Camoran first began gathering followers) through the **Oblivion Crisis (3E 433)**.
The cult's founding date is not precisely canonical, but Mankar Camoran was alive
during the late Second Era.

**Key date issue:** The Oblivion Crisis fires in **3E 433** (the year of TES IV:
Oblivion). The current file doesn't appear to have a `current_date < 3.433.1.1`
guard on the cult flavor events — meaning they can fire *after* the Crisis is over,
which is lore-nonsensical (the Mythic Dawn was destroyed with Martin Septim's
sacrifice).

**Required guard on all Mythic Dawn flavor events:**
```
# Mythic Dawn is only active before the Oblivion Crisis ends
NOT = { current_date >= 3.434.1.1 }   # Oblivion Crisis ends 3E 433
```

**Note:** The game can reach 3E 433 in a long playthrough. This guard is not
currently implemented — it is a future implementation task.

---

#### 18.1c Numidium — Warp in the West date is 3E 417, NOT 2E 896

**File:** `mod/events/numidium_events.txt`, header, `numidium.010`

**Current header note:** *"numidium.010 — 'The Warp in the West' — CATASTROPHIC Dragon Break"*

**Lore clarification needed:**

There are **two Numidium activations** in canon — they are frequently confused:

| Activation | Date | Event | Source |
|---|---|---|---|
| **First activation** | **2E 896** | Tiber Septim uses Numidium to conquer Tamriel and unify the Empire. This is the Dragon Break that ends the Second Era and begins the Third. | `[CANON — UESP Lore:Numidium]` |
| **Second activation ("Warp in the West")** | **3E 417** | The Numidium is briefly reactivated during the events of TES II: Daggerfall; multiple factions each claim they used it; a Dragon Break resolves all outcomes simultaneously. | `[CANON — TES II: Daggerfall; UESP Lore:Warp in the West]` |

**The mod's `numidium.010` is captioned "The Warp in the West"** which is specifically
the 3E 417 event. The 2E 896 activation (Tiber Septim's use) is a separate, earlier
event that should have its own entry or be explicitly distinguished.

**Required additions to the numidium_events.txt header:**

```
#  IMPORTANT DATE DISTINCTION:
#  ──────────────────────────
#  Numidium was activated TWICE in canon:
#
#  1) 2E 896 — Tiber Septim uses it to complete the unification of Tamriel.
#     This Dragon Break ends the Second Era and starts the Third Era.
#     In EK2, this is the end-state event.  Fires at game_start_date approaching 2E 896.
#
#  2) 3E 417 — The Warp in the West (TES II: Daggerfall).
#     Multiple groups use it simultaneously; Dragon Break resolves all contradictions.
#     This is numidium.010.  Fires at current_date >= 3.417.1.1.
#
#  These must not be conflated.  numidium.010 is ONLY the 3E 417 Warp in the West.
#  The 2E 896 activation needs a separate event (numidium.005 or similar).
```

---

#### 18.1d Snow Elf — Knight-Paladin Gelebor is Third Era only

**File:** `mod/events/snow_elf_events.txt`, `snow_elf.003` (Knight-Paladin's Vigil)

**Lore problem:** Knight-Paladin Gelebor is first encountered in **TES V: Skyrim
(Fourth Era, 4E 201)**. He has been alone in Auri-El's Chapel since the other Snow
Elves took the Dwemer's offer and degenerated into Falmer — a process that occurred
in the **Merethic Era** or early First Era. But as a living NPC, Gelebor exists in
the Third/Fourth Era. His vigil has lasted *millennia*.

**The event text must note:** Any event referencing Gelebor by name or a living
"faithful Snow Elf keeper" is implicitly set in the Third or Fourth Era. In the
Second Era (EK2's primary window), Gelebor exists and maintains his vigil — he
simply has not been found yet. The event should not depict a meeting with him as
if he is a known figure; he should be portrayed as a rumour or legend in 2E:

> *"There are stories, older than anyone can verify, of a Snow Elf who refused
> the Dwemer's bargain — who remained himself while the others broke.
> The scholars say Auri-El's Chapel still stands somewhere in the Reach.
> Whether its keeper lives, whether he was ever real, is another matter."*

This framing works for all eras without contradicting canon.

---

#### 18.1e Thieves Guild — Daggerfall founding date vs. Second Era context

**File:** `mod/events/thieves_guild_events.txt`, header

**Current header note:** *"During the 2E Interregnum, the Guild operates without
a strict code: no killing on Guild jobs."*

**Lore clarification:** The "no killing" code (the *Oath* or *Code*) is central
to the Guild's identity in most eras. The Thieves Guild in the Second Era is
attested in ESO as an operational organisation with its own rules. The header's
implication that the Second Era Guild *lacks* its code is not supported by canon.

**Correct framing:** The Guild exists with its code in the Second Era. The "no
killing" rule is attested in ESO (*Larceny* questline). The header should say:
*"During the 2E Interregnum, the Guild enforces its code with difficulty — the
lack of stable Imperial law makes it harder to maintain discipline among members
who see the code as an optional courtesy rather than a contract."*

This preserves the existing modifier for a more chaotic Guild in the Interregnum
without contradicting the existence of the code.

---

#### 18.1f Forsworn / Hagraven lore — Second Era Reachmen context

**File:** `mod/events/forsworn_events.txt`, header (empty — only namespace declared)

**Missing context:** The Forsworn as a *named faction* are Third Era / Fourth Era
(TES V: Skyrim specifically). In the Second Era, the Reachmen are called the
**Witchmen of High Rock** or simply **Reachmen** — they are a distinct culture
(`[CANON — ESO]`). The Forsworn name does not exist in the Second Era.

**Required note in the event file header:**
```
#  LORE DATE NOTE:
#  ──────────────
#  In EK2's Second Era timeframe, these characters are "Reachmen" or
#  "Witchmen of High Rock" — NOT "Forsworn".
#  "Forsworn" is a Fourth Era term coined after the Markarth Incident
#  (4E 174–176) when Ulfric Stormcloak expelled the Reachmen from
#  Markarth.  [CANON — TES V: Skyrim; UESP Lore:Forsworn]
#  All flavor text and event display text should use "Reachmen" for
#  Second Era starts and "Forsworn" only for Fourth Era starts.
```

---

#### 18.1g Mages Guild founding — Artaeum withdrawal connection is canon

**File:** `lore/09_guilds_factions.md`, Mages Guild entry (line 11)

**Current text correctly notes:** Mages Guild founded c. 2E 230 by Vanus Galerion;
Artaeum disappears c. 2E 230 (when Galerion leaves to found the Guild).

**Gap:** The causal relationship is canon and important but not bolded as a lore-
accuracy trap. The departure of Galerion (a senior Psijic student) *caused* the
Artaeum withdrawal — the Order removed itself from the mundane world partly in
response to Galerion's choice to make magic accessible to all.

**This is a lore accuracy trap for Walking Ways §17.3 (Psijic Endeavour):** Any
event text for the Psijic Endeavour before 2E 230 should reference the tension
between the Psijic Order's secrecy and the founding of the Mages Guild. The moment
Galerion breaks from the Order and founds the Guild *is the moment Artaeum retreats*.

**Add to `lore/09_guilds_factions.md`** (Mages Guild section) the note:
> ⚠️ **The 2E 230 withdrawal of Artaeum and the founding of the Mages Guild are
> the same event from two perspectives.** Galerion's founding of the Guild was
> the final break that caused the Psijic Order to pull Artaeum back. Any mod
> event that references either event should acknowledge the other.
> `[CANON — UESP Lore:Psijic Order; Lore:Vanus Galerion]`

---

#### 18.1h Yokuda sinking — Orichalc Tower detail missing from towers file

**File:** `mod/events/yokuda_events.txt` line 7 **correctly** states:
*"Yokuda was… a continent west of Tamriel that sank beneath the sea c. 1E 792
(the Orichalc Tower fell…)"*

**But `lore/06_towers.md`** has **no entry** for the **Orichalc Tower** (Yokuda's
Tower).

**Required addition to `lore/06_towers.md`** — a table row and brief entry:

```
### 9. Orichalc Tower (Yokuda) [SOFT CANON — UESP]
> Source: UESP Lore:Towers — https://en.uesp.net/wiki/Lore:Tower
- Location: Yokuda (now sunken beneath the ocean west of Tamriel)
- Stone: Unknown / lost with Yokuda
- Builder: Unknown (pre-Ra Gada Yokudan civilisation)
- Status: DESTROYED — Yokuda sank c. 1E 792; the Orichalc Tower's fall
  is believed to be the proximate cause of the continent's sinking.
  [SOFT CANON — no in-game text directly confirms the Tower/sinking
  connection; it is inferred from the Tower framework]
- Mod county: None — submerged; not playable
- Notes: The Ra Gada who fled to Hammerfell carried Yokudan cultural
  memory but no Tower Stone equivalent. The Redguard absence of a
  Tower mechanic in the mod is lore-accurate.
```

**The `lore/06_towers.md` table of all Towers should have this row added** to
complete the inventory. Without it, a future writer might try to give Hammerfell
a Tower Stone mechanic, which would contradict the lore.

---

#### 18.1i Alessian Order — "founded 1E 358" vs. "Alessia's slave revolt 1E 243"

**File:** `lore/09_guilds_factions.md`, Alessian Order entry

**Current text:** "founded 1E 358"

**Lore clarification needed:** The Alessian Order proper (the theocratic/orthodox
reformist movement led by Marukh) is not the same as Alessia's original slave revolt
organisation. The timeline is:

| Date | Event | Source |
|---|---|---|
| 1E 243 | Alessia's slave revolt frees the Nedes from Ayleid rule | `[CANON — UESP]` |
| c. 1E 266 | Alessia dies; White-Gold Tower becomes centre of early Aedric worship | `[CANON — UESP]` |
| **1E 358** | **Marukh** receives his vision; the **Alessian Order** as a distinct theocratic movement is founded | `[CANON — UESP: Lore:Alessian Order]` |
| 1E 482 | Battle of Glenumbra Moors — Direnni defeat the Alessian Order in the west | `[CANON — UESP]` |
| 1E 2321–2331 | War of Righteousness destroys the Order | `[CANON — UESP]` |

The current entry is correct (1E 358 = Marukh's founding of the Order), but the
lore file should more clearly distinguish Alessia's revolt (1E 243) from the Order
that used her name (1E 358, 115 years after her death). A future writer might
conflate these.

**Add a clarifying note** to `lore/09_guilds_factions.md` Alessian Order section:
> ⚠️ **Alessia died c. 1E 266** — over 90 years before the Order bearing her name
> was founded. The Alessian Order was founded by the prophet Marukh *in her memory*,
> not by Alessia herself. Alessia's original movement was the slave revolt; the
> Order was a later theocratic reformist movement. `[CANON — UESP Lore:Alessia;
> Lore:Alessian Order]`

---

### 18.2 Lore File Updates Required

Based on the audit above, these lore files need small additions. These are **low
priority** (documentation corrections only) but should be done before v1.3:

| File | Addition Needed |
|---|---|
| `lore/06_towers.md` | Add Orichalc Tower entry (§18.1h) |
| `lore/09_guilds_factions.md` | Galerion/Artaeum causal note (§18.1g); Alessian/Alessia date clarification (§18.1i) |

Event file notes (headers only, no code change):

| File | Note to Add |
|---|---|
| `mod/events/forsworn_events.txt` | Forsworn vs. Reachmen Second Era naming note (§18.1f) |
| `mod/events/numidium_events.txt` | 2E 896 vs. 3E 417 two-activation distinction (§18.1c) |
| `mod/events/mythic_dawn_events.txt` | Post-3E 433 guard note (§18.1b) |

---

## 19. Path F — Kagrenac's Ambition (The Borrowed Divinity)

> **Revised** — Session 2026-04-05 (fourth pass)
>
> **Previous version** framed this as the "Sixth House Way / Dreamer's Communion" —
> a path tied specifically to Dagoth Ur's cult and his Dream. This revision broadens
> the lore foundation to the **underlying act** that both the Tribunal and Dagoth Ur
> performed: tapping the Heart of Lorkhan to steal divine power. Dagoth Ur's Dream
> is one *expression* of this act; the Tribunal's godhood is another. The path is
> now about the act, not the actor.

---

### 19.1 The Lore Foundation — Why Both the Tribunal and Dagoth Ur Are the Same Thing

This is the central insight the path is built on, and it must be stated clearly
because it is frequently missed by writers who treat the Tribunal as heroes and
Dagoth Ur as a villain:

**Both the Tribunal and Dagoth Ur achieved godhood by the identical act: contact
with the Heart of Lorkhan.**

The difference is *method*, not *nature*:

| Actor | Method | Result | Canon source |
|---|---|---|---|
| **Kagrenac** (Dwemer) | Designed Wraithguard + Keening + Sunder to extract power from the Heart; intended to use it to power the Numidium and elevate the Dwemer race | The entire Dwemer race vanished instantaneously at the Battle of Red Mountain (c. 1E 700) when the Tools were activated — widely believed to be the result of a catastrophic collective "transcendence" or destruction | `[CANON — TES III: Morrowind; UESP Lore:Kagrenac]` |
| **The Tribunal** (Vivec, Almalexia, Sotha Sil) | Stole Kagrenac's Tools after the Battle of Red Mountain; used them to tap the Heart repeatedly over millennia — *draining* divine power into themselves | Became gods — ALMSIVI — with divine power sustained only as long as they continued returning to the Heart to re-energise | `[CANON — TES III: Morrowind main quest; UESP Lore:Tribunal]` |
| **Dagoth Ur** (Voryn Dagoth) | Merged with the Heart directly after the Battle of Red Mountain, without the Tools; the connection was total rather than mediated | Became a different kind of divine being — not sustained by periodic draining but *fused* with the Heart's power, which gave him independence from the Tools but made him inseparable from Red Mountain | `[CANON — TES III: Morrowind; Dagoth Ur's dialogue]` |

**The key lore truth:** The Heart of Lorkhan is the Stone of the Red Tower — a
concentrated remnant of a divine being (Lorkhan/Shor/Sep/Shezarr) who chose
mortality and was destroyed for it. His Heart was cast into Nirn as punishment/
consequence. Mortals who tap into the Heart are **stealing the power of a slain god**
— the same fundamental act in all three cases above.

**Kagrenac's Tools** are the *safe* method — they mediate the contact so the
practitioner isn't simply annihilated or absorbed. Without them, contact with the
Heart is either catastrophic (Dwemer, Dagoth Ur's initial fusion) or it requires
unusual metaphysical conditions (Dagoth Ur's will was strong enough to survive the
merging).

> ⚠️ **Important lore note about Kagrenac's Tools:**
> The three Tools are: `[CANON — TES III: Morrowind; UESP Lore:Kagrenac's Tools]`
> - **Wraithguard** — a gauntlet that protects the wielder from the raw power of
>   the Heart; without it, using the other Tools is lethal. The Nerevarine must
>   obtain a *copy* made by Yagrum Bagarn (the last Dwemer) because the original
>   is destroyed.
> - **Keening** — a short blade that *tunes* the power drawn from the Heart; acts
>   as a resonator/conduit.
> - **Sunder** — a hammer that *strikes* the Heart to release power; the actual
>   mechanism of extraction.
> Together they form a system for controlled divine power extraction. The Tribunal
> used all three. Kagrenac used all three. The Nerevarine uses them to *destroy*
> the Heart rather than drain it.

---

### 19.2 Why This Makes a Better Path

The original "Sixth House Way" required `dagoth_ur_awakened` and was heavily
gated by Dunmer culture and Sixth House cult membership. This severely limited
who could pursue it and tied it to a single event chain.

The revised path — **Kagrenac's Ambition** — works differently:

- **The act** (tapping a Tower Stone's divine power) is **not culture-specific**.
  The Dwemer did it. The Dunmer Tribunal did it. A Breton scholar, an Imperial
  battlemage, or a Redguard warrior could discover the same principle and attempt
  it.
- **The Heart of Lorkhan is the clearest example**, but the *principle* extends
  to any Tower Stone. A character with deep knowledge of the Tower framework
  could theoretically attempt to tap any active Tower Stone — though the Heart
  is the only one with documented successful precedent for *mortal godhood*.
- **The Tribunal's path is already in the mod** (`tribunal_events.txt`). This
  path is the *secular* version — not the Tribunal's specific cultural and
  religious framing, but the raw underlying act stripped of ALMSIVI theology.

**The path is thus available to:**
- Any ruler with sufficient arcane knowledge who learns of Kagrenac's discoveries
- Anyone who gains access to the Heart of Lorkhan (i.e., reaches Vvardenfell
  during the dagoth_ur_awakened era, when the Heart is no longer fully sealed)
- Any character who already has `sixth_house_cultist` (they are closer to the
  Heart's influence than anyone else)
- Dwemer scholars who have reconstructed Kagrenac's theories (trait: `dwemer_scholar`)

---

### 19.3 The Path Name and Framing

**Path label:** `ww_borrowed_divinity` (internal key)

**Display name:** *"Kagrenac's Ambition"*

**In-world concept name:** *"The Borrowed Divinity"* — used in the event flavor
text to describe the act itself. The name acknowledges what it is: power that
does not belong to the mortal who holds it. It was Lorkhan's. It was slain with
him. To take it is to borrow from the dead — and the dead do not always accept
the loan.

**Core flavor thesis** (must permeate all event text):

> *The Tribunal took the power of a dead god and called themselves gods for it.
> Dagoth Ur touched the same power without their careful instruments and became
> something else — something that did not need their approval.*
>
> *The tools exist. The Heart exists. The act has been performed before, by both
> saints and monsters. What you propose to do is not new. What is new is that
> you are the one proposing to do it.*

This framing works for any culture. It doesn't require the character to revere
Dagoth Ur, hate the Tribunal, or even be Dunmer. It requires only that they
*understand what was done and choose to do it themselves*.

**Tone:** Ambitious. Transgressive. Not necessarily evil — the Tribunal were
considered saints. But the act itself destabilises the world. The flavor text
should always carry a sense of *weight*: this is a thing that changes the nature
of Nirn slightly, every time it's done. The Heart does not give its power freely.

---

### 19.4 Lore Accuracy Table

| Claim | Permitted? | Canon tier |
|---|---|---|
| Tapping the Heart of Lorkhan confers divine power | ✅ Yes — demonstrated by both Tribunal and Dagoth Ur | `[CANON — TES III: Morrowind]` |
| Kagrenac's Tools are necessary for safe contact | ✅ Yes — without Wraithguard, using Keening/Sunder is immediately lethal | `[CANON — TES III: Morrowind; UESP Lore:Kagrenac's Tools]` |
| The Tribunal's divinity was *borrowed*, not earned | ✅ Yes — their power drained when the Heart was destroyed in 3E 427; Almalexia and Sotha Sil began degrading before that | `[CANON — TES III: Tribunal; UESP]` |
| Dagoth Ur's connection to the Heart was different — more direct than the Tribunal's | ✅ Yes — he did not use the Tools; he is described as "merged" with the Heart | `[CANON — TES III: Morrowind in-game texts]` |
| The Heart's power can be tapped by non-Dunmer | ✅ Yes — Kagrenac (a Dwemer) designed the entire apparatus; the Heart predates Dunmer existence | `[CANON — UESP]` |
| The act is morally neutral in TES cosmology | ✅ Yes — the Tribunal are revered; the same act by Dagoth Ur is feared; the act itself carries no inherent moral weight in TES metaphysics | `[CANON — TES III: Morrowind, overall framing]` |
| The path survives Dagoth Ur's defeat (Heart destruction) | ❌ No — once the Heart is destroyed (3E 427), this path's power source ceases to exist | `[CANON — TES III: Morrowind main quest]` |
| The Dwemer "used" the Heart successfully | ⚠️ Contested — Kagrenac's activation either destroyed all Dwemer, or they all transcended simultaneously; no single in-game text settles which | `[CONTESTED — UESP; do not state definitively]` |
| A mortal can tap the Heart *without* Kagrenac's Tools and survive | ⚠️ Possible but extremely rare — Dagoth Ur survived; no other documented case | `[SOFT CANON — Morrowind in-game texts]` |
| This is the same power that created/sustained the Numidium | ✅ Yes — Kagrenac designed the Numidium to use the Heart as its power source; the Heart *is* what the Mantella was meant to approximate | `[CANON — UESP Lore:Numidium; Lore:Kagrenac]` |

---

### 19.5 Date Window and Availability

**The Heart of Lorkhan exists** from the Merethic Era (when it fell to Nirn) until
**3E 427** when the Nerevarine destroys it. It is the Stone of the Red Tower for
this entire period.

**However, *access* to the Heart** has different conditions across eras:

| Era | Heart Access | Notes |
|---|---|---|
| Merethic to c. 1E 700 | Unreachable — deep within Red Mountain before the Dwemer built their apparatus | Only the Dwemer had the engineering to reach it |
| c. 1E 700–2E 882 | Sealed by the Ghost Fence (Tribunal-maintained) | Tribunal control the access; no outside party can reach the Heart |
| **2E 882–3E 427** | **Accessible** — Dagoth Ur expelled the Tribunal from Red Mountain; the Ghost Fence frays | **This is the mod's active window for this path** |
| 3E 427 onward | Heart destroyed | Path permanently unavailable |

**EK2 date guard:**
```
# Kagrenac's Ambition — path availability
is_valid = {
    # Heart must be accessible (Dagoth Ur has broken the Tribunal's seal)
    global_var:dagoth_ur_awakened = yes
    # Heart must not yet be destroyed
    NOT = { has_global_flag = dagoth_ur_defeated }
    # Must have reached sufficient arcane knowledge
    OR = {
        learning >= 16
        has_trait = dwemer_scholar
        has_trait = sixth_house_cultist
    }
}
```

**Note on the "early awakening" mod conditions:** `dagoth_ur_events.txt` already
allows Dagoth Ur to awaken before 2E 882 under certain conditions (no Dunmer
kingdom in Morrowind, no keeper holding the Tower Stone). If those conditions fire
early, this path becomes available early — which is mechanically and lore-accurate.
If the Tribunal's grip on the Heart weakens, the Heart becomes reachable.

---

### 19.6 Two Routes — Kagrenac's Method vs. Dagoth's Method

The path has a **fork at Milestone 3** that permanently commits the character to
one of two approaches. This fork maps directly onto the canonical lore distinction:

#### Route A: Kagrenac's Method (Controlled)

> *Seek the Tools. Understand the resonance. Strike only where the blade can find purchase.*

- Pursue replicas or originals of Wraithguard, Keening, and Sunder
- Requires `dwemer_scholar` or equivalent Learning (≥ 18)
- Slower but with lower failure risk
- Produces a result closer to the Tribunal's: sustained, measured divine power
  that requires the character to periodically "return" to the Heart (mechanically:
  a yearly event that re-triggers the power bonus, failing if the character has
  not maintained contact)
- **Apex trait:** `heart_scholar_ascendant`
- **Flavor:** Precise. Academic. The Tribunal used this method and it worked for
  millennia. It is also, in the end, a cage — you are forever dependent on the Heart.

#### Route B: Dagoth's Method (Direct Contact)

> *No instruments. No intermediary. Put your hands on the Heart and hold.*

- Requires surviving a direct contact event (significant stress damage)
- Requires `corprus_afflicted` (the Blight disease is evidence of the Heart's
  unmediated influence; surviving it is the prerequisite for surviving direct contact)
- Higher failure rate, catastrophic on failure
- Produces a result closer to Dagoth Ur's: total fusion — the character is no longer
  *drawing* power from the Heart but is *part of it*; when the Heart dies, so do they
- **Apex trait:** `heart_fused_ascendant`
- **Flavor:** Raw. Terrifying. Dagoth Ur survived. The Dwemer did not. The text
  should never let the player forget this asymmetry.

Both routes share the same first two milestones and terminate at the same hard
endpoint (Heart destruction). The difference is in the nature of the power held
and the risks involved.

---

### 19.7 Milestones (6 shared + route-specific fork at Milestone 3)

| # | Milestone Name | Mechanism | Both Routes? |
|---|---|---|---|
| 1 | *The Scholar's Discovery* | Character encounters evidence of Kagrenac's work — a text, a Dwemer ruin, a Sixth House sleeper who carries fragmentary knowledge of what lies under Red Mountain | Both |
| 2 | *The Theoretical Understanding* | A long research event — the character achieves intellectual understanding of what the Heart is and what tapping it means. They cannot un-know this. | Both |
| 3 | **THE FORK** | Character chooses: *"Approach as Kagrenac did — with instruments and caution"* (Route A) OR *"Approach as Dagoth Ur did — with will and nothing else"* (Route B) | Split here |
| 4A | *The First Instrument* | Route A: Character obtains or commissions a replica of one of the three Tools; first controlled touch of the Heart | Route A only |
| 4B | *The Corprus Gate* | Route B: Character must have `corprus_afflicted` or survive a deliberate Blight exposure event — the disease is the Heart's fingerprint on the world | Route B only |
| 5A | *The Full Apparatus* | Route A: All three Tools assembled; first full controlled draw of Heart power | Route A only |
| 5B | *The Plunge* | Route B: Direct contact event — high stress, 40% failure risk, but survival grants the merge | Route B only |
| 6 | *The Stolen Fire* | Shared conclusion event: the character holds the Heart's power. It is divine. It is not theirs. They have it anyway. | Both (different flavor text per route) |

---

### 19.8 Failure States

#### Route A Failure (at Milestone 5A) — The Tools Fail

The Tribunal copied Kagrenac. Copies of Wraithguard can fail. The character
attempts the draw and one of the Tools fractures:

- `heart_overload` event fires: massive stress, Learning -4 permanently
- Character survives but cannot attempt this route again
- Can still switch to Route B if they meet its requirements
- **Flavor:** *"The hammer cracked on the third strike. The resonance inverted.
  For a moment you saw what the Dwemer saw in their last instant — and then the
  moment passed and you were still standing and everything that should have been
  different about you was exactly the same."*

#### Route B Failure (at Milestone 5B) — The Heart Takes You

The character attempts direct contact and cannot sustain their identity against
the weight of a dead god's will:

- `heart_absorbed` event fires: character gains `corprus_afflicted` (permanent,
  negative) + `heart_absorbed_modifier` (Intrigue -6, all stress gains +100%)
- Path permanently closed for this character
- **Flavor:** *"You reached for the Heart. The Heart reached back. What walked
  away from Red Mountain was not entirely you — but it was not entirely not-you
  either. Something fundamental had been rearranged. You understood, in the way
  that a broken pot understands the floor."*

---

### 19.9 Apex Traits

#### Route A Apex: `heart_scholar_ascendant`

The Tribunal-method ascendant. Controlled. Sustained. Dependent.

- Learning +8, Diplomacy +4, Martial -2 (they are no longer primarily a warrior)
- `monthly_piety = 5` (they are objectively more divine than they were)
- `stress_gain_mult = -0.20`
- **Special: *Heart-Draw*** — Yearly event: the character must renew their
  connection to the Heart. If they are on Vvardenfell or within 3 counties of
  Red Mountain, the renewal succeeds automatically (+prestige 50). If they are
  elsewhere, they must choose: spend 200 gold for a "proxy ritual" (less effective;
  only +prestige 20) or skip the renewal (power begins to fade; Learning bonus
  decrements by 1 per skipped year, recoverable on next renewal)
- This mechanic directly models the Tribunal's documented dependence on periodic
  returns to the Heart. It is lore-accurate and mechanically interesting.
- **Special: *Divine Resonance*** — Other rulers with `heart_scholar_ascendant`
  or `heart_fused_ascendant` in the world appear in a unique notification event.
  The Heart recognises those who have touched it. `[MOD CHOICE — no direct canon
  basis but consistent with the Heart-as-Tower-Stone framework]`

#### Route B Apex: `heart_fused_ascendant`

The Dagoth Ur-method ascendant. Raw. Total. Unseverable (until the Heart dies).

- Learning -2 (intellectual capability partially overwritten by the merge)
- Intrigue +6, Martial +6, Prowess +4
- `monthly_piety = 8`
- `stress_gain_mult = -0.40` (the Heart's vastness absorbs mortal concerns)
- `dread_gain_mult = 0.40`
- **No dependency mechanic** — unlike Route A, the fused ascendant does not need
  to return to the Heart. They carry it with them. This is their advantage and
  their doom: when the Heart is destroyed, there is nothing to decouple from.
- **Special: *The Blight Emanation*** — County the character resides in gains
  a low-intensity `blight_storm_modifier` aura (Farming -10%, Disease Outbreak
  chance +5%). The character's divine presence is not clean. It bleeds.
- **Hard death clause:** When `dagoth_ur_defeated` fires, ALL `heart_fused_ascendant`
  characters die immediately (simulating the death of Dagoth Ur's Ash Vampires
  when the Heart was severed). No survival option. This is non-negotiable lore —
  Dagoth Ur's power structure collapsed instantly when the Heart was destroyed.

---

### 19.10 Route A — Three-Phase Degradation (The Tribunal's True Arc)

> ⚠️ **Critical lore correction vs. earlier draft:** Route A does NOT lose power
> instantly when the Heart is destroyed. The Tribunal's canonical arc shows a
> **three-phase degradation** beginning when access to the Heart was severed,
> not when it was physically destroyed. This distinction is lore-essential and
> must drive all mechanical design for Route A's ending.

---

#### The Lore Arc the Mechanics Must Model

| Phase | Date | What happened | Mechanical equivalent |
|---|---|---|---|
| **Phase 0 — Abundance** | Before 2E 882 | Tribunal (and any Route A practitioner) can freely return to the Heart; power is renewable | Route A works as designed in §19.9: yearly renewal succeeds easily |
| **Phase 1 — Starvation** | **2E 882** | Dagoth Ur awakens and seizes Red Mountain; the Tribunal (and Route A practitioners) are **physically expelled from the Heart**. They cannot renew. Power is now finite — they are living on whatever reservoir they built up. | `heart_cut_off` flag set on `dagoth_ur_awakened`; renewal events begin failing; starvation mechanics activate |
| **Phase 2 — Madness** | **2E 882–3E 427** | Over the following 545 years, the Tribunal's stored power slowly drains. Sotha Sil withdraws to his Clockwork City and goes silent. Almalexia's mind breaks. She kills Sotha Sil in the Clockwork City — not because she can truly absorb his power, but because her broken mind believes it will help. | `heart_starvation_modifier` stacks over time; `almalexia_option` becomes available |
| **Phase 3 — Dissolution** | **3E 427** | The Heart is physically destroyed by the Nerevarine. Whatever residual power remained is severed. Vivec disappears. Almalexia is killed in Mournhold (by the Nerevarine). What remains of Vivec's power holds Baar Dau aloft for ~78 more years before it fails. | Heart destruction fires `borrowed_divinity.dissolution.001`; CHIM escape option becomes available |

**Canon source for all three phases:**
`[CANON — TES III: Morrowind + Tribunal expansion; UESP Lore:Tribunal; UESP Lore:Almalexia; UESP Lore:Sotha Sil; UESP Lore:Vivec]`

---

#### Phase 1 Implementation — `heart_cut_off` (fires on `dagoth_ur_awakened = yes`)

When Dagoth Ur awakens:

```
# All Route A practitioners are now cut off from the Heart
every_living_character = {
    limit = { has_trait = heart_scholar_ascendant }
    set_character_flag = heart_cut_off
    trigger_event = { id = borrowed_divinity.cutoff.001 }
}
```

**The `borrowed_divinity.cutoff.001` event:**

> *"Red Mountain has changed.*
>
> *You felt it before the reports arrived — a shift in what you relied on
> without knowing you relied on it. The connection to the Heart's power has
> not broken. It has simply… become unreachable. Something is between you
> and the source. Something vast.*
>
> *The Tribunal have been cut off from it for the same reason. You know this
> because you can feel the absence of their draw — the Heart was never meant
> to feed so many.*
>
> *What you hold now is what you stored. It will not be replenished."*

Options:
- `"Then I use what I have carefully."` → -stress 20 (acceptance; slow starvation begins)
- `"There must be another way in."` → +stress 30 (denial; sets `heart_cutoff_denial` flag;
  character will attempt a proxy renewal next yearly tick, which automatically fails,
  adding more stress each failure — 3 failures collapse the denial flag)

**Mechanical effect once `heart_cut_off = yes`:**
- The yearly renewal mechanic from §19.9 no longer succeeds even at Red Mountain
  (Dagoth Ur controls Red Mountain; access is blocked)
- `heart_scholar_ascendant` bonuses begin decreasing at **-1 Learning per year**
  until Learning bonus reaches 0 (from +8 to 0 = 8 years before the stat bonus
  fully drains)
- `monthly_piety` halved while cut off
- `stress_gain_mult` bonus reduced from -0.20 to -0.05

**The reservoir:** The character has `heart_reservoir_counter` (10 + years_ascendant / 5).
A ruler who achieved ascendancy recently has a small reservoir. One who has held
it for decades has a larger one. Each year cut off reduces the reservoir by 1.
When reservoir reaches 0, Phase 2 triggers.

---

#### Phase 2 Implementation — `heart_starvation` (fires when reservoir = 0)

```
borrowed_divinity.starvation.001    # "The reservoir is empty"
```

**The `borrowed_divinity.starvation.001` event:**

> *"The last of it is gone.*
>
> *You can feel the difference. There is a quality to what you were —
> a steadiness, a weight — that is simply absent now. You are mortal.
> You were mortal before. The difference is that now you remember what
> the other thing felt like.*
>
> *The Tribunal are in the same place. All of them. Almalexia has stopped
> giving public audiences. The rumours from Mournhold are becoming
> difficult to ignore.*
>
> *You understand why."*

**Mechanical effects:**
- `heart_scholar_ascendant` trait REMOVED
- `heart_starvation_modifier` added: Learning -4, Diplomacy -2, stress_gain_mult +0.40
  (the absence is felt as a wound; this is lore-accurate — the Tribunal's power
  loss was experienced as decline and suffering, not clean departure)
- **The Almalexia Option** becomes available (see §19.10a below)
- Character is now in a *vulnerable* state: mortal again, worse than before
  ascension in some stats, but not dead

---

#### 19.10a The Almalexia Option — Consuming Another

> **Lore basis:** Almalexia killed Sotha Sil in his Clockwork City. She believed
> — in her madness — that absorbing what remained of his stored Heart power would
> restore her. The game implies it did not truly work; she was already gone in her
> mind when she did it. But the *attempt* is canonical. `[CANON — TES III: Tribunal]`

When a character is in `heart_starvation`, they receive a timed decision (available
for 5 years before it expires):

**Decision: *"There is one source of Heart power left in the world."***

> *"The mathematics of this is simple. You once held borrowed fire. Another
> holds it still. What they have was drawn from the same well.*
>
> *Almalexia understood this. Her mind was already breaking when she did what
> she did in the Clockwork City. That is not the comfort it should be.*
>
> *But you are not Almalexia. You chose this deliberately. You are still choosing."*

**Requirement to take this option:**
- Another living ruler currently has `heart_scholar_ascendant`
- Character has `intrigue >= 14`
- Character is NOT `nerevarine_marked` (the Nerevarine's path is closure; not this)

**Effect:**
- Murder event: the target ruler must be killed (this uses existing assassination
  mechanics — not a simple effect, requires genuine plot or direct combat)
- If the target ruler dies while this flag is active: the consuming character regains
  a partial reservoir (5 + target's years_ascendant / 5)
- This **re-applies `heart_scholar_ascendant` at half effectiveness** for a number
  of years equal to the reservoir recovered, then enters starvation again
- **It does not work indefinitely.** Each subsequent consumption halves the
  effective years gained. First consumption: full reservoir. Second: half. Third:
  quarter. The law of diminishing returns mirrors the canon: Almalexia gained
  nothing lasting from Sotha Sil's death.
- **Piety cost:** -500 (this is murder; it is not approved of by any divine)
- **Dread gain:** +40

**If the character takes this option and completes it, they receive the permanent
modifier `consumed_another`** (this modifier persists even after the power fades):
- Opinion -20 from all Tribunal-faith rulers
- Opinion -10 from all rulers with `heart_scholar_ascendant` (the community of
  Heart-touchers knows what was done; the victim's `Divine Resonance` carried the
  moment of death to all who shared the connection)
- Cannot pursue the CHIM escape (see §19.10b) — the act of consumption closes the
  contemplative door; Almalexia was killed still mad; Vivec, who chose the other
  path, simply left

**Flavor note for event text:** The murder of Sotha Sil is one of the most disturbing
events in TES III. It should be written with full weight. The character is not
heroic or clever here. They are doing what Almalexia did. The text should not
glamourise it. If they choose it, they choose it with clear eyes.

---

#### 19.10b The Vivec Option — CHIM as the Last Door

> **Lore basis:** Vivec disappeared around 3E 427. His fate is explicitly
> `[CONTESTED — by design]`. The most widely-held scholarly interpretation is
> that Vivec used the last of his stored Heart power, combined with his existing
> understanding of the Aurbis (documented in the 36 Lessons), to attempt or
> achieve **CHIM** — and either succeeded and left Nirn voluntarily, or simply
> faded with grace rather than madness. Baar Dau did not fall until 4E 5 (~78
> years after Heart destruction), which implies he maintained at least a thread
> of presence or power for decades after. `[SOFT CANON — UESP analysis; MK texts;
> in-game: 36 Lessons of Vivec]`

When a character is in `heart_starvation` AND has NOT taken the Almalexia Option:

**A new CHIM entry gate opens.** This is separate from the existing `chim.000`
event chain. It is the *desperation gate* — not the scholar's gate.

**Decision: *"The well is empty. But the sky is not."***

> *"You came to the Heart because you wanted what it had. You wanted power
> the ordinary ways of the world would not give you. You found it. You held
> it. Now it is gone.*
>
> *Vivec walked this same diminishment. His power faded by the same steps
> yours has. And then he was not there anymore.*
>
> *You have read enough to know what the 36 Lessons are actually saying.
> You have held divine fire in your hands and felt it go cold. No one else
> in the world has those two qualifications simultaneously.*
>
> *The scholars call it CHIM. The word sounds like a door closing from
> the inside.*
>
> *You could try."*

**Requirements:**
- `heart_starvation` is active (character in Phase 2 degradation)
- NOT `consumed_another` (cannot pursue CHIM after the Almalexia choice)
- `learning >= 18` (the Heart-scholar, now desperate and reflective, has
  the intellectual foundation; this is higher than the standard CHIM gate)
- NOT already `has_trait = chim_achieved`

**Effect:**
- Sets `chim_attempt_from_starvation` flag
- This flag gives the character **access to the existing CHIM event chain**
  (`chim.000` and onward) with a different flavor intro event that acknowledges
  the Heart context
- The chance of CHIM success via this gate is **slightly higher** than the
  standard gate (Learning ≥ 18 is a harder requirement, and the context of
  having held divine power creates a unique understanding)
- **If CHIM succeeds:** Character gains `chim_achieved`, the `heart_starvation_modifier`
  is removed (CHIM is a new mode of being; the absence of Heart power is no longer
  felt as loss — the character is no longer relating to the world through the lens
  of borrowed divinity), and they enter Path A (CHIM Expanded, §259 of this document)
- **If CHIM fails:** Standard failure consequences from the existing CHIM system apply;
  `chim_attempt_from_starvation` is cleared; character remains in `heart_starvation`

**Critical flavor note:**
The CHIM attempt from starvation should explicitly reference the Heart journey:

> *"You have held a slain god's power. You have felt it leave you. In that
> specific experience — the having and the losing — there is a kind of
> understanding that cannot be purchased any other way.*
>
> *Vivec knew this. His Lessons are full of it: the god who had everything,
> who lost it, who understood that the losing was the lesson.*
>
> *Most who try CHIM come to it through philosophy. You came through the fire
> itself. That is not a metaphor. You literally held borrowed divinity and
> survived its departure.*
>
> *Whether that is enough is a question the Aurbis will answer for you."*

**Design note:** This connection is `[MOD CHOICE — no direct canon confirmation that
Heart power is a prerequisite or pathway to CHIM]`. However, it is **consistent
with** the lore theme that CHIM requires understanding one's own nature within
the Aurbis — and having held and lost divine power is precisely the kind of
experience that forces that understanding. The mod is not claiming Vivec's CHIM
(if he achieved it) required the Heart; it is claiming that *a character who
went through this path* is unusually well-positioned for CHIM.

---

#### Phase 3 — Heart Destruction (3E 427)

When `dagoth_ur_defeated` is set:

**For characters in Phase 1 (still have reservoir):**
```
# Accelerate drain to 2 per year instead of 1
modify_heart_reservoir_drain = 2
# Notify: "The source has been destroyed. What remains will not last."
trigger_event = { id = borrowed_divinity.cutoff.002 }
```

**For characters in Phase 2 (already in starvation):**
```
# No additional mechanical effect — they are already past the Heart's influence
# But they receive a narrative event acknowledging the moment
trigger_event = { id = borrowed_divinity.dissolution.001 }
```

**The `borrowed_divinity.dissolution.001` event (fires for both groups):**

> *"You were in the middle of a sentence when it stopped.*
>
> *Not the Heart — you would not know the Heart had stopped the way you know
> a candle goes out. The Heart's ending was not a sound. It was the absence
> of a sound you had stopped noticing you were always hearing.*
>
> *If you still had any of it, you feel it going faster now. If you already
> lost it, there is simply a new quality to the silence — the source is
> gone, not merely blocked.*
>
> *The Tribunal spent three thousand years drawing from that well. Vivec held
> Baar Dau aloft for years after this moment with what little remained.*
>
> *He is gone now too. Whether he found something else on the way out is a
> question no one has answered convincingly."*

Options:
- `"I had it while I had it. That was real."` → +prestige 500, -stress 30
- `"Where did Vivec go?"` → [only if learning ≥ 18 and NOT consumed_another]
  This option sets `chim_attempt_from_starvation` even if not yet in starvation —
  the character is already thinking about the other door → +piety 100
- `"I should have taken more while I could."` → [only if consumed_another]
  The character has no grace about this. → +stress 50, +dread 20

---

**Route B remains unchanged: `heart_fused_ascendant` characters die immediately
on `dagoth_ur_defeated`. No phases. No options. This is because the fusion was
total — there is no stored power separate from the Heart to drain slowly. When
the Heart stops, they stop.**

---

### 19.11 Interactions with Other Systems

#### With the Nerevarine Path (`dagoth_ur.030`)

Both this path and the Nerevarine path ultimately concern the Heart. They are
therefore in fundamental tension:

| Ruler Type | Effect on Others |
|---|---|
| `heart_fused_ascendant` | Nerevarine path cooldown on all Dunmer rulers within 5 counties +3 years (the Heart's corruption emanates outward; the prophecy is harder to hear) |
| `heart_scholar_ascendant` | No suppression — they draw cleanly; but the Nerevarine will seek them out as "one who knows the way to the Heart" (a confrontation event option: assist the Nerevarine or attempt to prevent them) |
| `nerevarine_marked` | Can trigger a confrontation with any Heart-ascendant ruler — **the canonical purpose of the Nerevarine is to destroy the Heart**; a Nerevarine who encounters someone drawing power from it has a direct motive to stop them |

#### With the Tribunal System (`tribunal_events.txt`)

The Tribunal are the canonical Route A practitioners:

- If a ruler achieves `heart_scholar_ascendant`, Tribunal-aligned rulers receive
  a notification: *"Someone has taken up Kagrenac's Tools. The ALMSIVI did not
  build this road to share it."*
- Tribunal-trait rulers gain opinion -30 toward any `heart_scholar_ascendant`
  ruler (they view this as heresy — the Tribunal claimed exclusive access to the Heart)
- `heart_fused_ascendant` rulers have no special Tribunal interaction — the Tribunal
  are afraid of what Dagoth Ur became and won't acknowledge the parallel

#### With the Dagoth Ur System (`dagoth_ur_events.txt`)

The existing `sixth_house_cultist` trait is now the **entry point** for Route B
(the Dagoth Ur-adjacent approach). A character who joined the Sixth House has
already been exposed to the Heart's influence via Dagoth Ur's Dream — this is
what earns them the `corprus_afflicted` prerequisite for Route B.

Route A has no Sixth House dependency — it is pursued independently through
Dwemer scholarship.

---

### 19.12 Localization File

```
mod/localization/english/borrowed_divinity_l_english.yml
```

All event display text for this system goes here:
- `borrowed_divinity.*` events (all milestones, both routes, termination, cutoff, starvation)
- `borrowed_divinity.cutoff.001` — Dagoth Ur severs Heart access
- `borrowed_divinity.cutoff.002` — Heart destroyed while character still has reservoir
- `borrowed_divinity.starvation.001` — reservoir empty; Phase 2 trigger
- `borrowed_divinity.dissolution.001` — Heart destroyed; shared narrative acknowledgement
- Trait display names: `heart_scholar_ascendant`, `heart_fused_ascendant`
- Modifier display names: `heart_starvation_modifier`, `heart_absorbed_modifier`, `consumed_another`
- Custom tooltips: `kagrenac_route_chosen_tt`, `dagoth_route_chosen_tt`,
  `almalexia_option_tt`, `chim_from_starvation_tt`

**BOM reminder:** UTF-8 BOM required (`printf '\xef\xbb\xbf' | cat - file > tmp && mv tmp file`).

---

### 19.13 on_actions Registration

Per convention (`lore_races_on_actions.txt`, `on_yearly_pulse` block):

| Event ID | Function | Weight |
|---|---|---|
| `borrowed_divinity.000` | Hidden yearly: check if player is eligible for path intro | 50 |
| `borrowed_divinity.dissolution.000` | Hidden yearly: check if Heart has been destroyed; fire termination | 100 |
| `borrowed_divinity.heart_draw.000` | Hidden yearly: Route A dependency check (renewal event OR starvation tick) | 80 |
| `borrowed_divinity.starvation.000` | Hidden yearly: check if reservoir has hit 0; fire Phase 2 | 90 |
| `borrowed_divinity.almalexia.000` | Hidden yearly: check if Almalexia option should expire | 60 |

---

### 19.14 Integration Checklist

- [ ] Internal key `ww_borrowed_divinity` added to `walking_ways_traits.txt`
- [ ] `heart_scholar_ascendant` and `heart_fused_ascendant` traits defined in
  `dagoth_ur_traits.txt` (fits thematically; both are Heart-derived)
- [ ] `heart_starvation_modifier`, `heart_absorbed_modifier`, `heart_overload`,
  `consumed_another` modifiers added to `lore_races_modifiers.txt`
- [ ] `heart_reservoir_counter` variable defined (integer, per character)
- [ ] `heart_cut_off` flag defined (per character; set on `dagoth_ur_awakened`)
- [ ] `chim_attempt_from_starvation` flag defined (per character; gate into CHIM chain)
- [ ] All milestone events written in a new `borrowed_divinity_events.txt`
  (separate from `dagoth_ur_events.txt` — this path is broader than Dagoth's system)
- [ ] `borrowed_divinity.cutoff.001/.002` events written (Heart access severed)
- [ ] `borrowed_divinity.starvation.001` event written (reservoir empty)
- [ ] `borrowed_divinity.dissolution.001` event written (Heart destroyed)
- [ ] Almalexia Option decision written (5-year timed decision)
- [ ] CHIM starvation gate decision written; hooks into existing `chim.000` chain
  with `chim_attempt_from_starvation` flavor variant
- [ ] `borrowed_divinity_l_english.yml` created with UTF-8 BOM
- [ ] Five `on_yearly_pulse` registrations added to `lore_races_on_actions.txt`
- [ ] Route A degradation hooks added to `end_dagoth_ur_era` scripted effect in
  `lore_races_effects.txt` (three-phase model); Route B hard death unchanged
- [ ] `heart_cut_off` flag set in `on_dagoth_ur_awakened` scripted effect
- [ ] Nerevarine + Tribunal interaction events written
- [ ] `12_mod_pitfalls.md` updated:
  - *"Route A (`heart_scholar_ascendant`) loses power in THREE phases starting at
    2E 882 (cut off), not instantly at 3E 427 (Heart destroyed)"*
  - *"`consumed_another` and `chim_attempt_from_starvation` are mutually exclusive
    — taking the Almalexia Option permanently closes the CHIM gate"*
  - *"`heart_scholar_ascendant` and `heart_fused_ascendant` are not interchangeable —
    Route A survives Heart's destruction; Route B dies instantly"*
- [ ] `lore/06_towers.md` Red Tower entry updated to cross-reference this path
  *(already done — added in §19 revision)*
- [ ] `lore/10_key_figures.md` Tribunal section updated with degradation/murder/CHIM detail
  *(already done — Vivec, Almalexia, Sotha Sil entries expanded)*
- [ ] §17.6 timeline table updated: *"2E 882 — Dagoth Ur expels Tribunal from
  Red Mountain; Heart becomes inaccessible; Route A degradation begins for all
  `heart_scholar_ascendant` characters"*

---

### 19.15 Design Note — Why This Path Is Not a Traditional Walking Way

The existing five Walking Ways (CHIM, Mantling, Psijic Endeavour, Enantiomorph,
Amaranth) all concern the *self's relationship to Nirn's metaphysical structure*.
They are about what you *understand* or *become* in relation to the Aurbis.

**Kagrenac's Ambition is different.** It is about taking something external —
a Tower Stone's power — and incorporating it. It is closer to theft than
enlightenment. The Walking Ways are paths of *becoming*; this is a path of
*acquiring*.

This distinction matters for event text framing:

- Walking Ways: *"You have understood something that changes what you are."*
- Kagrenac's Ambition: *"You have taken something that changes what you can do."*

The path should present this honestly. It is not CHIM. It is not Mantling. It is
something the established Walking Ways taxonomy does not account for — which is
why it slots as Path F rather than being numbered 1–5. It works alongside the
Walking Ways system but is not of the same kind. Writers should:

- **Not** present this as equivalent to CHIM or Amaranth in terms of metaphysical
  significance
- **Not** describe the character as "transcending mortality" — they have *borrowed*
  divine power; they are still mortal; the power is not theirs by right
- **Do** acknowledge that the Tribunal did this and were called saints; this act
  can coexist with piety and rulership; it is not inherently evil or taboo (except
  to the Tribunal specifically, who object to competition)

---

*End of §19 — revised to ground the path in the universal lore of Tower Stone
theft rather than the specific context of Dagoth Ur's cult.*

---

*End of session 2026-04-05 (fourth pass) notes.*

*§18 records audit findings. §19 is a self-contained design spec for the Heart-theft path. Both can be implemented independently of the rest of Walking Ways.*

---

## 20. Path B Sub-Types (Jyggalag, Sheogorath's Echo) and Path L — Necromancer's Third Way

> **Added:** Session 2026-04-06 — Three paths that fill gaps in the current taxonomy:
> two Daedric-adjacent paths reclassified as **Path B sub-types** (Jyggalag champion-role
> and Sheogorath influence-without-succession) and a third branch for the nascent Necromancer
> tree that rejects both Mannimarco and the Ideal Masters.
>
> **Reclassification note (2026-04-08):** The Jyggalag and Sheogorath paths were originally
> designated "Path K" and "Path K-2" in this section's headings, but their **Path type**
> fields already correctly said Path B (Mantling — Daedric sub-category). The section headers
> have been updated to match. Jyggalag and Sheogorath belong in Path B because:
> - Both are structurally mantling-class paths (same rank/milestone engine as B-Talos, B-Azura, etc.)
> - The lore basis for both is a mantling relationship with a Daedric Prince's domain
>   (Jyggalag = champion-role embodying Order; Sheogorath = echo/influence without succession)
> - Internal scripted keys (`ww_mantling_jyggalag`, `ww_sheogorath_echo`) remain unchanged

---

### 20.1 Lore Foundation

#### The Hero of Kvatch, Jyggalag, and Sheogorath

Jyggalag is the Daedric Prince of Order — the most powerful of all Daedric Princes,
feared and envied by the others. To neutralise him, the other Daedric Princes collectively
cursed him to forget himself, becoming his own opposite: Sheogorath, Prince of Madness.

Every era, at the Greymarch, Jyggalag briefly re-emerges: he destroys the Shivering Isles,
then is forced back into Sheogorath by the curse. It is a cycle of imprisonment that repeats
endlessly — until the Hero of Kvatch.

The Hero of Kvatch is **Jyggalag's instrument**. They fight through the Greymarch, defeat
Jyggalag's forces, confront Jyggalag in his true crystalline form, and in defeating him —
break the cycle. Jyggalag is freed. He departs. The curse is broken.

The throne of the Shivering Isles is now empty. The Hero of Kvatch fills it — becoming
Sheogorath. This is confirmed in Skyrim's *The Mind of Madness*, where the Hero, now
fully Sheogorath, inhabits Pelagius's mind.

This gives us two distinct moments:

1. **Before Jyggalag departs**: The Hero embodies the principle of Order completely enough
   to be Jyggalag's instrument. They are not Jyggalag — they are the shape Jyggalag's
   will moved through. **This is the Jyggalag path**: walking so precisely in the tracks of
   Order that Order itself finds you useful.

2. **After the empty throne**: The Hero takes the mantle of Sheogorath — full succession.
   This is already modelled as `mantling_sheogorath` (the existing path). But there is a
   third option the game does not explore: **what if a character channels Sheogorath's
   principle — creative chaos, the madness that contains its own logic — without claiming
   the throne?** The Prophet of Madness rather than the Mad God.

#### The Ideal Masters and the Third Necromantic Way

The Ideal Masters were once powerful mortal mages who abandoned flesh entirely to become
crystalline constructs of pure soul-energy, residing in their own pocket realm (the Soul
Cairn). They are neither Daedra nor mortal — they have transcended both categories by
surrendering them. They feed on captured souls.

The Worm Apotheosis path (Path I, Mannimarco's Road) leads to godhood through soul-science
and lichdom. The Ideal Masters path (Path I-B, not yet implemented) leads to dissolution —
you give up selfhood to become pure soul-construct. But a third option exists:

**What if you reject both masters?** The Worm Apotheosis requires following Mannimarco's
specific road — his tools, his moon, his cult's framework. The Ideal Masters' path
requires surrendering to their bargain. A necromancer who is more powerful, more original,
or more politically independent than Mannimarco might reject both and forge an entirely
new relationship with death — neither Mannimarco's heir nor the Ideal Masters' sacrifice.
This is **the Necromancer's Third Way**: original necromantic philosophy, forging a
relationship with death that has no precedent.

---

### 20.2 Path B — Jyggalag's Champion ("The Instrument of Order") [B-Jyggalag]

**Key:** `ww_mantling_jyggalag`
**Flag:** `ww_mantling_jyggalag_active`
**Apex Trait:** `jyggalag_ascendant`
**Path type:** Path B (Mantling — Daedric sub-category)

#### 20.2.1 Lore Basis

This path does not ask you to become Jyggalag — he exists and is free after 3E 433. It
asks you to **embody the principle of Order so completely** that Jyggalag recognizes you
as a kindred pattern. You are not the Prince; you are the crystalline expression of his
domain walking in mortal flesh.

The path models the Hero of Kvatch's *role* in Shivering Isles: instrument of Order against
chaos, the one who ends a cycle of madness through absolute clarity of purpose.

**Availability:** Available after 3E 433 (Greymarch ended, Jyggalag free). Before this,
Jyggalag is trapped and cannot recognize mortal champions. The `jyggalag_champion` trait
(from Daedric invasion system) is the gate — it represents prior service to Jyggalag's
crystalline forces.

**Note:** This path does NOT use Jyggalag's name as a replacement for a Daedric title.
Jyggalag is free — he is not a god you replace; he is a principle you embody. The apex
trait `jyggalag_ascendant` is distinct from the base `jyggalag_champion` daedric champion
trait.

**After completion:** The `jyggalag_ascendant` trait is the Tier 1 prerequisite for
`mantling_sheogorath` (the existing full-succession path). You walked Order so completely
that Madness found you as its mirror and offered you the empty throne. A character may
choose to pursue Sheogorath succession afterward — or stop here with Order as their apex.

#### 20.2.2 Requirements

```
can_begin_mantling_jyggalag trigger:
    has_trait = jyggalag_champion
    learning >= 14
    martial >= 16
    NOT has_character_flag = ww_mantling_jyggalag_completed
    NOT has_character_flag = walking_ways_path_active
```

#### 20.2.3 Milestones (6 total, 2 per rank)

| # | Milestone Key | Lore Action |
|---|---|---|
| 1 | `ww_jyggalag_milestone_order_kept` | Maintained absolute law in realm — no mercy pardons, full legal code enforced |
| 2 | `ww_jyggalag_milestone_chaos_suppressed` | Defeated a lunatic, possessed, or heresy-spreading character in direct action |
| 3 | `ww_jyggalag_milestone_greymarch_echo` | Survived a Daedric invasion or comparable catastrophic assault on own realm |
| 4 | `ww_jyggalag_milestone_crystal_pact` | Made a pact with Jyggalag's crystal knights / followed a pure Order-aligned decision |
| 5 | `ww_jyggalag_milestone_madness_refused` | Rejected a Sheogorath/lunatic path event option in favour of clarity |
| 6 | `ww_jyggalag_milestone_instrument` | Fought and defeated Sheogorath-aligned forces or madness-patron claimant |

#### 20.2.4 Rank Events

| Rank | Event ID | Trigger |
|---|---|---|
| Intro | `mantling_jyggalag.intro` | Path begins |
| Rank 1 | `mantling_jyggalag.rank1` | 2 milestones |
| Rank 2 | `mantling_jyggalag.rank2` | 4 milestones |
| Rank 3 | `mantling_jyggalag.rank3` | 6 milestones (threshold — 20% failure risk) |
| Apotheosis | `mantling_jyggalag.apotheosis` | Rank 4 |
| Failure | `mantling_jyggalag.order_shattered` | Failure at rank 3 threshold |

#### 20.2.5 Failure State

At rank 3 threshold, **20% chance** of `order_shattered`: the character's grip on Order
was too rigid. Jyggalag's crystalline focus, when forced through a mortal vessel without
his capacity, produces brittleness rather than strength. The character gains `obsessed`
trait + `compulsive_lawgiver` modifier (all council/vassal relations −20; cannot grant
mercy). Not death — a lasting mechanical consequence. They cannot attempt this path again.

#### 20.2.6 Apex Trait — `jyggalag_ascendant`

```
jyggalag_ascendant = {
    category = fame
    martial = 4
    learning = 3
    monthly_prestige_gain_mult = 0.35
    health = 0.5
    stress_loss_mult = 0.15
    flag = jyggalag_ascendant
}
```

- Champions of Order recognize you. `jyggalag_champion` rulers gain opinion +20.
- Sheogorath-mantle path (`can_begin_mantling_sheogorath`) recognizes `jyggalag_ascendant`
  as equivalent to (and preferred over) the base `jyggalag_champion` gate.
- Madness-type events (Daedric madness, lunatic possession) have −30% base chance
  to fire on this ruler.

---

### 20.3 Path B — Sheogorath's Echo ("The Prophet of Madness") [B-Sheogorath-Echo]

**Key:** `ww_sheogorath_echo`
**Flag:** `ww_sheogorath_echo_active`
**Apex Trait:** `madness_prophet`
**Path type:** Path B (Mantling — Daedric, non-succession variant)

#### 20.3.1 Lore Basis

The existing `mantling_sheogorath` path models full divine succession — you *become*
Sheogorath, taking his throne. This path models something different: you channel the
**principle** of Sheogorath — creative chaos, the madness that contains logic, the laughter
that understands something rational thought cannot — **without claiming the throne**.

The Prophet of Madness understands that Sheogorath's domain is not nonsense: it is a
reason creation has not yet learned to follow. They walk in that understanding, wielding
unpredictability as strategy, chaos as creative power, and madness as political tool —
without losing themselves to full possession.

The distinction from `mantling_sheogorath` is:
- **Mantling Sheogorath** = "I AM the new Mad God. The throne is mine."
- **Sheogorath's Echo** = "I understand what madness *is* and can use it. I did not
  take the throne — I carry the echo of it."

This path is **safer** (lower possession risk) but **weaker** (lower apex stats). It
is available to characters who *cannot* or *choose not to* make the full succession claim.

**Availability:** Does not require `jyggalag_champion` or `jyggalag_ascendant`. Available
to rulers with lunatic/possessed traits or Shivering Isles exposure. This represents
a character who came to madness organically — as insight, as survival, as scholarship —
rather than through Order's mirror.

#### 20.3.2 Requirements

```
can_begin_sheogorath_echo trigger:
    OR = {
        has_trait = lunatic
        has_trait = possessed
        has_character_flag = shivering_isles_visited
        intrigue >= 18
    }
    learning >= 12
    NOT has_character_flag = ww_sheogorath_echo_completed
    NOT has_character_flag = ww_mantling_sheogorath_completed   # can't have already taken the throne
    NOT has_character_flag = walking_ways_path_active
```

#### 20.3.3 Milestones (6 total, 2 per rank)

| # | Milestone Key | Lore Action |
|---|---|---|
| 1 | `ww_echo_milestone_insight` | Survived a possession/madness event and gained understanding rather than suffering |
| 2 | `ww_echo_milestone_chaos_wielded` | Made a chaotic political decision (unexpected alliance, bizarre demand) with positive outcome |
| 3 | `ww_echo_milestone_obelisk` | Interacted with Sheogorath-realm artefact or prophet |
| 4 | `ww_echo_milestone_greymarch_witness` | Witnessed or participated in a Greymarch-cycle event |
| 5 | `ww_echo_milestone_court_jester` | Held a court event where deliberate madness served political purpose |
| 6 | `ww_echo_milestone_realm_glimpsed` | Had a vision of the Shivering Isles structure — understood it as architecture, not chaos |

#### 20.3.4 Rank Events

| Rank | Event ID | Trigger |
|---|---|---|
| Intro | `sheogorath_echo.intro` | Path begins |
| Rank 1 | `sheogorath_echo.rank1` | 2 milestones |
| Rank 2 | `sheogorath_echo.rank2` | 4 milestones |
| Rank 3 | `sheogorath_echo.rank3` | 6 milestones (threshold — 15% possession risk) |
| Apotheosis | `sheogorath_echo.apotheosis` | Rank 4 |
| Possession | `sheogorath_echo.possessed` | Failure at rank 3 |

#### 20.3.5 Failure State

At rank 3 threshold, **15% chance** of `echo_possessed`: the character stopped echoing
and started being consumed. They gain `lunatic` + `possessed` + the madness escalates into
full Sheogorath-realm devotion. Not death — but the character is effectively Sheogorath's
unwilling vessel. Grants `sheogorath_consumed` modifier (large intrigue bonus, catastrophic
stress gain mult). The path is closed but the character is permanently altered.

#### 20.3.6 Apex Trait — `madness_prophet`

```
madness_prophet = {
    category = fame
    intrigue = 5
    learning = 3
    diplomacy = 2
    monthly_prestige_gain_mult = 0.25
    stress_loss_mult = 0.20
    flag = madness_prophet
}
```

- Chaotic/lunatic/jester characters gain opinion +15 toward this ruler.
- This ruler's schemes have +10% base success (madness as misdirection).
- Stress events from madness-type triggers have −40% chance to fire.
- Does **not** grant immunity to possession — they channel madness, they do not master it.
- Does **not** unlock the Sheogorath throne. A `madness_prophet` ruler cannot later take
  `mantling_sheogorath` — they chose echo over succession and the throne does not re-offer.

---

### 20.4 Path L — The Necromancer's Third Way ("I Owe No Master")

**Key:** `ww_necromancer_third_way`
**Flag:** `ww_necromancer_third_way_active`
**Apex Trait:** `death_sovereign`
**Path type:** Part of the broader Necromancer super-tree (parallel to `worm_apotheosis` and
the yet-to-be-implemented `ideal_masters` path)

#### 20.4.1 Lore Basis

The Necromancer's Third Way explicitly rejects the two established necromantic models:

**Why reject Mannimarco's Road (Worm Apotheosis)?**
Mannimarco's path requires following the specific tools, techniques, and doctrine of the
Order of the Black Worm — and accepting that you are completing *his* work, not your own.
The Worm Apotheosis makes you a reflection of Mannimarco at his apex. A more original
or politically independent necromancer refuses this: they will not be his footnote.

**Why reject the Ideal Masters?**
The Ideal Masters' bargain requires surrendering your soul's energy incrementally to them
in exchange for power. It is a transaction with masters you can never equal, leading toward
dissolution of self. The Third Way practitioner refuses to be anyone's sacrifice.

**What is the Third Way?**
Original necromantic philosophy. Not Arkay's death cycle (cyclical, oppressive). Not
Mannimarco's apotheosis (hierarchical, derivative). Not the Ideal Masters' dissolution
(transcendent but selfless). Something that has not been named yet — a practitioner who
studies death as a **domain** to be understood and ultimately governed on their own terms.
The apex of this path is `death_sovereign`: not the god of necromancy, but the sovereign
over one's own relationship with death.

[SOURCE: UESP Lore:Mannimarco (Worm Apotheosis context); UESP Lore:Soul Cairn (Ideal
Masters context); CANON with original synthesis — the Third Way is extrapolated from
established lore gaps, not from a specific TES source]

#### 20.4.2 Requirements

```
can_begin_necromancer_third_way trigger:
    has_trait = necromancer      # base necromancer trait
    learning >= 16
    NOT has_trait = worm_cult_adept          # rejected the Worm Cult's path
    NOT has_character_flag = ww_worm_apotheosis_completed
    NOT has_character_flag = ww_necromancer_third_way_completed
    NOT has_character_flag = walking_ways_path_active
```

Note: Requires `necromancer` trait but explicitly NOT `worm_cult_adept`. This path is
for necromancers who developed independently — either before encountering the Worm Cult,
or who studied necromancy and rejected the Cult's doctrine.

#### 20.4.3 Milestones (6 total, 2 per rank)

| # | Milestone Key | Lore Action |
|---|---|---|
| 1 | `ww_third_way_milestone_arkay_defied` | First successful act of necromancy that violated Arkay's cycle in a novel (non-Worm Cult) manner |
| 2 | `ww_third_way_milestone_mannimarco_rejected` | Actively refused Worm Cult recruitment, destroyed a Black Soul Gem, or purged a Worm Cult agent |
| 3 | `ww_third_way_milestone_death_taxonomy` | Completed original research into the nature of death — a new codex, a novel binding, an unexplored soul-type |
| 4 | `ww_third_way_milestone_ideal_masters_refused` | Encountered Soul Cairn influence (via Dawnguard events, soul gem research) and rejected their bargain |
| 5 | `ww_third_way_milestone_sovereign_rite` | Performed a custom death rite — one the character invented, not derived from any existing tradition |
| 6 | `ww_third_way_milestone_boundary` | Stood at the boundary between life and death (phylactery creation, near-death survived, death-vision) without following either the Worm or Ideal Masters framework |

#### 20.4.4 Rank Events

| Rank | Event ID | Trigger |
|---|---|---|
| Intro | `necromancer_third_way.intro` | Path begins |
| Rank 1 | `necromancer_third_way.rank1` | 2 milestones |
| Rank 2 | `necromancer_third_way.rank2` | 4 milestones |
| Rank 3 | `necromancer_third_way.rank3` | 6 milestones (threshold — 30% soul-unmooring risk) |
| Apotheosis | `necromancer_third_way.apotheosis` | Rank 4 |
| Failure | `necromancer_third_way.unmoored` | Failure at rank 3 |

#### 20.4.5 Failure State

At rank 3 threshold, **30% chance** of `unmoored`: the character attempted to forge a
relationship with death that had no precedent, and death turned back on them. Not through
Mannimarco's tools, not through the Ideal Masters' dissolution — just the raw consequence
of standing at the boundary without a framework. They gain `lich_essence` (they stumbled
into near-death survival) + `soul_unmoored` modifier (−2 health, permanent stress gain;
their soul is partially dissociated from their body). Still alive, still powerful — but
unstable. Cannot attempt this path again. Can still pursue `worm_apotheosis` as a fallback
(the failure taught them why a framework matters).

#### 20.4.6 Apex Trait — `death_sovereign`

```
death_sovereign = {
    category = fame
    learning = 6
    intrigue = 4
    health = 1.0
    monthly_prestige_gain_mult = 0.40
    stress_gain_mult = -0.15
    flag = death_sovereign
}
```

- Immune to standard death-by-old-age events (not immortal — the engine still applies
  health — but the narrative death-by-age events that other paths use do not fire).
- Other necromancers (worm_cult_adept, lich_essence) gain opinion +25 — you are
  something they have not seen before; you command respect across doctrinal lines.
- Worm Cult NPCs gain opinion −30 — you rejected their path and succeeded; this is
  apostasy.
- Arkay-aligned characters gain opinion −25.
- This ruler may *assist* the Ideal Masters path for another character (they understand
  the theory) without being consumed by it themselves.

---

### 20.5 Necromancer Super-Tree Structure

The three necromantic paths now form a coherent super-tree:

```
                ENTRY GATE: necromancer trait + learning≥14
                        (shared with worm_apotheosis)
                               │
                ┌──────────────┼──────────────┐
                │              │              │
        BRANCH A           BRANCH B        BRANCH C
    worm_apotheosis      ideal_masters   necromancer_third_way
    (Mannimarco's        (Soul Cairn —   (Independent — no
     Road)               dissolution)    master; own way)
        │                    │                │
   necromancers_         ideal_master_    death_sovereign
   ascendant /           ascendant /
   soul_fractured        soul_cairn_bound
```

Branch B (ideal_masters) is designed but not yet fully implemented. It shares the
entry gate with Branch A and C but routes through Soul Cairn contact events rather
than Worm Cult milestones. See §20.6 below for its brief design specification.

---

### 20.6 Branch B (Ideal Masters) — Abbreviated Spec

**Key:** `ww_ideal_masters`
**Flag:** `ww_ideal_masters_active`
**Apex Trait:** `ideal_master_ascendant`

Entry requirement: `necromancer` trait + `soul_gem_master` flag (from advanced soul gem
research) OR `has_character_flag = soul_cairn_contacted`. Mutually exclusive with
`worm_apotheosis` and `necromancer_third_way`.

Milestones focus on: Soul Cairn bargaining (give up a permanent health point in exchange
for power), staged fragmentation events (shed positive traits, gain soul-purity modifiers),
progressive dissolution of self.

Failure state (`soul_cairn_bound`): Partially crystalline. You stopped before full
dissolution. You are neither mortal nor Ideal Master. Not death — soft failure.

This branch is noted here for design completeness. Full implementation is deferred.

---

### 20.7 Integration Checklist — §20 New Paths

- [ ] Apex traits added to `walking_ways_traits.txt`:
  `jyggalag_ascendant`, `madness_prophet`, `death_sovereign`
- [ ] New failure modifier `soul_unmoored` added to `lore_races_modifiers.txt`
- [ ] New active-path modifiers added to `lore_races_modifiers.txt`:
  `ww_path_mantling_jyggalag_active`, `ww_path_sheogorath_echo_active`,
  `ww_path_necromancer_third_way_active`
- [ ] Scripted effects added to `walking_ways_effects.txt`:
  begin/advance/complete/abandon + count_milestones for all 3 paths
- [ ] `clear_all_ww_active_flags` updated with 3 new active flags
- [ ] Scripted triggers added to `walking_ways_triggers.txt`:
  can_begin/is_on/has_completed/has_any_milestone for all 3 paths
- [ ] Decision options added to `walking_ways_decisions.txt` (choose + abandon branches)
- [ ] `can_begin_mantling_sheogorath` trigger updated to accept `jyggalag_ascendant`
  as equivalent gate (alongside existing `jyggalag_champion`)
- [ ] Event files created:
  `mantling_jyggalag_events.txt`, `sheogorath_echo_events.txt`,
  `necromancer_third_way_events.txt`
- [ ] Progress_check dispatch updated in `walking_ways_events.txt`
- [ ] Localization added to `walking_ways_l_english.yml`
- [ ] No new on_actions registration needed (all three paths run through the existing
  `walking_ways.progress_check` engine registered at weight 5)


---

## §21 Nerevarine: Race-Agnostic Prophecy / Multi-Spirit Lineage / Shezarrine Convergence

### 21.1 Lore Basis — The Nerevarine Is a Soul, Not a Race

The Nerevarine system previously restricted `claim_nerevarine_prophecy` to characters with
`has_culture = dunmer_culture`.  This restriction has been **removed** in favour of a
lore-accurate race-agnostic model.

**Canonical evidence:**
- In TES III: Morrowind the player character — the canonical Nerevarine — can be any of the
  ten playable races.  The game explicitly calls them "the outlander" and "the stranger from
  across the water" in Ashlander prophecy variants.
- The Nerevarine prophecy concerns the *soul* of Lord Nerevar Indoril reincarnating, not
  a product of Dunmeri blood.  Azura's domain is love, dusk, dawn, and *the perseverance of
  souls across time*.  She does not require that soul to wear Dunmer flesh.
- [SOURCE: TES III:Morrowind — Nerevarine Prophecies, Azura shrine dialogue;
  UESP Lore:Nerevarine]

**Mechanical change:**
- `has_culture = dunmer_culture` removed from `claim_nerevarine_prophecy.is_shown`
- Non-Dunmer claimants fire `nerevarine.300` (Outlander Nerevarine) 3 days after claiming,
  granting `nerevarine_outlander_recognition` modifier for 5 years while the Ashlanders
  slowly accept the "stranger the prophecies spoke of"
- The on_character_death notification now sends `nerevarine.001` to all `azura_champion`
  rulers rather than only Dunmer rulers

---

### 21.2 Multi-Spirit Nerevarine — Simultaneous Vessels

**Canonical evidence:**
- In TES III: Morrowind the player can meet the *souls of past Nervarines* inside
  Dagoth Ur's citadel at Red Mountain.  These souls are not erased — they persist as
  conscious echoes in Azura's realm (Moonshadow).  Lord Nerevar's soul has lived many
  lives, and the earlier incarnations remain.
- This implies the soul is not a singular baton passed from one dying body to the next:
  it is a vast essence that can manifest in more than one living body simultaneously,
  because the earlier incarnations' echoes prove the soul does not simply "move on".
- [SOURCE: TES III:Morrowind — past Nerevarine encounters; UESP Lore:Azura/Moonshadow]

**Mechanical change:**
- New global variable `active_nerevarine_spirit_count` tracks simultaneous living vessels
- `claim_nerevarine_prophecy.is_shown` has an additional OR branch: a second claimant may
  rise while a first is still alive, provided `active_nerevarine_spirit_count < 3`
  (capped at three simultaneous spirits — matching the number of past Nerevarine souls
  visible in-game in Morrowind)
- On claim: `active_nerevarine_spirit_count += 1`
- On death (nerevarine_marked + not victor/forsaken): `active_nerevarine_spirit_count -= 1`
- `nerevarine_quest_incomplete` is only re-set on death if NO other living Nerevarine
  exists at that moment

---

### 21.3 Lorkhan Resonance — Nerevar, Shor, and the Dead God's Pattern

**The Nerevar-as-Shezarrine question:**

The claim that "Nerevar IS a Shezarrine — therefore the convergence event is redundant" rests on
MK supplementary texts and the 36 Lessons of Vivec (Sermon 1), which names Nerevar **"Pelin-El"**
— "the Star-Made Knight" — a title otherwise used for Pelinal Whitestrake, the confirmed Shezarrine
(UESP Lore:Shezarrine).  This is not coincidence; it encodes identity.  Nerevar carried the same
Lorkhan-resonance that every Shezarrine carries.

However, UESP's canonical Shezarrine article does **not** list Nerevar as a confirmed Shezarrine.
The connection is scholarly inference from the Sermons, not established hard canon.

**Why the convergence is kept (not removed):**

The mechanical distinction is valid precisely because the two traits arrive through different
mythic mechanisms:
- `nerevarine_marked` — Dunmeri/Daedric mechanism (Azura's prophecy, Nerevar's reincarnated soul)
- `shezarrine_vessel` / `dragonborn` — Nordic/Aedric mechanism (Shor's wandering echo, the
  "dead god in the ground")

A character who holds both is **not** simply "a Shezarrine who is also the Nerevarine."  They are
the first living demonstration that the Nerevar soul and the Shor echo are **harmonics of the same
absent god's dispersed essence**, converging from different directions simultaneously.

**Canonical evidence for the resonance framing:**
- 36 Lessons of Vivec, Sermon 1: Nerevar called "Pelin-El" (the Star-Made Knight), the same title
  as Pelinal Whitestrake (Shezarrine).  Pattern identity across mythic vessels.
  [SOURCE: The 36 Lessons of Vivec, Sermon 1; UESP Lore:Shezarrine]
- Wulf (avatar of Talos, himself a confirmed Shezarrine) appears to the Nerevarine in TES III.
  Two Lorkhan-resonant beings coexist on Nirn simultaneously — the resonance is not exclusive.
  [SOURCE: TES III:Morrowind — Wulf NPC; UESP Lore:Talos/Tiber Septim]
- The Dragonborn (UESP: "a Shezarrine") empties Shor's throne in Sovngarde only upon physically
  entering — while alive on Nirn the throne does not stand empty.
  [SOURCE: TES V:Skyrim — Sovngarde; UESP Lore:Shor; UESP Lore:Dragonborn/Shezarrine]

**Framing update (§21 revision):**
The previous implementation framed this as *"two separate souls meeting in one body"* — inaccurate
even before accepting the MK reading.  The correct framing is: the character recognises that the
Nerevar soul and the Shor echo are drawn to the same pattern — not competing souls, but
**harmonics of the same dead god's dispersed essence**, arriving from different mythic angles.

**Dragonborn co-gate (§21 addition):**
`dragonborn` (EK2's trait) is now co-equal to `shezarrine_vessel` in all convergence triggers
(`nerevarine.310` option B, `nerevarine.321`).  The Dragonborn is canonically Shezarrine-class;
excluding them from the mechanic was an oversight.

**Mechanical implementation:**

#### 21.3.1 Trigger Conditions
- A character with BOTH `nerevarine_marked` AND (`shezarrine_vessel` OR `dragonborn`) triggers the
  Lorkhan Resonance chain
- Either at claim-time (via `nerevarine.310` option B) or later (via the yearly hidden
  event `nerevarine.321` which checks `nerevarine_marked + (shezarrine_vessel OR dragonborn) + NOT
  nerevarine_shezarrine_convergence + NOT nerevarine_shezarrine_declined`)

#### 21.3.2 Events
| Event ID | Name | Notes |
|---|---|---|
| nerevarine.310 | Vision of Past Incarnations | Fires for all new claimants; Shezarrine/Dragonborn gets option B |
| nerevarine.320 | Lorkhan Resonance | Acknowledges the harmonic pattern; **does NOT set Shor's throne empty** (see §22) |
| nerevarine.321 | Hidden yearly check | Catches characters who gain shezarrine_vessel or dragonborn after claiming |

#### 21.3.3 Outcome — Option A (Acknowledge Resonance)
- Sets `character_flag = nerevarine_shezarrine_convergence`
- **NOTE (§22 correction):** does NOT set `shors_throne_nerevarine` — that flag is only set
  when the Shezarrine physically enters Sovngarde (`shezarrine.sovngarde_entry`)
- Applies `dual_soul_convergence_modifier` (martial +4, prowess +4, monthly_piety +8,
  prestige_gain_mult +30%, stress_gain_mult +10%, health +0.5)

#### 21.3.4 Outcome — Option B (Decline / Hold Nerevar Pattern Only)
- Sets `character_flag = nerevarine_shezarrine_declined` (prevents re-prompting)
- Character retains `shezarrine_vessel`/`dragonborn` and `nerevarine_marked` with no convergence
- Lore-valid: the character carries both resonances but consciously holds only Nerevar's pattern

#### 21.3.5 New Modifiers — §21
| Modifier | Duration | Applied by |
|---|---|---|
| `nerevarine_outlander_recognition` | 1825 days (5 years) | nerevarine.300 |
| `nerevar_soul_witnessed` | 730 days (2 years) | nerevarine.310 option A |
| `dual_soul_convergence_modifier` | 99 years (effectively permanent) | nerevarine.320 option A |

---

### 21.4 Integration Checklist — §21

- [x] `has_culture = dunmer_culture` removed from `claim_nerevarine_prophecy.is_shown`
- [x] Multi-spirit OR branch added to `claim_nerevarine_prophecy.is_shown` (spirit count removed per §22)
- [x] `active_nerevarine_spirit_count` global var incremented on claim
- [x] `active_nerevarine_spirit_count` global var decremented on death (on_actions)
- [x] `nerevarine_quest_incomplete` only re-set if no other living Nerevarine
- [x] nerevarine.001 notification sent to azura_champion rulers (all races)
- [x] nerevarine.300 (Outlander Nerevarine) added — fires for non-Dunmer claimants
- [x] nerevarine.310 (Vision of Past Incarnations) added — fires for all claimants
- [x] nerevarine.320 (Lorkhan Resonance) — convergence kept; reframed as harmonic resonance, not two-souls-meeting; 36 Lessons Sermon 1 "Pelin-El" citation added
- [x] nerevarine.321 (hidden yearly check) — trigger updated: `shezarrine_vessel OR dragonborn`
- [x] nerevarine.310 option B — trigger updated: `shezarrine_vessel OR dragonborn`
- [x] `dragonborn` (EK2 trait) added as co-equal Lorkhan-resonance carrier in all convergence triggers
- [x] `nerevarine_outlander_recognition` modifier added to lore_races_modifiers.txt
- [x] `nerevar_soul_witnessed` modifier added to lore_races_modifiers.txt
- [x] `dual_soul_convergence_modifier` modifier added to lore_races_modifiers.txt
- [x] `shors_throne_nerevarine` — CORRECTED in §22: now tied to Sovngarde entry, not convergence
- [x] Localization updated: nerevarine.320 title/desc reframed; nerevarine.310.b, tooltips updated

---

## §22 Shor's Throne Correction / Multi-Pretender Nerevarine

### 22.1 Shor's Throne Lore Correction

**Lore issue identified:** The original §21 implementation set `shors_throne_nerevarine` whenever a
Nerevarine+Shezarrine convergence vessel lived on Nirn.  This was lore-inaccurate.

**Corrected lore:** Shor's throne in Sovngarde stands empty **only when a Shezarrine physically
enters Sovngarde** — not merely because a Shezarrine exists on Nirn.  In TES V: Skyrim, the
Dragonborn (a Shezarrine) enters Sovngarde alive to fight Alduin; at that moment the throne is
empty because Shor's avatar has crossed into the hall.  Simply walking Nirn as a Shezarrine does
not vacate the throne.
[SOURCE: TES V:Skyrim — Sovngarde questline; UESP Lore:Shor; UESP Lore:Sovngarde]

**Mechanical change:**
- `nerevarine.320` option A no longer sets `shors_throne_nerevarine`
- New event `shezarrine.sovngarde_entry` fires yearly for `shezarrine_vessel` characters with
  `shor_marked` OR `martial >= 22`; option A sets `shors_throne_nerevarine` +
  `shezarrine_sovngarde_entered` character flag
- `on_character_death` hook clears `shors_throne_nerevarine` when `shezarrine_sovngarde_entered`
  character dies (both inside and outside the `nerevarine_marked` gate)

### 22.2 Multi-Pretender Nerevarine System

**Design principle:** Any number of characters may simultaneously hold `nerevarine_marked`.  Only
the first to achieve `nerevarine_victor` (complete the prophecy at Red Mountain) is the True
Nerevarine.  All others become **False Incarnates** (`nerevarine_pretender` trait), consistent with
TES lore in which multiple claimants tried and failed before the canonical Incarnate succeeded.
[SOURCE: UESP Lore:Nerevarine — Incarnate history; TES III:Morrowind Ashlander lore]

#### 22.2.1 Pre-cursor Auto-Marking (`nerevarine.340`)
- Fires as a **hidden yearly event** when `dagoth_ur_awakening_possible = yes` but **before**
  `dagoth_ur_awakened = yes` — the prophecy stirs as a precursor to the Sleeper's waking
- Eligible characters: `azura_champion`, OR Dunmer with `piety >= 150` + `learning >= 8`
- Mean-time-to-happen: 4 months (Dunmer modifier 0.5×, azura_champion modifier 0.75×)
- Effect: grants `nerevarine_marked`, increments `active_nerevarine_spirit_count`, fires
  `nerevarine.300` (if non-Dunmer) and `nerevarine.310` (all claimants)
- Multiple characters across all races are auto-marked simultaneously, creating a field of
  competing Incarnates before Dagoth fully wakes

#### 22.2.2 No Spirit-Count Cap
- The `active_nerevarine_spirit_count < 3` cap is removed from `claim_nerevarine_prophecy`
- Any number of vessels may simultaneously hold the mark
- `claim_nerevarine_prophecy` is still available after `dagoth_ur_awakened = yes` for characters
  not auto-marked by nerevarine.340

#### 22.2.3 Exotic-Race Additional Requirements
Characters of non-standard Tamrielic cultures (Dremora, Dwemer automata, etc.) must additionally
satisfy one of: `piety >= 600`, `learning >= 16`, or `has_trait = shezarrine_vessel`.
This represents Azura's greater scepticism toward extra-planar or non-mortal vessels — not an
absolute bar, but a higher threshold of spiritual attunement.

#### 22.2.4 Pretender System (`nerevarine.330` / `nerevarine.331`)
When `nerevarine_victor` is achieved (kagrenac.030 option A):
- `nerevarine.330` (hidden) fires immediately: notifies every other `nerevarine_marked` ruler
- `nerevarine.331` "Pretender's Reckoning" fires for each: two options (acceptance or denial),
  both result in `remove_trait = nerevarine_marked`, `add_trait = nerevarine_pretender`,
  decrement `active_nerevarine_spirit_count`

#### 22.2.5 New Trait — `nerevarine_pretender`
| Attribute | Value |
|---|---|
| Category | personality |
| is_good | no |
| learning | +3 |
| monthly_piety_gain_mult | -0.15 |
| monthly_prestige_gain_mult | -0.10 |
| stress_gain_mult | +0.10 |

### 22.3 Integration Checklist — §22

- [x] `nerevarine.320` option A: removed `set_global_flag = shors_throne_nerevarine`
- [x] `nerevarine.320` comment + description updated — clarifies throne NOT emptied here
- [x] `shezarrine.sovngarde_entry` event added to `shezarrine_events.txt`
- [x] `shezarrine.sovngarde_entry` registered in `on_yearly_pulse` (weight 2)
- [x] `on_character_death`: updated to check `shezarrine_sovngarde_entered` for throne clear
- [x] Second death-hook block added for non-Nerevarine Shezarrines who entered Sovngarde
- [x] `nerevarine_pretender` trait added to `nerevarine_traits.txt`
- [x] Spirit-count cap removed from `claim_nerevarine_prophecy.is_shown`
- [x] `nerevarine_pretender` NOT gate added to `claim_nerevarine_prophecy.is_shown`
- [x] Exotic-race extra requirements added to `claim_nerevarine_prophecy.is_valid`
- [x] `nerevarine.330` (hidden victor broadcast) added to `nerevarine_events.txt`
- [x] `nerevarine.331` (Pretender's Reckoning) added to `nerevarine_events.txt`
- [x] `nerevarine.340` (pre-cursor auto-mark) added to `nerevarine_events.txt`
- [x] `nerevarine.330` trigger hooked into `kagrenac.030` option A
- [x] `nerevarine.340` registered in `on_yearly_pulse` (weight 3)
- [x] Localization added: `.330.a`, `.331.*`, `.340.a`, `nerevarine_pretender_desc`,
      `shezarrine.sovngarde_entry.*`, `nerevarine_dual_soul_tt`, updated `shors_throne_vacant_tt`

---

## §23 Canonical Nerevarine Vessels — One Per Race, Spawned New

### 23.1 Design Principle

**The Problem:** §22's `nerevarine.340` auto-marks *existing rulers* as potential Incarnates.
But the user requirement says the canonical vessels should be **spawned as new characters**, not
converted from existing people.  The lore supports this: the Nerevarine prophecy describes a
stranger who "comes from across the water" — an outsider, not a current power-holder.

**Solution:** A one-shot event `nerevarine.345` spawns exactly **ten new NPC characters**, one
for each Morrowind playable race (Dunmer, Nord, Imperial, Breton, Redguard, Altmer, Bosmer, Orc,
Khajiit, Argonian), as landless wanderers at the moment the prophecy stirs.  Each receives
`nerevarine_marked` and the `nerevarine_canonical_vessel` character flag.

**Lore basis:**
- TES III: Morrowind allows the player to be any of the ten standard races — Azura's prophecy
  is not racially exclusive.  The lore calls these claimants "the stranger" regardless of
  ethnicity.
- The competing Incarnates in the game's lore (Conoon Chodala, Wulf, etc.) show that multiple
  candidates arise simultaneously.  The §23 system makes this visible in gameplay.
- Players using any race remain free to claim via `claim_nerevarine_prophecy`; they join the
  existing field of canonical vessels as an extra prophetic aspect.
  [SOURCE: TES III:Morrowind — Nerevarine Prophecies, character creation races; UESP Lore:Nerevarine]

### 23.2 Mechanical Implementation

#### 23.2.1 Guard Flag
`nerevarine_canonical_spawned` global flag — set on first fire, prevents re-spawning.

#### 23.2.2 Trigger Conditions for `nerevarine.345`
| Trigger | Value |
|---|---|
| `dagoth_ur_awakening_possible` | `yes` |
| `has_global_flag = nerevarine_canonical_spawned` | `NOT` (one-shot) |
| `has_global_flag = dagoth_ur_defeated` | `NOT` |
| `has_culture` | `dunmer_culture` |
| `is_ruler` | `yes` |
| `is_adult` | `yes` |

#### 23.2.3 Characters Spawned
| Race | Culture | Religion | Age |
|---|---|---|---|
| Dunmer | `dunmer_culture` | `azura_faith` | 25 |
| Nord | `nord_culture` | `eight_divines` | 24 |
| Imperial | `imperial_culture` | `eight_divines` | 26 |
| Breton | `breton_culture` | `eight_divines` | 23 |
| Redguard | `redguard_culture` | `eight_divines` | 27 |
| Altmer | `altmer_culture` | `eight_divines` | 22 |
| Bosmer | `bosmer_culture` | `green_pact_faith` | 21 |
| Orc | `orc_culture` | (culture default) | 28 |
| Khajiit | `khajiit_culture` | (culture default) | 24 |
| Argonian | `argonian_culture` | (culture default) | 26 |

Each character also:
- Sets `nerevarine_canonical_vessel` character flag
- Gets `add_trait = nerevarine_marked`
- Increments `active_nerevarine_spirit_count`
- Non-Dunmer fire `nerevarine.300` (Outlander revelation, days = 2)
- All fire `nerevarine.310` (Vision of Past Incarnations, days = 3–5)

#### 23.2.4 Player as Extra Aspect
The existing `claim_nerevarine_prophecy` decision (§21–§22) remains available to player
characters of any race.  A player who claims is an additional potential Incarnate on top of
the ten spawned vessels.  The pretender system (§22: nerevarine.330/331) means only the
first to achieve `nerevarine_victor` is recognised — all others become False Incarnates
regardless of whether they were canonical spawned NPCs or player claimants.

### 23.3 Integration Checklist — §23

- [x] `nerevarine.345` (canonical vessel spawn) added to `nerevarine_events.txt`
- [x] `nerevarine.345` registered in `on_yearly_pulse` (weight 2)
- [x] Event header in `nerevarine_events.txt` updated to document §23
- [x] Localization added: `nerevarine.345.a`, `nerevarine_canonical_vessel_flag_tt`

---

## §24 Akulakhan — The God-Builder's Project

### 24.1 Design Intent

**The Problem:** The existing Dagoth Ur systems cover his awakening, his influence over sleepers,
the Nerevarine prophecy, and the Borrowed Divinity (Heart-tapping) path.  None of them address
his *deeper* ambition: he is not merely a god who seized the Heart for himself — he is
*constructing* a new god.

**The Request:** Add an investigative event chain for characters who search for information on
Dagoth Ur's plan to *make* a god, not just *be* one.

**Lore Basis:**
- Akulakhan (also rendered Akullakhan) is the "Second Numidium" — a brass god-construct that
  Dagoth Ur has been building beneath Red Mountain using the Heart of Lorkhan as its divine
  engine.
- The corprus disease serves a dual purpose: spreading Dagoth Ur's influence *and* harvesting
  mortal essence to feed the construct's growth.  Sixth House sleepers are building material as
  much as they are agents.
- The Nerevarine's canonical task in TES III: Morrowind includes destroying Akulakhan (in the
  construct chamber beneath Red Mountain) *before* reaching the Heart of Lorkhan — the construct
  is a separate target from Dagoth Ur himself.
- Key canonical sources: Dagoth Ur's own dialogue in TES III; the construct chamber as an
  in-game location; UESP Lore:Akulakhan; the in-game text "The Plan of Dagoth Ur."
  `[CANON — TES III: Morrowind main quest; UESP Lore:Akulakhan]`

### 24.2 Event Chain — `akullakhan` Namespace

#### 24.2.1 Discovery Trigger (`akullakhan.000`)
Hidden yearly event.  Fires for rulers who have:
- `dagoth_ur_awakened = yes`
- NOT `akullakhan_known` character flag
- NOT `dagoth_ur_defeated` global flag
- Any of: `sixth_house_cultist` / `ash_devotee` / `numidium_researcher` / (`dwemer_scholar`
  AND `learning >= 16`)

25% chance per year once eligible.  On fire: sets `akullakhan_known` flag, triggers
`akullakhan.001` in 7 days.

#### 24.2.2 Event 1 — "The Walking God" (`akullakhan.001`)
The character notices that corprus essence is being *directed* toward Red Mountain, not simply
spreading from it.  Sixth House whispers reference "the Walking God approaching completion."

**Options:**
- A: Investigate → gains `akullakhan_scholar` trait, triggers `akullakhan.010` in 180 days
- B: Refuse → chain ends; small piety gain

#### 24.2.3 Event 2 — "The God-Builder's Design" (`akullakhan.010`)
Deep investigation confirms: something vast is being assembled beneath Red Mountain.  Man-formed,
enormous, built of consolidated divine essence and bound brass.  Anyone who has studied Numidium
recognises the shape of the ambition.

**Options:**
- A: Name it → sets `akullakhan_design_confirmed` flag, triggers `akullakhan.020` in 180 days
- B: Step back → sets flag, small piety gain; prestige loss (knowledge without courage)

#### 24.2.4 Event 3 — "Akulakhan — The Second Numidium" (`akullakhan.020`)
Full revelation.  The character learns the construct's name, purpose, and the fact that
destroying Dagoth Ur alone will not end the threat — Akulakhan must also be destroyed.

**Option A — Warn the Nerevarine:**
- Sets `akullakhan_revealed` character flag
- Fires `akullakhan.021` for all living `nerevarine_marked` rulers (notification)
- Grants prestige +300, piety +200, `akullakhan_revelation_modifier` (5 years)

**Option B — Keep the Secret:**
- Character carries the knowledge alone
- Grants learning +2, `akullakhan_revelation_modifier` (10 years — longer burden)

**Option C — Serve the God-Builder** (requires `sixth_house_cultist` OR `ash_devotee`):
- Sets `akullakhan_sixth_house_role` character flag
- `ash_devotee` XP gain; piety loss −200; stress relief −20

#### 24.2.5 Nerevarine Notification (`akullakhan.021`)
Fires for each living `nerevarine_marked` ruler when Option A is chosen.  They learn of
Akulakhan's existence and receive `akullakhan_revelation_modifier` (5 years).

### 24.3 New Trait — `akullakhan_scholar`

| Attribute | Value |
|---|---|
| Category | lifestyle |
| is_good | (unset — neutral) |
| learning | +3 |
| intrigue | +2 |
| monthly_piety_gain_mult | −0.10 |
| stress_gain_mult | +0.10 |

**Lore justification:** Knowing Dagoth Ur's deeper plan is forbidden knowledge — the Tribunal
would name it heresy, the Imperial Cult would call it sedition.  The learning bonus reflects the
sharpening that comes from holding a truth too large for comfort.  The stress reflects that
same truth's weight.

### 24.4 New Modifier — `akullakhan_revelation_modifier`

| Attribute | Value |
|---|---|
| learning | +2 |
| stress_gain_mult | +0.05 |

Applied for 5 years (warning path) or 10 years (secret-keeper path).  The weight of the knowledge
outlasts the initial discovery.

### 24.5 Integration Checklist — §24

- [x] `mod/events/akullakhan_events.txt` created with events `akullakhan.000` – `.021`
- [x] `akullakhan_scholar` trait added to `mod/common/traits/dagoth_ur_traits.txt`
- [x] `akullakhan_revelation_modifier` added to `mod/common/modifiers/lore_races_modifiers.txt`
- [x] `akullakhan.000` registered in `lore_races_on_actions.txt` `on_yearly_pulse` (weight 2)
- [x] `mod/localization/english/akullakhan_l_english.yml` created with UTF-8 BOM
- [x] Cross-reference updated in `dagoth_ur_traits.txt` DEFINES + REFERENCED BY sections

---

## §24 Extension: The Dwemer Path through Akulakhan

### 24.6 Lore Research Summary (Online Search)

The following lore was researched to ensure accuracy of the Dwemer path:

**Kagrenac's Purpose — What the Dwemer Were Actually Trying to Do**
- Kagrenac was not building Numidium as a weapon, though it became one. His goal was to use the Heart of Lorkhan as a divine power source to transform the Dwemer as a people — to cross the threshold the et'Ada had crossed when they became the Aedra, but through mortal craft rather than self-sacrifice.
- The in-game book "Kagrenac's Motivations" (ESO) explicitly frames this as the Dwemer attempting to transcend the mortal condition entirely through tonal engineering applied to a divine object.
- The Dwemer rejection of divinity was not atheism in the modern sense but a rejection of the *supernatural* as a category. They believed divinity was a material property that could be reproduced by sufficiently advanced craft. `[CANON — ESO: Kagrenac's Motivations; UESP Lore:Tonal Architecture]`

**The Dwemer Disappearance — Did Kagrenac Succeed or Fail?**
- The canonical text is ambiguous. UESP: "What happened to the Dwemer is officially listed as 'Unknown.' Multiple theories exist." The most debated: Kagrenac accidentally destroyed all Dwemer souls; Kagrenac successfully incorporated all Dwemer souls into the Heart/Numidium; the Dwemer transcended to a different plane.
- The "they transcended/became distributed" theory is supported by some in-game texts and is mechanically interesting. It is flagged as `[CONTESTED]` in this mod's lore files.
- For this mod: the Dwemer path treats the "succeeded but too soon" reading as the scholar's conclusion from studying Akulakhan, while explicitly labelling it as the scholar's interpretation, not absolute canonical truth. This is lore-accurate.
  `[SOFT CANON — UESP Lore:Dwemer Theories; in-game book: "Ruins of Kemel-Ze"]`

**Numidium vs Akulakhan — The Key Difference**
- Numidium was powered by the **Mantella** (a bottled soul — Zurin Arctus's). This mediated the relationship between construct and divine power; the Mantella was a heart-substitute.
- Akulakhan is powered directly by the **Heart of Lorkhan** — no mediation. This is both more powerful and more dangerous. It also means Akulakhan is inseparable from the Heart in the same way Dagoth Ur himself is.
- From a Dwemer scholarly perspective: Kagrenac's method used the Tools (Wraithguard, Keening, Sunder) as mediators. Direct Heart connection (Dagoth Ur's method) was the thing Kagrenac's Tools were designed to *avoid* — the backlash risk was too great. Dagoth Ur's survival of direct contact was unique.
  `[CANON — TES III: Morrowind; UESP Lore:Numidium; UESP Lore:Heart of Lorkhan]`

**Why a Dwemer Scholar Interprets Akulakhan Differently**
- For a Sixth House cultist: Akulakhan is Dagoth Ur's masterwork, a vessel for his divine will.
- For a Nerevarine: Akulakhan is a second target to destroy.
- For a Dwemer scholar/tonal architect: Akulakhan is **Kagrenac's methodology applied to the wrong goal** — proof that the method works, but subverted to serve divinity rather than transcend it. The scholar sees genius and tragedy simultaneously.
  `[MOD INTERPRETATION — consistent with UESP lore]`

### 24.7 New Events — Dwemer Path (akullakhan.030–.032)

#### 24.7.1 Eligibility Gate — Option D of `akullakhan.020`
Requires: `tonal_architect` OR (`dwemer_scholar` AND `numidium_researcher`).
Sets `akullakhan_dwemer_path_chosen` character flag. Triggers `akullakhan.030` in 90 days.

#### 24.7.2 `akullakhan.030` — "Kagrenac's Purpose, Revisited"
The scholar articulates the core insight: Dagoth Ur walked through Kagrenac's door backwards.
Numidium was designed to negate the gods; Akulakhan is designed to project one.
**Both options** lead to `akullakhan.031` in 180 days. Stress cost. Learning gain.

#### 24.7.3 `akullakhan.031` — "The Proof of Concept"
Deep structural analysis of Akulakhan's tonal framework implies a contested but lore-grounded
reading of the Dwemer Disappearance: the resonance at Red Mountain was not catastrophic failure
but successful incorporation. Numidium was to have been the Dwemer's collective body after the
distributed resonance. The project was activated before the vessel was complete.
**Both options** lead to `akullakhan.032` in 180 days.
Stress cost +25 (option A) or +10 (option B). Learning gain.

#### 24.7.4 `akullakhan.032` — "The Living Blueprint"
**Four-option culmination** based on where the character is:

| Option | Gate | Mechanical Effect |
|---|---|---|
| A — Already on Path | `is_on_path_tonal_architecture` | Grants `ww_tonal_milestone_gestalt` flag (and `nullify` if learning ≥ 22); `akullakhan_dwemer_insight_modifier` (10 years) |
| B — Not on path, eligible | `can_begin_path_tonal_architecture` | Calls `begin_path_tonal_architecture`; grants `principles` + `construct` milestone flags pre-loaded; modifier |
| C — Heart Scholar | `heart_scholar_ascendant` trait | Self-recognition event (Heart draw = Akulakhan scaled down); learning +4, stress +40 |
| D — Record only | (any) | Learning +1, prestige +200; modifier 5 years |

### 24.8 New Modifier — `akullakhan_dwemer_insight_modifier`

| Attribute | Value |
|---|---|
| learning | +4 |
| stewardship | +2 |
| monthly_prestige_gain_mult | +0.10 |

Applied 5–10 years depending on option. Represents absorbed knowledge of Kagrenac's actual methodology decoded from Akulakhan's structure.

### 24.9 Integration Checklist — §24 Dwemer Path Extension

- [x] Option D added to `akullakhan.020` (gate: `tonal_architect` OR `dwemer_scholar`+`numidium_researcher`)
- [x] `akullakhan_dwemer_path_chosen` character flag documented in file header
- [x] `akullakhan.030` ("Kagrenac's Purpose, Revisited") added to `akullakhan_events.txt`
- [x] `akullakhan.031` ("The Proof of Concept") added to `akullakhan_events.txt`
- [x] `akullakhan.032` ("The Living Blueprint") added — 4-option culmination with tonal path integration
- [x] `akullakhan_dwemer_insight_modifier` added to `lore_races_modifiers.txt`
- [x] All new event/option localization added to `akullakhan_l_english.yml`
- [x] Event ID range updated in file header: `akullakhan.000 – .032`
- [x] §24 design notes updated with full lore research summary

---

## 25. Path G — Tonal Architecture ("The Wrong Walking Way")

> **Added:** Session 2026-04-08 — Formalises the existing `tonal_arch` event system
> (already implemented in `mod/events/tonal_arch_events.txt` and
> `mod/common/traits/walking_ways_traits.txt`) as the canonical **Path G** of the
> Walking Ways framework.

---

### 25.1 Lore Foundation

The Dwemer believed reality itself was song — a tonal structure that could be understood,
measured, and rewritten by sufficiently precise mortal craft. Their apex expression of this
was Kagrenac's attempt to use the Heart of Lorkhan as a divine power source: not to worship
a god, but to *reproduce* godhood through tonal engineering.

The outcome of their collective attempt is the single most important data point in the
mod: the entire Dwemer race vanished simultaneously at the moment of Red Mountain's
resonance. Whether this was catastrophic failure or unprecedented success remains
explicitly contested (see §24.6 for the scholarly analysis). What is not contested is the
method: they used tonal architecture to attempt a fundamental rewrite of what Dwemer *were*.

This path is **"the wrong Walking Way"** not because it is evil, but because it is
*materialist*: it treats the ascent to divinity as an engineering problem rather than a
spiritual or metaphysical one. It is the most dangerous path precisely because it might
be the most *correct* in its theory — the Dwemer understood more about tonal reality than
any other civilization — and yet it ended in mass erasure.

**Lore sources:** UESP Lore:Tonal Architecture; UESP Lore:Numidium; ESO: Kagrenac's
Motivations; TES III: Morrowind (Kagrenac's Tools, Red Mountain)

---

### 25.2 Path Identity

**Key:** `ww_tonal_architecture`
**Flag:** `ww_tonal_architecture_active`
**Apex Trait:** `tonal_transcendent`
**Path type:** Path G (standalone — neither Mantling nor CHIM; materialist transcendence)
**Namespace:** `tonal_arch`
**Event file:** `mod/events/tonal_arch_events.txt`

---

### 25.3 Requirements

```
can_begin_path_tonal_architecture trigger:
    has_trait = tonal_architect
    learning >= 18
    stewardship >= 14
    NOT = { has_character_flag = ww_tonal_architecture_completed }
    NOT = { has_character_flag = walking_ways_path_active }
```

The `tonal_architect` trait gate represents years of prior Dwemer ruin study
(see `dwemer_ruins_traits.txt` tree). This path cannot begin without genuine mastery
of Dwemer tonal theory, enforced through the trait system rather than a stat check alone.

---

### 25.4 Milestones (6 total, 2 per rank)

| # | Flag Key | Event | Lore Action |
|---|---|---|---|
| 1 | `ww_tonal_milestone_principles` | `tonal_arch.rank1` | Mastered tonal resonance theory — the foundation |
| 2 | `ww_tonal_milestone_construct` | `tonal_arch.milestone_construct` | Built and tuned a functioning animunculus |
| 3 | `ww_tonal_milestone_frequency` | `tonal_arch.milestone_frequency` | Identified the Tower's tonal frequency |
| 4 | `ww_tonal_milestone_resonator` | `tonal_arch.milestone_resonator` | Affected another soul through tonal means (controlled test) |
| 5 | `ww_tonal_milestone_gestalt` | `tonal_arch.milestone_gestalt` | Achieved a 12-second partial collective merge with willing subjects |
| 6 | `ww_tonal_milestone_nullify` | `tonal_arch.milestone_nullify` | Nullified own tonal signature and reconstructed it — partial rehearsal |

The `ww_tonal_milestone_gestalt` flag is also used by the §24 Akulakhan system
(see §24.7.4 Option A) as a milestone advance reward, providing a natural
crossover point between the two systems.

---

### 25.5 Rank Events

| Rank | Event ID | Trigger |
|---|---|---|
| Intro | `tonal_arch.intro` | Path begins (`is_on_path_tonal_architecture = yes`) |
| Rank 1 | `tonal_arch.rank1` | 2 milestones — "Seeking: tonal resonance theory mastered" |
| Rank 2 | `tonal_arch.rank2` | 4 milestones — "Striving: animunculus and frequency work" |
| Rank 3 | `tonal_arch.rank3` | 6 milestones — "Threshold: the gestalt attempt" |
| Apotheosis | `tonal_arch.apotheosis` | Rank 4 — 50% death, 50% `tonal_transcendent` |
| Failure | `tonal_arch.failure` | Failure branch at apotheosis — erasure death |

---

### 25.6 Apotheosis — The 50% Death

At apotheosis (`tonal_arch.apotheosis`), the character attempts to **nullify their own
tonal song and rewrite it from the ground up**. This is the full Dwemer attempt.

- **50% chance — success:** `complete_path_tonal_architecture` fires; character gains
  `tonal_transcendent` trait (learning +8, stewardship +6, monthly prestige +15,
  stress_gain_mult −30%). The reconstructed self is genuinely different.
- **50% chance — failure:** `tonal_arch.failure` fires; character is killed via
  `death_reason = death_chim_erasure`. As the Dwemer: gone without a trace.

The 50/50 death chance is the highest of any Walking Ways path and is intentional.
The Dwemer all tried this. They are gone.

---

### 25.7 Apex Trait — `tonal_transcendent`

```
tonal_transcendent = {
    category = fame
    learning    = 8
    stewardship = 6
    monthly_prestige = 15
    stress_gain_mult = -0.30   # the reconstructed self does not bruise easily
    flag = tonal_transcendent
}
```

The reconstructed self experiences stress differently — not because it is stronger, but
because the individual song has been rewritten with that awareness built in. The learning
and stewardship reflect that this character now *understands* the architecture of reality
in a way no other path achieves.

---

### 25.8 Path G vs. Path F — How They Combine

Path F (§19, Kagrenac's Ambition) and Path G are **complementary approaches to the same
Dwemer question**, and they interact at a specific convergence point.

#### The Core Philosophical Difference

| | **Path F — Kagrenac's Ambition** | **Path G — Tonal Architecture** |
|---|---|---|
| **Philosophy** | Borrow the Heart of Lorkhan's existing divine power through Kagrenac's Tools | Reproduce divine power through tonal engineering from first principles |
| **Root question** | Can mortals *access* the divine? | Can mortals *manufacture* the divine through craft? |
| **Heart relationship** | Dependent — Route A degrades when Heart is severed (§19.10) | Studies Heart as proof of concept, not power source |
| **Kagrenac's role** | His Tools (Wraithguard/Keening/Sunder) mediate Heart contact | His tonal theory *is* the goal |
| **Timeline gate** | Requires `dagoth_ur_awakened = yes` | No divine object dependency |
| **Apotheosis risk** | Route A: slow degradation; Route B: death when Heart departs | Always 50% instant death |

#### The Convergence Point — Akulakhan

Akulakhan is the physical intersection of both paths because it uses the Heart of Lorkhan
(Path F's domain) animated by Kagrenac's tonal engineering methodology (Path G's domain).
This is documented in §24 and enforced in `akullakhan.032`:

- A **Path G walker** (`is_on_path_tonal_architecture = yes`) who studies Akulakhan receives
  `ww_tonal_milestone_gestalt` — a full milestone advance — because the construct demonstrates
  Kagrenac's methodology at scale. Option A of `akullakhan.032` also grants
  `ww_tonal_milestone_nullify` if learning ≥ 22.
- A **Path F Route A** apex (`heart_scholar_ascendant` trait) who studies Akulakhan gets
  Option C of `akullakhan.032`: self-recognition that their own Heart-draw relationship is
  Akulakhan reproduced at mortal scale — learning +4, stress +40.
- A character eligible for Path G but not yet on it gets Option B of `akullakhan.032`:
  `begin_path_tonal_architecture` is called directly, with `principles` and `construct`
  milestone flags pre-loaded. Akulakhan itself can *start* Path G.

#### The Philosophical Arc (If You Walk Both)

Path F is an *empirical shortcut* that reveals what Path G is trying to reach the long way.

> "If you have already borrowed divinity through the Heart and survived, you have touched
> the boundary between mortal and divine through direct contact. The Dwemer wanted to
> *manufacture* that boundary-crossing. You have already crossed it. Path G asks: can you
> reproduce what you already experienced — not by borrowing it, but by rewriting yourself
> into it?"

A character who survives Path F (via CHIM escape from starvation — §19.10b — or Route A
without full dissolution) is mechanically ideal to begin Path G: their reservoir experience
with the Heart gave them empirical data that 10,000 years of tonal research could not.

**Note on mutual exclusion:** A character cannot be on Path F *and* Path G simultaneously
(the `walking_ways_path_active` gate prevents it), but they may complete one and begin the
other sequentially. The design intends this: Path F teaches you the material truth of divine
power; Path G asks you to engineer it yourself.

---

### 25.9 Integration Status

| Component | Status |
|---|---|
| `mod/events/tonal_arch_events.txt` | ✅ Implemented |
| `tonal_transcendent` apex trait in `walking_ways_traits.txt` | ✅ Implemented |
| `tonal_architect` prerequisite trait in `dwemer_ruins_traits.txt` | ✅ Implemented |
| `ww_path_tonal_architecture_active` modifier | ✅ Implemented |
| Scripted triggers: `is_on_path_tonal_architecture`, `can_begin_path_tonal_architecture` | ✅ Implemented |
| Scripted effects: `complete_path_tonal_architecture`, `abandon_path_tonal_architecture` | ✅ Implemented |
| §24 Akulakhan crossover (`akullakhan.032` Options A/B/C) | ✅ Implemented |
| `mod/localization/english/tonal_arch_l_english.yml` | ✅ Implemented |
| §25 design documentation | ✅ This section |


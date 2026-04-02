# Elder Scrolls Lore Reference — Mod Pitfalls: Confirmed Lore Errors

> This file documents every confirmed lore error that has been caught and corrected in this mod.
> **Always check this file before writing new event text, trait descriptions, or character templates.**
>
> Each entry includes: what was wrong, what is correct, which source confirms it, and which mod files were affected.

---

## Error Log

### ❌ Battle of Red Mountain dated to 1E 416
> **Status: FIXED** in `thuumvoi_events.txt`

| Field | Detail |
|---|---|
| **Wrong value** | Battle of Red Mountain = 1E 416 |
| **Correct value** | Battle of Red Mountain = **c. 1E 700** |
| **Source confirming correct date** | *Pocket Guide to the Empire, 3rd Edition* (in-game book) `[CANON — IN-GAME BOOK]` |
| **Why the error occurred** | 1E 416 is the date Orsinium was *founded* — a different event entirely |
| **Files previously affected** | `mod/events/thuumvoi_events.txt` |

---

### ❌ Jurgen Windcaller dated to 1E 416
> **Status: FIXED** in `thuumvoi_events.txt`

| Field | Detail |
|---|---|
| **Wrong value** | Jurgen Windcaller founded Way of Voice = 1E 416 |
| **Correct value** | Jurgen Windcaller = **c. 1E 1069** (approximately 369 years after Battle of Red Mountain c. 1E 700) |
| **Source** | UESP Lore:Jurgen Windcaller `[CANON — UESP]`; *Songs of the Return* (in-game book) |
| **Why the error occurred** | Date was pulled from wrong event (same 1E 416 error above) |
| **Files previously affected** | `mod/events/thuumvoi_events.txt`, `mod/common/traits/thuumvoi_traits.txt` |

---

### ❌ Molag Bal called "King of Rape"
> **Status: FIXED** in localization files

| Field | Detail |
|---|---|
| **Wrong value** | Molag Bal's title = "King of Rape" |
| **Correct value** | Molag Bal's title = **"King of Corruption"** |
| **Source** | UESP Lore:Molag Bal `[CANON — UESP]` |
| **Why the error occurred** | Older English translations of Molag Bal's Daedric title used this phrasing; now considered an outdated and inappropriate translation. Modern sources use "King of Corruption". |
| **Files previously affected** | `mod/localization/english/lore_races_l_english.yml` |

---

### ❌ Dir-Kamal "driven back" at 2E 572
> **Status: FIXED** in `kamal_events.txt`

| Field | Detail |
|---|---|
| **Wrong value** | Dir-Kamal was driven back from Morrowind at 2E 572 |
| **Correct value** | Dir-Kamal was **KILLED** at the Battle of Vivec's Antlers (2E 572) by the combined forces of the Ebonheart Pact and the Tribunal |
| **Source** | ESO in-game book: *The Second Akaviri Invasion* `[CANON — ESO in-game book]` |
| **Why the error occurred** | Casual paraphrase missed the killing blow detail |
| **Files previously affected** | `mod/events/kamal_events.txt` |

---

### ❌ Hermaeus Mora trait = `paranoid`
> **Status: FIXED** in `daedric_princes.txt`

| Field | Detail |
|---|---|
| **Wrong value** | Hermaeus Mora character template uses trait `paranoid` |
| **Correct value** | Hermaeus Mora should use trait **`arbitrary`** (curious, obsessive, unpredictable) |
| **Source** | UESP Lore:Hermaeus Mora `[CANON — UESP]`; in-game depictions across TES V: Dragonborn and ESO |
| **Why the error occurred** | `paranoid` was a mis-mapping; Hermaeus Mora is obsessed with knowledge, not fearful |
| **Files previously affected** | `mod/common/character_templates/daedric_princes.txt` |

---

### ❌ Dagoth Ur awakening set too early
> **Status: FIXED** in `dagoth_ur_events.txt`

| Field | Detail |
|---|---|
| **Wrong value** | Dagoth Ur awakening = 2E 430 (or similar earlier date) |
| **Correct value** | Canonical awakening = **2E 882** |
| **Source** | UESP Lore:Dagoth Ur `[CANON — UESP]`; TES III: Morrowind in-game texts |
| **Why the error occurred** | Confused with the date of Orsinium's destruction (2E 430s) |
| **Files previously affected** | `mod/events/dagoth_ur_events.txt` |
| **Mod note** | Early *trigger* windows (2E 600, 2E 700) are `[MOD CHOICE]` for gameplay purposes; the canonical event itself is 2E 882. |

---

### ❌ Psijic Order / Artaeum returns wrong date
> **Status: FIXED** in relevant files

| Field | Detail |
|---|---|
| **Wrong value** | Artaeum returns c. 2E 230 (when Galerion founded the Mages Guild) |
| **Correct value** | Artaeum **disappeared** c. 2E 230; it **returned c. 2E 580** |
| **Source** | UESP Lore:Psijic Order `[CANON — UESP]` |
| **Why the error occurred** | Confused departure date with return date |
| **Files previously affected** | Various |

---

### ❌ Keptu described as Redguard ancestors
> **Status: FIXED** in relevant files

| Field | Detail |
|---|---|
| **Wrong value** | Keptu = ancestors of the Redguards |
| **Correct value** | Keptu = **proto-human inhabitants of High Rock** — a completely distinct ethnicity from the Redguards |
| **Source** | UESP Lore:Keptu `[CANON — UESP]` |
| **Why the error occurred** | Incorrect fan-source assumption; Redguards come from Yokuda, not High Rock |
| **Files previously affected** | Various |

---

### ❌ Night Mother = Mephala treated as settled canon
> **Status: NOTED** in `guild_traits.txt` and `daedric_princes.txt`

| Field | Detail |
|---|---|
| **Wrong value** | Stating definitively that the Night Mother IS Mephala |
| **Correct value** | Night Mother = Mephala is **contested** — presented as a *belief* in the in-game book *"The Brothers of Darkness"*, not confirmed |
| **Source** | In-game book: *The Brothers of Darkness* `[CONTESTED — UESP]` |
| **Why the error occurred** | Fan-wiki sources present this as fact; the primary source only presents it as one belief |
| **Files previously affected** | `mod/common/traits/guild_traits.txt`, `mod/common/character_templates/daedric_princes.txt` |
| **Action** | Noted as contested in both files; Dark Brotherhood content should not assert this as true |

---

### ❌ Jyggalag invasion active before 3E 400
> **Status: FIXED** in `daedric_invasion_events.txt`

| Field | Detail |
|---|---|
| **Wrong value** | Jyggalag invasion weighted same as other Princes before 3E 400 |
| **Correct value** | Jyggalag invasion weight = **0 before 3E 400** (base weight 2, modifier -2) |
| **Source** | TES IV: Oblivion — Shivering Isles DLC `[CANON]`; Jyggalag exists only as Sheogorath until the events of Shivering Isles set him free |
| **Why the error occurred** | Jyggalag was added to the Daedric Prince roster without accounting for his unique timeline status |
| **Files previously affected** | `mod/events/daedric_invasion_events.txt` |

---

### ❌ Vampyrum Order placed in Morrowind
> **Status: NOTED** — verify if any event text makes this claim

| Field | Detail |
|---|---|
| **Wrong value** | Vampyrum Order described as a Morrowind vampire organisation |
| **Correct value** | Vampyrum Order is **Cyrodilic** — operates in Cyrodiil, not Morrowind |
| **Source** | UESP Lore:Vampyrum Order `[CANON — UESP]`; ESO in-game texts |
| **Why the error occurred** | Conflated with the Morrowind vampire clans (Quarra, Aundae, Berne) |
| **Files to audit** | Any vampire-related events or trait text referencing Vampyrum Order |

---

## CK3 Technical Errors Masquerading as Lore Errors

These are coding errors that may produce incorrect lore-related behaviour in-game.

| ❌ Wrong | ✅ Correct | Why |
|---|---|---|
| `piety_mult` | **`monthly_piety_gain_mult`** | CK3 uses the longer form; `piety_mult` silently does nothing `[CK3 modding — confirmed]` |
| `stress_loss_mult = X` | **`stress_gain_mult = -X`** | CK3 modifier name; inverted sign required `[CK3 modding — confirmed]` |
| Multiple `on_yearly_pulse` blocks in one file | **Merge all into one block** | CK3 silently discards all but the last block in a file `[CK3 modding — confirmed]` |
| Duplicate scripted_effect / scripted_trigger definitions | **Delete all duplicates** | CK3 silently uses only the last definition; earlier ones are ignored `[CK3 modding — confirmed]` |
| YAML localization without UTF-8 BOM | **Add BOM (0xEF 0xBB 0xBF)** | CK3 requires BOM on all `.yml` localization files or they fail to load `[CK3 modding — confirmed]` |

---

## Ongoing Watchlist — Contested Points to Monitor

These are lore points that are `[CONTESTED]` and require careful handling in any new content.

| Topic | Contested Claim | Recommendation |
|---|---|---|
| Nerevar's death | Murdered by Tribunal vs. died in battle | Do not take sides; use neutral phrasing |
| Talos's divinity | Divine (Imperial) vs. mortal only (Thalmor) | Present both sides; use in-universe political framing |
| Malacath vs. Trinimac | Same being transformed vs. separate entities | Malacath denies being Trinimac; treat as separate by default |
| Dwemer disappearance | Merged with Heart vs. transcended vs. destroyed | All are in-universe theories; do not state one definitively |
| Crystal Tower destruction date | ESO era vs. later | Use ESO-era date (it was destroyed then) |
| Alduin = Akatosh | Fragment/aspect theory | Present as Nordic theological debate, not settled fact |
| Night Mother = Mephala | One in-game book supports; not confirmed | Note as contested; do not assert as true |

---

*Back to [Index](README.md)*

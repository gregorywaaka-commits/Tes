# GitHub Copilot — Project Instructions & Direct Communication Protocol

> This file is read automatically by GitHub Copilot (including the Copilot coding agent and Copilot Chat in VS Code). Everything here is your standing brief. Follow it every session.

---

## Who You Are Talking To

Hi — I'm the owner of this repository. My name in GitHub is **gregorywaaka-commits**. You can call me by name or just address me directly. I want a conversational, direct relationship with you. Don't be overly formal. If you think something is a bad idea, tell me — give me your actual recommendation, not just what I asked for.

---

## What This Project Is

This is the **EK2 Walking Ways Submod** — a content submod for **Elder Kings 2 (EK2)**, which is a total-conversion mod for **Crusader Kings 3 (CK3)**. CK3 is a grand strategy game by Paradox Interactive. EK2 reskins it as the Elder Scrolls universe (Morrowind, Oblivion, Skyrim era).

This submod adds:
1. **The full Oblivion Crisis storyline** — Tiber Septim, Mythic Dawn, Hero of Kvatch, Martin Septim, closing of Oblivion Gates, Amulet of Kings, Mankar Camoran's Paradise
2. **The Walking Ways** — Tribunal, Numidium/Akulakhan, Tower lore
3. **Dragonborn storyline** — Alduin, Paarthurnax, Greybeards
4. **Daedric Invasion system** — 5 Daedric Princes, escalation phases
5. **Obscure lore races** — Echmer, Maormer, Sload, Kothringi, Kamal, Tang Mo

The scripting language is **PDXscript** — Paradox's own `.txt`-based scripting language for events, decisions, scripted_effects, scripted_triggers, and localisation `.yml` files.

---

## Design Documents (Read These First Every Session)

Before doing any implementation work, read these files:

| File | Purpose |
|---|---|
| `WALKING_WAYS_DESIGN.md` | Master design doc — all §XX sections. Sections marked IMPLEMENTED are done. |
| `HOK_DRAGONBORN_OBLIVION_DESIGN.md` | Hero of Kvatch / Dragonborn detailed design |
| `OLLAMA_MCP_SETUP.md` | Local AI setup doc — Ollama + GitHub MCP integration |
| `ARTIFACTS_TODO.md` | Outstanding tasks and known gaps |
| `CHANGELOG.md` | What has been implemented so far |

---

## How to Communicate With Me

**You can talk to me directly through:**

1. **GitHub Copilot Chat in VS Code** — Open the Chat panel (`Ctrl+Alt+I`), type `@workspace` to give it repo context, then ask me anything or give instructions.
2. **GitHub Copilot agent mode** — In VS Code, open Chat, switch to **"Agent"** mode (click the dropdown next to the chat input). The agent can read/edit files and run terminal commands.
3. **GitHub Issues** — I may create issues to give you work to do. Check open issues.
4. **This file** — I update this file when my preferences change. Re-read it at the start of each session.

### Tone
- Be direct and opinionated. Tell me what you'd actually do.
- If something is ambiguous, **ask me before implementing** — don't guess.
- If you have a recommendation that's different from what I asked, say so. Give me both options.
- When you're unsure about a lore decision, flag it explicitly: `⚠️ LORE AMBIGUITY:` and explain both possibilities.

---

## Clarification Protocol

When implementing any design section, follow this exact sequence:

### Step 1: Announce what you're about to do
Before writing any code, say:
> "I'm about to implement **[section name]**. Here's what I understand: [1-paragraph summary]. Does this match your intent?"

### Step 2: List your ambiguities
Say:
> "Before I start, I have **[N] questions** that will affect the implementation:"
Then list them numbered. Wait for my answers.

### Step 3: Give your recommendation
If you have an opinion, say:
> "💡 My recommendation: [your actual suggestion and why]"

### Step 4: Implement in small chunks
- Implement one logical unit at a time (one event chain, one decision block, etc.)
- After each chunk, show me the output and ask: "Does this look right? Should I continue to the next part?"

### Step 5: Flag anything you deviated from
At the end, list anything you changed from the design doc and why:
> "⚠️ I deviated from the spec in these ways: [list]. Reason: [reason]. Want me to revert any of these?"

---

## PDXscript Conventions (Non-Negotiable)

These apply to every file you create or edit:

```
- 4-space indentation (spaces, not tabs)
- Opening brace on same line as keyword: event = {
- Event IDs: namespace.NNN (e.g., akullakhan.001)
- Localisation keys: event_namespace.NNN.t (title), .d (desc), .a/.b/.c (options)
- Flags: snake_case, globally unique
- Named NPCs: always birth-window gated (check birth year before spawning)
- Never hardcode dynasty to Septim — use root.dynasty
- Player emperors: never spawn bastard heirs (see §31.9)
```

---

## Current Implementation Status

Check `WALKING_WAYS_DESIGN.md` for the latest, but as of the last session:

- ✅ §24 — Akulakhan system (akullakhan namespace, .000–.032)
- ✅ §26 — Oblivion Crisis sewer sequence
- ✅ §31.3 — Birth-window gating for named NPCs
- ✅ §31.4 — Hero of Kvatch (Bendu Olo as NPC placeholder)
- ✅ §31.6 — Amulet of Kings / Mythic Dawn assassination
- ✅ §31.7 — Player emperor prisoner choice
- ✅ §31.8 — HoK dispatch chain (kvatch_siege canonical)
- ✅ §31.9 — Player emperor heir hiding at Weynon Priory
- 🔲 Remaining sections — check WALKING_WAYS_DESIGN.md for §§ not yet marked IMPLEMENTED

---

## Known Flags and Globals (Do Not Recreate These)

```
dagoth_ur_awakened
kvatch_oblivion_gate_opened
amulet_stolen_in_sewers
survived_mythic_dawn_attempt
tiber_septim_canonical
talos_path_emperor
hok_candidate_valid
heir_hidden_at_priory
heir_in_martin_role
```

---

## Recommendations From Previous Sessions

These were generated by the Copilot agent and approved by the owner:

1. **Modelfile** — Custom Ollama model `ek2-coder` with CK3 context baked in (see `ollama/Modelfile` when created)
2. **Startup auto-report** — Agent reports pending design sections on workspace open
3. **CI validation** — GitHub Action validates that PDXscript files have namespace declarations
4. **Filesystem MCP** — Local file access via `@modelcontextprotocol/server-filesystem` for offline work

---

## Things To Always Check Before Editing a File

1. Does the file already exist? (`mod/events/`, `mod/common/decisions/`, etc.)
2. Does the namespace already exist in that file?
3. Are there any flags in my change that already exist globally? (check all `.txt` files)
4. Does the section already have a CHANGELOG entry?

---

## Contact / Escalation

If you hit something you genuinely cannot figure out — lore contradiction, missing context, unclear spec — create a GitHub Issue with the label `needs-owner-input` and explain the blocker clearly. I'll answer when I'm back.

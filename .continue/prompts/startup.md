# VS Code Startup — Dufus Inbox

When this workspace opens, run the following automatically. Do not ask for permission to proceed through these steps — just do them.

## Step 1 — Process all pending Dufus prompts

Look in `.continue/prompts/incoming/` for any `.md` files (ignore `.gitkeep`).

**If files are found:**

For EACH file found, run it as a completely **independent, separate agent task**. Do not carry context or state between files.

For each file:
1. Read the file
2. Check the `Agent mode:` header line:
   - If `standalone-new-task` → execute it independently, from scratch
   - If `context-for-issue: #N` → this is extra context for a previous task; find the original prompt file for issue #N (if present) or note it as context, then execute with both pieces of information
3. Execute the prompt exactly as written — announce your plan, state assumptions, produce output
4. When done, move the file to `.continue/prompts/done/` (create the folder if it doesn't exist)

**Do not ask "which one should I work on?" — work through all pending files, one at a time, each as a fresh agent.**

**If no files are found**, continue to Step 2.

---

## Step 2 — Summarise recent Dufus activity

Look in `.continue/prompts/done/` for `.md` files (ignore `.gitkeep`).

- List up to the 5 most recently modified files by filename (the filename encodes the issue number and slug)
- For each, show just the filename — no need to re-read contents
- Say: "📁 **Recent Dufus activity (done/):** [list, or 'none yet']"

This is a summary only — do NOT re-execute any of these files.

---

## Step 3 — Report mod implementation status

Read `WALKING_WAYS_DESIGN.md` and scan for sections.
- Count sections marked as `IMPLEMENTED`
- Count sections NOT yet marked `IMPLEMENTED`
- Report: "📊 **Mod status:** [N] sections implemented, [M] pending."
- List the 3 most recently implemented sections
- List the next 3 pending sections by document order

---

## Step 4 — Check for open `ai-request` issues

Using the GitHub MCP tool, check for open issues in `gregorywaaka-commits/Tes` with labels `ai-request`, `waiting-for-clarification`, or `ready-for-vscode`.

If any exist:
- List them with titles and issue numbers
- Say: "📱 **Open Dufus requests on GitHub:** [list]"
- Note which ones are `waiting-for-clarification` (need your answers) vs `ready-for-vscode` (prompt already sent, watch for incoming file)

---

## Step 5 — Ready message

Say:
> "✅ Ready. Inbox clear. What would you like to work on?"

---

*To re-run manually, type: `run startup`*
*To force-process a specific prompt file, type: `run .continue/prompts/incoming/<filename>`*

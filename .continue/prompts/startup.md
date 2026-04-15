# VS Code Startup — Dufus Inbox Check

When this workspace opens, run the following automatically:

## Step 1 — Check for incoming prompts from Dufus

Look in `.continue/prompts/incoming/` for any `.md` files (ignore `.gitkeep`).

If files are found:
- List them with their filenames
- Say: "📬 **Dufus has [N] prompt(s) waiting for you:**"
- For each file, read the first 5 lines and show the title/request summary
- Ask: "Which one should I work on first? (Say the filename or number, or 'all' to queue them all)"

If no files are found, continue to Step 2.

## Step 2 — Report current mod implementation status

Read `WALKING_WAYS_DESIGN.md` and scan for sections.
- Count sections marked as `IMPLEMENTED`
- Count sections NOT yet marked `IMPLEMENTED`
- Report: "📊 **Mod status:** [N] sections implemented, [M] pending."
- List the 3 most recently implemented sections
- List the next 3 pending sections by document order

## Step 3 — Check for open `ai-request` issues

Using the GitHub MCP tool, check for open issues in `gregorywaaka-commits/Tes` with labels `ai-request` or `waiting-for-clarification`.

If any exist:
- List them with titles and issue numbers
- Say: "📱 **You have [N] open Dufus requests on GitHub:** [list]"
- Remind: "Answer the clarification questions and comment `/proceed` to send them here."

## Step 4 — Ready message

Say:
> "✅ Ready. What would you like to work on? (You can ask about the design doc, implement a section, or I'll work on the first incoming prompt if you say 'go'.)"

---

*This prompt runs automatically on workspace open. To re-run it manually, type: `run startup`*

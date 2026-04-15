# Ollama + GitHub MCP Integration — Full Design & Implementation Document

> **For the VS Code AI agent:** This document contains everything needed to set up a local Ollama AI assistant that is fully connected to this GitHub repository via the Model Context Protocol (MCP). Read every section, then create every file listed in the **Implementation Checklist** at the bottom. Do not skip any step.

---

## Table of Contents

1. [What We Are Building](#1-what-we-are-building)
2. [Architecture Overview](#2-architecture-overview)
3. [Component Explanations](#3-component-explanations)
4. [Prerequisites](#4-prerequisites)
5. [Step-by-Step Implementation](#5-step-by-step-implementation)
   - 5.1 Install Ollama
   - 5.2 Pull the Model
   - 5.3 Install the GitHub MCP Server
   - 5.4 Install Continue.dev in VS Code
   - 5.5 Configure Continue.dev (`config.json`)
   - 5.6 Add GitHub Personal Access Token
   - 5.7 Add `.continue/prompts/` System Prompt
   - 5.8 Test the Connection
6. [Configuration Files — Full Contents](#6-configuration-files--full-contents)
7. [Recommended Extras](#7-recommended-extras)
8. [Troubleshooting](#8-troubleshooting)
9. [Implementation Checklist](#9-implementation-checklist)

---

## 1. What We Are Building

**Goal:** A local AI coding assistant (running entirely on your machine via Ollama) that:

- Has **live read/write access to this GitHub repository** (issues, files, commits, PRs) via the Model Context Protocol (MCP).
- Is **always listening** for questions inside VS Code via Continue.dev.
- Knows the full context of this project (EK2 submod for CK3).
- Can answer questions, write code, and create/update files in this repo without leaving VS Code.

**Why this matters for this project:**  
This repository contains large, complex design documents (`WALKING_WAYS_DESIGN.md`, `HOK_DRAGONBORN_OBLIVION_DESIGN.md`) and CK3 mod script files. An AI assistant wired directly to the repo can read those docs and help implement new sections, check consistency with existing flags, and generate new event files — all locally without sending your code to a cloud.

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    YOUR MACHINE                      │
│                                                      │
│  ┌──────────────┐     MCP Protocol    ┌───────────┐ │
│  │  Continue.dev │ ◄──────────────── ► │  GitHub   │ │
│  │  (VS Code)    │                     │  MCP      │ │
│  │               │                     │  Server   │ │
│  └──────┬────────┘                     └─────┬─────┘ │
│         │  OpenAI-compatible API             │        │
│         │  (localhost:11434)                 │ HTTPS  │
│  ┌──────▼────────┐                     ┌─────▼─────┐ │
│  │    Ollama     │                     │  GitHub   │ │
│  │  (local LLM)  │                     │  REST API │ │
│  │               │                     │           │ │
│  └───────────────┘                     └───────────┘ │
└─────────────────────────────────────────────────────┘
```

**Data flow:**
1. You type a question or command in VS Code (Continue.dev chat panel).
2. Continue.dev sends the message to Ollama (local, port 11434).
3. If the model needs GitHub data (read a file, list issues, etc.), Continue.dev calls the GitHub MCP Server as a tool.
4. The GitHub MCP Server fetches the data from GitHub's API using your Personal Access Token.
5. The result is injected into the model's context, and Ollama generates the response.
6. The response appears in your VS Code chat panel.

**Nothing leaves your machine except API calls to GitHub using your own token.**

---

## 3. Component Explanations

### Ollama
Ollama is a free, open-source tool that runs large language models (LLMs) locally on your machine. It exposes an OpenAI-compatible HTTP API on `http://localhost:11434`. No cloud, no API keys, no cost per token.

**Recommended models for this use case (CK3 modding / scripting):**
| Model | Size | Best For |
|---|---|---|
| `deepseek-coder-v2` | 16GB VRAM | Code generation, event scripting |
| `codellama:13b` | 8GB VRAM | Lighter code tasks |
| `llama3.1:8b` | 5GB VRAM | General Q&A, light tasks |
| `qwen2.5-coder:14b` | 9GB VRAM | Best balance of code + context |

### Model Context Protocol (MCP)
MCP is an open standard (created by Anthropic, adopted across the industry) that lets AI assistants call external tools — like reading GitHub repos, running commands, searching code — in a structured, safe way. Think of it as "plugins for AI."

### GitHub MCP Server (`@modelcontextprotocol/server-github`)
An MCP server that wraps the GitHub REST API. When loaded, it gives the AI these tools:
- `get_file_contents` — read any file in any repo
- `list_issues` / `create_issue` — manage issues
- `list_pull_requests` / `create_pull_request` — manage PRs
- `search_code` — search code across repos
- `create_or_update_file` — write files back to the repo
- `list_commits` / `get_commit` — inspect history
- And more (20+ tools total)

### Continue.dev
A free, open-source VS Code extension that acts as the MCP client and AI chat UI. It connects to your local Ollama model AND to MCP servers simultaneously, routing tool calls as needed. It replaces GitHub Copilot for this workflow.

---

## 4. Prerequisites

Before the agent begins implementation, verify these are true on the user's machine:

| Requirement | Check Command | Required Version |
|---|---|---|
| Node.js | `node --version` | v18 or higher |
| npm | `npm --version` | v9 or higher |
| Git | `git --version` | any recent |
| VS Code | (installed) | 1.85 or higher |
| Sufficient RAM | Task Manager | 8GB+ free recommended |
| Sufficient VRAM/RAM for model | — | 5GB+ for smallest model |

---

## 5. Step-by-Step Implementation

### 5.1 Install Ollama

**macOS / Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
Download the installer from https://ollama.com/download and run it.

After install, verify:
```bash
ollama --version
```

Ollama starts as a background service automatically. It listens on `http://localhost:11434`.

---

### 5.2 Pull the Recommended Model

For this project (CK3 scripting + large design docs), use `qwen2.5-coder:14b` if you have ≥10GB VRAM, otherwise `codellama:13b`:

```bash
# Best choice (good balance of code quality + context window)
ollama pull qwen2.5-coder:14b

# Fallback if VRAM is limited
ollama pull codellama:13b

# Minimum spec fallback
ollama pull llama3.1:8b
```

Test that it works:
```bash
ollama run qwen2.5-coder:14b "Hello, are you working?"
```

Press `Ctrl+D` or type `/bye` to exit the REPL.

---

### 5.3 Install the GitHub MCP Server

Install it globally via npm:
```bash
npm install -g @modelcontextprotocol/server-github
```

Verify install:
```bash
npx @modelcontextprotocol/server-github --help
```

You should see MCP server startup help text.

---

### 5.4 Install Continue.dev in VS Code

1. Open VS Code.
2. Press `Ctrl+Shift+X` (Extensions panel).
3. Search for **"Continue"** (publisher: Continue).
4. Click **Install**.
5. After install, a Continue icon (feather icon) appears in the left sidebar. Click it to open the chat panel.

Alternatively, install via command line:
```bash
code --install-extension continue.continue
```

---

### 5.5 Configure Continue.dev

Continue.dev is configured via `~/.continue/config.json` (global) or `.continue/config.json` (workspace-local, preferred for this project).

**Create the workspace config at `.continue/config.json` in the root of this repository.** Full contents are in [Section 6](#6-configuration-files--full-contents).

The config tells Continue.dev:
- Which Ollama model to use
- That the GitHub MCP server is available as a tool provider
- The system prompt for this project

---

### 5.6 Add GitHub Personal Access Token

The GitHub MCP server needs a PAT to authenticate.

**Create the token:**
1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name it: `ollama-mcp-local`
4. Expiry: 90 days (or No expiration for convenience)
5. Scopes required:
   - `repo` (full repo access — read + write files, issues, PRs)
   - `read:org` (if repo is in an org)
6. Click **Generate token** and copy it immediately.

**Set the environment variable (do NOT put the token in any config file committed to git):**

*macOS / Linux — add to `~/.bashrc` or `~/.zshrc`:*
```bash
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_YOUR_TOKEN_HERE"
```
Then run: `source ~/.bashrc`

*Windows — PowerShell:*
```powershell
[System.Environment]::SetEnvironmentVariable("GITHUB_PERSONAL_ACCESS_TOKEN", "ghp_YOUR_TOKEN_HERE", "User")
```

*Windows — System Properties → Advanced → Environment Variables → User Variables → New.*

**Important:** Restart VS Code after setting the environment variable so Continue.dev inherits it.

---

### 5.7 Create the Project System Prompt

This is what makes the AI "know" about this specific project. Create `.continue/prompts/tes-mod.md` — full contents in [Section 6](#6-configuration-files--full-contents).

---

### 5.8 Test the Connection

1. Open VS Code in this repository folder.
2. Click the Continue.dev icon (feather) in the sidebar.
3. In the chat, type:
   ```
   @github list the files in the root of gregorywaaka-commits/Tes
   ```
4. Continue.dev should call the GitHub MCP tool and return a file listing.
5. Then type:
   ```
   What events are in the akullakhan_events.txt file?
   ```
6. It should read the file from GitHub and answer based on its content.

---

## 6. Configuration Files — Full Contents

> **Agent instruction:** Create every file below exactly as written. Do not modify paths. Files marked `# DO NOT COMMIT` should be added to `.gitignore`.

---

### File 1: `.continue/config.json`
*Path: `<repo-root>/.continue/config.json`*

```json
{
  "models": [
    {
      "title": "Qwen 2.5 Coder (Local)",
      "provider": "ollama",
      "model": "qwen2.5-coder:14b",
      "apiBase": "http://localhost:11434",
      "contextLength": 32768,
      "systemMessage": "You are an expert modder for Crusader Kings 3 (CK3), specifically working on Elder Kings 2 (EK2) — an Elder Scrolls total-conversion mod. You have deep knowledge of CK3 scripting syntax, Paradox event files, localization files, and the Elder Scrolls lore. You assist with implementing design documents, writing new event chains, decisions, scripted effects, and triggers. Always use correct CK3 PDXscript syntax. Reference the WALKING_WAYS_DESIGN.md and HOK_DRAGONBORN_OBLIVION_DESIGN.md files in this repository for established conventions."
    },
    {
      "title": "CodeLlama 13b (Fallback)",
      "provider": "ollama",
      "model": "codellama:13b",
      "apiBase": "http://localhost:11434",
      "contextLength": 16384
    }
  ],
  "tabAutocompleteModel": {
    "title": "Tab Autocomplete",
    "provider": "ollama",
    "model": "qwen2.5-coder:14b",
    "apiBase": "http://localhost:11434"
  },
  "mcpServers": [
    {
      "name": "github",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${env:GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  ],
  "contextProviders": [
    {
      "name": "code",
      "params": {}
    },
    {
      "name": "docs",
      "params": {}
    },
    {
      "name": "diff",
      "params": {}
    },
    {
      "name": "terminal",
      "params": {}
    },
    {
      "name": "problems",
      "params": {}
    },
    {
      "name": "folder",
      "params": {}
    },
    {
      "name": "codebase",
      "params": {}
    }
  ],
  "slashCommands": [
    {
      "name": "edit",
      "description": "Edit highlighted code"
    },
    {
      "name": "comment",
      "description": "Write comments for the highlighted code"
    },
    {
      "name": "share",
      "description": "Export the current chat session to markdown"
    },
    {
      "name": "cmd",
      "description": "Generate a shell command"
    },
    {
      "name": "commit",
      "description": "Generate a git commit message"
    }
  ],
  "allowAnonymousTelemetry": false,
  "docs": [
    {
      "title": "CK3 Modding Wiki",
      "startUrl": "https://ck3.paradoxwikis.com/Modding"
    }
  ]
}
```

---

### File 2: `.continue/prompts/tes-mod.md`
*Path: `<repo-root>/.continue/prompts/tes-mod.md`*

```markdown
# TES Submod Assistant — System Context

You are working on the **EK2 Walking Ways Submod** — a content submod for Elder Kings 2, which is a total-conversion mod for Crusader Kings 3 set in the Elder Scrolls universe.

## Repository: gregorywaaka-commits/Tes

## Project Summary
- **Engine:** CK3 (Crusader Kings 3), Paradox engine — PDXscript
- **Parent mod:** Elder Kings 2 (EK2)
- **Content pillars:**
  1. Daedric Invasion system (Oblivion Gates, 5 Princes, escalation phases)
  2. Obscure lore races (Echmer, Maormer, Sload, Kothringi, Kamal, Tang Mo, etc.)
  3. Walking Ways / Oblivion Crisis storyline (detailed in WALKING_WAYS_DESIGN.md)
  4. Akulakhan / Numidium system (detailed in WALKING_WAYS_DESIGN.md §24)

## Key Files
- `WALKING_WAYS_DESIGN.md` — Master design document, contains all §XX section specs
- `HOK_DRAGONBORN_OBLIVION_DESIGN.md` — Hero of Kvatch / Dragonborn design
- `mod/events/` — All event files (PDXscript .txt)
- `mod/common/decisions/` — Decision files
- `mod/common/scripted_effects/` — Scripted effects
- `mod/common/scripted_triggers/` — Scripted triggers
- `mod/localization/` — English localisation (.yml)

## Scripting Conventions
- Event namespaces match filenames: `akullakhan_events.txt` → namespace `akullakhan`
- Flags use snake_case: `dagoth_ur_awakened`, `kvatch_oblivion_gate_opened`
- All named NPCs are birth-window gated (see §31.3)
- Player emperors never get spawned bastard heirs (see §31.9)

## How to Help
When asked to implement a section, read the relevant §XX from WALKING_WAYS_DESIGN.md first, then generate the correct CK3 PDXscript. Always check for existing flags and event IDs in the codebase before creating new ones.
```

---

### File 3: `.gitignore` addition
*Append these lines to the existing `.gitignore` (or create it if absent):*

```gitignore
# Continue.dev — do not commit user-specific settings
.continue/config.json

# Environment files
.env
.env.local
*.env
```

> **Note:** The `.continue/prompts/` folder SHOULD be committed — it is project context, not secrets. Only `config.json` is excluded because it may contain machine-specific paths.

---

### File 4: `.env.example`
*Path: `<repo-root>/.env.example`*
*This is a template — safe to commit. The real `.env` must NOT be committed.*

```env
# Copy this file to .env and fill in your values.
# .env is gitignored.

# GitHub Personal Access Token for GitHub MCP Server
# Create at: https://github.com/settings/tokens
# Required scopes: repo, read:org
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_YOUR_TOKEN_HERE
```

---

## 7. Recommended Extras

These are additional improvements beyond the minimum setup. The VS Code agent should implement these after the core setup is working.

### 7.1 Ollama Modelfile — Project-Tuned System Prompt

Create a custom Ollama model that bakes the CK3 context directly into the model's system prompt, so you don't need to repeat it in every chat:

**Create `ollama/Modelfile`:**
```dockerfile
FROM qwen2.5-coder:14b

SYSTEM """
You are an expert CK3 modder specializing in Elder Kings 2 (EK2), 
an Elder Scrolls total-conversion mod for Crusader Kings 3.

You know PDXscript syntax perfectly: event blocks, decision blocks,
scripted_effects, scripted_triggers, on_actions, and localization .yml files.

You are working on the Walking Ways submod in the gregorywaaka-commits/Tes
repository. Key design docs: WALKING_WAYS_DESIGN.md, HOK_DRAGONBORN_OBLIVION_DESIGN.md.

Always produce syntactically valid PDXscript. Use existing flags and namespaces
from the codebase rather than inventing new ones.
"""

PARAMETER temperature 0.3
PARAMETER num_ctx 32768
```

Then build it:
```bash
ollama create ek2-coder -f ollama/Modelfile
```

Update `.continue/config.json` to use `ek2-coder` as the model name.

---

### 7.2 GitHub Copilot Instructions File

Create `.github/copilot-instructions.md` — this is read by GitHub Copilot, GitHub Copilot Agent, and any GitHub-native AI tools:

```markdown
# EK2 Walking Ways Submod — AI Assistant Instructions

## Project
CK3 mod — Elder Kings 2 submod. Elder Scrolls universe. PDXscript language.

## Key Conventions
- Event namespaces: match the filename (e.g., `akullakhan` for `akullakhan_events.txt`)
- Flags: snake_case, globally unique names
- All canonical NPCs are birth-window gated (§31.3 of WALKING_WAYS_DESIGN.md)
- Never hardcode dynasty to Septim — use `root.dynasty`
- Player emperors never receive spawned bastard heirs

## Files to Read First
Before making changes, always read:
1. `WALKING_WAYS_DESIGN.md` — master design doc
2. `HOK_DRAGONBORN_OBLIVION_DESIGN.md` — HoK/Dragonborn design
3. The existing `.txt` file in the relevant `mod/` subfolder

## PDXscript Style
- 4-space indentation
- Opening braces on same line as keyword
- One event option per `option = { ... }` block
- Localisation keys: `event_namespace.NNN.t` (title), `.d` (desc), `.a/.b/.c` (options)
```

---

### 7.3 VS Code Workspace Settings

Create `.vscode/settings.json` to configure the editor for PDXscript `.txt` files:

```json
{
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "files.associations": {
    "*.txt": "plaintext"
  },
  "editor.wordWrap": "on",
  "editor.rulers": [120],
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true
  },
  "continue.enableTabAutocomplete": true,
  "search.exclude": {
    "**/*.md": false
  }
}
```

---

### 7.4 MCP Filesystem Server (Read Local Files)

In addition to the GitHub MCP server, add a **filesystem MCP server** so the AI can read your local mod files directly without going through GitHub. This is faster and works offline:

```bash
npm install -g @modelcontextprotocol/server-filesystem
```

Add to `.continue/config.json` under `mcpServers`:
```json
{
  "name": "filesystem",
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "/absolute/path/to/your/Tes/repo"
  ]
}
```

Replace the path with the actual local path to your cloned repo.

---

### 7.5 Automatic Context Loading on Startup

Add a `.continue/prompts/startup.md` file that the agent loads automatically when you open the repo:

```markdown
When I open this workspace, automatically:
1. Read `WALKING_WAYS_DESIGN.md` table of contents and note which sections are marked IMPLEMENTED vs pending.
2. Read `CHANGELOG.md` for the latest changes.
3. Report: "Ready. Latest implemented section: §XX. Pending sections: §YY, §ZZ."
```

This gives you an instant status report every time you start a coding session.

---

### 7.6 GitHub Actions Workflow — Auto-validate PDXscript

Add a simple CI check that validates PDXscript files aren't empty or malformed:

**Create `.github/workflows/validate-mod.yml`:**
```yaml
name: Validate Mod Files

on:
  push:
    paths:
      - 'mod/**'
  pull_request:
    paths:
      - 'mod/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check for empty event files
        run: |
          find mod/events -name "*.txt" -empty -exec echo "ERROR: Empty file: {}" \; -exec exit 1 \;
      - name: Check namespace declarations
        run: |
          for f in mod/events/*.txt; do
            if ! grep -q "namespace" "$f"; then
              echo "WARNING: No namespace declaration in $f"
            fi
          done
          echo "Validation complete."
```

---

## 8. Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `ollama: command not found` | Ollama not installed or not in PATH | Re-run install script, restart terminal |
| Model download stuck | Large file, slow connection | Wait — `qwen2.5-coder:14b` is ~9GB |
| Continue.dev shows "No models available" | Ollama not running | Run `ollama serve` in terminal |
| GitHub MCP tools not appearing in chat | Token not set / server not starting | Check env var: `echo $GITHUB_PERSONAL_ACCESS_TOKEN` |
| `403 Forbidden` from GitHub MCP | Token expired or wrong scopes | Regenerate token with `repo` scope |
| `npx: command not found` | Node.js not installed | Install from https://nodejs.org |
| Context window exceeded | Model's max context too small | Switch to a model with larger context, or use `@codebase` with chunking |
| Ollama crashes on large context | Not enough RAM | Reduce `num_ctx` in Modelfile / config |

---

## 9. Implementation Checklist

> **VS Code Agent:** Work through this list in order. Check off each item as you complete it. If a step fails, note the error and continue to the next step.

### Phase 1: Environment Setup
- [ ] Run `node --version` — confirm Node.js 18+ is installed
- [ ] Run `ollama --version` — if not found, install Ollama from https://ollama.com
- [ ] Run `ollama pull qwen2.5-coder:14b` (or `codellama:13b` if VRAM < 10GB)
- [ ] Run `npm install -g @modelcontextprotocol/server-github`
- [ ] Run `npm install -g @modelcontextprotocol/server-filesystem`
- [ ] Install Continue.dev VS Code extension: `code --install-extension continue.continue`

### Phase 2: Create Config Files
- [ ] Create `.continue/config.json` (contents from Section 6, File 1)
- [ ] Create `.continue/prompts/tes-mod.md` (contents from Section 6, File 2)
- [ ] Create `.continue/prompts/startup.md` (contents from Section 7.5)
- [ ] Append gitignore rules (Section 6, File 3) to `.gitignore` (create if absent)
- [ ] Create `.env.example` (contents from Section 6, File 4)

### Phase 3: Extra Recommended Files
- [ ] Create `ollama/Modelfile` (contents from Section 7.1)
- [ ] Run `ollama create ek2-coder -f ollama/Modelfile`
- [ ] Update `.continue/config.json` model name to `ek2-coder`
- [ ] Create `.github/copilot-instructions.md` (contents from Section 7.2)
- [ ] Create `.vscode/settings.json` (contents from Section 7.3)
- [ ] Update `.continue/config.json` filesystem MCP server path to local repo path (Section 7.4)
- [ ] Create `.github/workflows/validate-mod.yml` (contents from Section 7.6)

### Phase 4: Secrets
- [ ] Create a GitHub PAT at https://github.com/settings/tokens with `repo` scope
- [ ] Set `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable (see Section 5.6)
- [ ] Restart VS Code so it inherits the environment variable

### Phase 5: Verify
- [ ] Open VS Code in this repo folder
- [ ] Open Continue.dev panel (feather icon in sidebar)
- [ ] Type: `@github list the files in gregorywaaka-commits/Tes` — should return file list
- [ ] Type: `Read WALKING_WAYS_DESIGN.md and tell me what section we are currently on` — should summarize the doc
- [ ] Tab autocomplete works when editing a `.txt` file in `mod/events/`

---

## Summary of Files Created by This Setup

```
repo-root/
├── .continue/
│   ├── config.json              ← Continue.dev config (gitignored)
│   └── prompts/
│       ├── tes-mod.md           ← Project context prompt (committed)
│       └── startup.md           ← Startup auto-context (committed)
├── .github/
│   ├── copilot-instructions.md  ← GitHub AI instructions (committed)
│   └── workflows/
│       └── validate-mod.yml     ← CI validation (committed)
├── .vscode/
│   └── settings.json            ← Editor settings (committed)
├── ollama/
│   └── Modelfile                ← Custom model definition (committed)
├── .env.example                 ← Token template (committed)
├── .env                         ← Real token (GITIGNORED, created by user)
└── .gitignore                   ← Updated to exclude config.json and .env
```

---

*Document version: 1.0 — Written 2026-04-15*  
*Author: GitHub Copilot Task Agent*  
*Target agent: Continue.dev + VS Code autonomous agent*

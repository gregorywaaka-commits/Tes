/**
 * dufus-watcher.js
 *
 * Watches .continue/prompts/incoming/ for new .md files dropped by Dufus
 * (via the ai-request-proceed GitHub Action).
 *
 * When a new file arrives:
 *   1. Prints a clear banner to the VS Code terminal panel
 *   2. Opens the file in the VS Code editor (so Continue.dev / Copilot can see it)
 *   3. Prints the "run this" command you can paste into Continue.dev chat
 *
 * The watcher runs continuously in the background while VS Code is open.
 * It uses only Node.js built-ins — no npm install needed.
 *
 * VS Code launches this automatically on folder open (see .vscode/tasks.json).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const incomingDir = path.join(__dirname, '..', '.continue', 'prompts', 'incoming');
const doneDir = path.join(__dirname, '..', '.continue', 'prompts', 'done');
const gitkeep = '.gitkeep';

// Ensure done/ directory exists
if (!fs.existsSync(doneDir)) {
    fs.mkdirSync(doneDir, { recursive: true });
}

function isPromptFile(filename) {
    return filename.endsWith('.md') && filename !== gitkeep;
}

function printBanner(filename) {
    const separator = '='.repeat(60);
    console.log('\n' + separator);
    console.log('📬  DUFUS — NEW PROMPT ARRIVED');
    console.log(separator);
    console.log(`File: ${filename}`);
    console.log(`Path: .continue/prompts/incoming/${filename}`);
    console.log('');
    console.log('To execute in Continue.dev:');
    console.log(`  @file .continue/prompts/incoming/${filename} — run this`);
    console.log('');
    console.log('To execute in Copilot Chat:');
    console.log(`  Read .continue/prompts/incoming/${filename} and run it`);
    console.log(separator + '\n');
}

function showFilePreview(filepath) {
    try {
        const content = fs.readFileSync(filepath, 'utf8');
        const lines = content.split('\n').slice(0, 10);
        console.log('--- Preview (first 10 lines) ---');
        lines.forEach(l => console.log(l));
        console.log('--- End preview ---\n');
    } catch (e) {
        // ignore read errors
    }
}

function tryOpenInEditor(filepath) {
    // Use the VS Code CLI to open the file if available
    try {
        execSync(`code --reuse-window "${filepath}"`, { stdio: 'ignore' });
    } catch (e) {
        // code CLI not available — that's fine, the terminal banner is enough
    }
}

// Check for files already present at startup
const existing = fs.readdirSync(incomingDir).filter(isPromptFile);
if (existing.length > 0) {
    console.log(`\n📬  Dufus inbox: ${existing.length} prompt(s) waiting.\n`);
    existing.forEach(filename => {
        const filepath = path.join(incomingDir, filename);
        printBanner(filename);
        showFilePreview(filepath);
        tryOpenInEditor(filepath);
    });
} else {
    console.log('✅  Dufus inbox: empty. Watching for new prompts...');
}

// Watch for new files
fs.watch(incomingDir, (eventType, filename) => {
    if (!filename || !isPromptFile(filename)) return;

    const filepath = path.join(incomingDir, filename);

    // Only react to new files that actually exist (ignore delete events)
    if (!fs.existsSync(filepath)) return;

    // Small delay to ensure the file is fully written before reading
    setTimeout(() => {
        if (fs.existsSync(filepath)) {
            printBanner(filename);
            showFilePreview(filepath);
            tryOpenInEditor(filepath);
        }
    }, 500);
});

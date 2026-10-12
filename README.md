# O-E Adventure — complete PWA (Android · iPhone · PC)

Installable, offline-ready English learning game with music, sound effects and voice.
A PWA installs **only from a website that uses https://**, so first put these files online (free, 5 minutes), then install from that link.

## Step 1 — Put it online (choose ONE)

**A. Netlify Drop (easiest, no coding)**
1. Unzip this file. Open https://app.netlify.com/drop
2. Drag the whole `O-E-Adventure` folder onto the page. You get an `https://….netlify.app` link.

**B. GitHub Pages**
1. Create a **Public** repository, upload every file (index.html must be at the top level, not inside another folder).
2. Settings → Pages → Deploy from a branch → `main` / `(root)` → Save.
3. Your link: `https://YOUR-NAME.github.io/REPO-NAME/` (wait 1–3 minutes).

**C. Cloudflare Pages / Vercel** — upload the folder; the included `_headers` and `vercel.json` are already set.

## Step 2 — Install from your link

| Device | How |
|---|---|
| **Android (Chrome)** | Open the link → tap **📲 Install app** (or ⋮ → Install app) |
| **iPhone / iPad** | Open the link in **Safari** → Share ⬆️ → **Add to Home Screen** (iOS has no install popup; this is the only way) |
| **Windows / Mac / Linux** | Chrome or Edge → install icon ⊕ in the address bar → Install |
| **Windows without a website** | Run `O-E-Adventure-Setup.bat` (separate file) |

Tap **📲 Install app** inside the game to see an **Install check** (https, manifest, offline engine). If one line shows ❌, that is the reason it will not install.

## Troubleshooting
- Link must start with `https://` (opening `index.html` from a folder can never install).
- After uploading, open the link, wait ~5 seconds, reload once, then install.
- Old version showing? Close and reopen the app twice.
- Music starts after your first tap (browser rule). 🎵 button toggles it.

## Features
22 lessons · 5 question types · Odia ⇄ English · hearts, XP, ranks, badges, streaks · Speed Round · Flashcards · Mistakes Notebook · soft background music · sound effects · text-to-speech · dark mode · offline · backup code for moving progress.

## Files
`index.html` `styles.css` `data.js` `app.js` `audio.js` `sw.js` `offline.html` `manifest.json` `` (icons, screenshots) · hosting helpers: `_headers` `netlify.toml` `vercel.json` `.nojekyll`

## C-BOT AI Tutor (Hybrid mode)

The C-BOT chat panel has an offline fallback and can use online AI when deployed with the included Vercel serverless endpoint (`api/chat.js`). Existing game modules and progress keys are preserved; chat history is stored separately in the browser under `oe-cbot-ai-v1`.

To enable online AI:
1. Deploy this folder to **Vercel** (the static-only GitHub Pages deployment cannot run the API endpoint).
2. In Vercel → Project → Settings → Environment Variables, add `OPENAI_API_KEY` with your secret key. Optionally set `OPENAI_MODEL` (default `gpt-4o-mini`).
3. Redeploy. The browser calls `/api/chat`; the secret key stays on the server and is never shipped to the client.
4. Without internet, or if the API is not configured, C-BOT switches to basic offline practice patterns.

AI use may incur provider charges. Do not publish the API key, and consider setting usage limits at the AI provider. This endpoint includes input limits but production public deployments should also add robust rate limiting / abuse protection before sharing widely.

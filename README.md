# English Adventure v2

A beginner-friendly English learning game (Odia ⇄ English) for GitHub Pages. Installable as a phone/desktop app (PWA), works offline, and needs no build step.

## What's new in v2
**Learning**
- 22 lessons (was 12): Family, Food, Body & Animals, Days, Opposites, Build It!, Plurals, Can/Should/Must, Real-Life Talk, Fix the Mistake
- 5 question types: multiple choice, listening, type the answer, word-arrange sentences, match pairs
- Wrong answers come back at the end of the lesson (second chance)
- Mistakes Notebook, Quick Practice, Speed Round (15 s per question), Flashcards (35 words, with sound)
- English → Odia mode now builds real vocabulary quizzes

**Game feel**
- Combo XP, ranks (Rookie → Legend), 11 badges, daily goals with bonus XP, 7-day streak calendar
- Hearts refill every 20 minutes (or spend 30 XP); Practice never costs hearts
- Confetti, animated robot teacher (tap him!), dark mode

**Sound**
- Soft generative background music (calm chords + gentle bells, no audio files, works offline)
- Sound effects for correct, wrong, combos, badges, rank-up, hearts, flashcards and the speed-round countdown
- Text-to-speech: tap 🔊 to hear any English word or sentence; music lowers while the voice speaks
- Separate music and effects volume sliders in Settings (⚙️)

**App (PWA)**
- New robot icon (regular, maskable and Apple touch icons), install button, home-screen shortcuts (Continue / Quick practice / Flashcards), install-screen screenshots
- Offline support, safe-area/notch aware, sticky top bar, standalone full-screen mode
- Backup / restore code in Settings to move progress between devices

Old v1 progress is kept automatically.

## Files
`index.html` · `styles.css` · `data.js` (lessons, words, badges) · `app.js` (game logic) · `audio.js` (music engine) · `sw.js` (offline) · `manifest.json` · `assets/` (icons, screenshots)

## Run on your PC
Double-click `index.html` to preview (music, voice and offline need a server or HTTPS). Recommended:
```bash
py -m http.server 8000      # then open http://localhost:8000
```

## Publish free with GitHub Pages
1. Create a **Public** repository (e.g. `english-adventure`) and upload everything, with `index.html` at the repository root.
2. **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save.**
3. Open `https://YOUR-USERNAME.github.io/english-adventure/`

## Install as an app
- **Android / Chrome / Edge:** open the site and tap **Install app** (or the browser's install option).
- **iPhone / iPad (Safari):** Share → **Add to Home Screen**.

## Notes
- Music starts after your first tap (browsers block autoplay). Toggle it with the 🎵 button.
- Voice quality depends on the voices installed on the device.
- Progress is stored in this browser. Use Settings → Backup code to move it.
- After you update the files on GitHub, reopen the app once or twice to receive the new version (service worker cache).
- Client-side only: don't put passwords or private data in the repository.

# English Adventure

A separate, beginner-friendly English learning game for GitHub Pages. It includes Odia/English practice, a friendly CSS-drawn robot teacher, levels, multiple-choice quizzes, XP, hearts, streaks, local progress saving, responsive styling, and a service worker for offline caching.

## Run on your Windows PC

### Easiest local preview
1. Extract `English-Adventure.zip`.
2. Open the extracted folder.
3. Double-click `index.html` to preview the game.
4. Note: service-worker offline caching is enabled on a hosted HTTPS site or a local development server, not when opened directly as `file://`.

### Recommended local server (Python)
If Python is installed:
1. Open the `English-Adventure` folder in File Explorer.
2. Click the address bar, type `cmd`, and press Enter.
3. Run:
   ```bash
   py -m http.server 8000
   ```
4. Open `http://localhost:8000` in your browser.
5. Press `Ctrl+C` in the command window to stop the server.

## Publish free with GitHub Pages
1. Sign in at https://github.com.
2. Create a **Public** repository named `english-adventure`.
3. Upload all files and folders from this extracted project. Ensure `index.html` is at the repository root, not inside an extra nested folder.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select branch `main` and folder `/(root)`, then click **Save**.
7. Wait a few minutes. Your URL will look like:
   `https://YOUR-USERNAME.github.io/english-adventure/`

Official guide: https://pages.github.com/

## Important notes
- Progress is stored in this browser on this device. Clearing site data or changing browsers can remove or separate progress. There is no cross-device account or cloud sync in this starter version.
- Offline use starts after the site has been opened online and the app files have been cached. On GitHub Pages, use the HTTPS website URL.
- The reverse-language switch is an initial practice mode; this starter version does not yet have a fully authored Odia translation for every English question. Extend the question data and reverse-answer mapping for complete bilingual coverage.
- The Google Fonts import is optional and needs internet to fetch the fonts; system fallback fonts still work offline.
- The app is an educational starter project, not a copy of Duolingo's branding or assets.
- This is a client-side app. Do not put passwords, private data, API keys, or student-sensitive information in its public repository.

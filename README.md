# GYMLOG — Android-installable workout tracker

## What's included
- `index.html`, `app.js`: the app and your preloaded 8-day routine
- `manifest.webmanifest`: installable app metadata
- `sw.js`: offline caching
- `icon.svg`: app icon

## Install on Android (free, using GitHub Pages)
1. Sign in to GitHub and create a **public** repository named `gymlog`.
2. Upload all files from this folder to the repository's root (not the ZIP itself).
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main`, folder `/ (root)`, then Save.
6. Wait for GitHub Pages to publish. Your address will look like `https://YOUR-USERNAME.github.io/gymlog/`.
7. Open that address in Chrome on your Android phone.
8. Tap Chrome's ⋮ menu → **Install app** or **Add to Home screen** → Install.

The app must be served over HTTPS for installation and offline support. GitHub Pages provides HTTPS automatically.

## Data and backups
Workout data is stored locally in the browser on your phone. It is not uploaded to GitHub or a server. Use **History → Export backup** periodically to save a JSON backup. Clearing Chrome site data or uninstalling/resetting browser storage may erase local workout data.

## Updating the app
Upload replacement files to the same GitHub repository. The service worker cache is versioned; if you change app files, update `gymlog-cache-v1` in `sw.js` to a new name (for example `gymlog-cache-v2`) so installed copies refresh.

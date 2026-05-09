# PEP Tracker — Standalone PWA Test Build

Single-folder, drag-and-drop deployable. Built to confirm the Apple Watch
buzz path works before committing to the full Umbrel build.

## What's in here

```
pep-tracker-pwa/
├── index.html          # PEP tracker app (React via Babel standalone)
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (required to unlock notifications on iOS)
├── apple-touch-icon.png
├── icon-192.png
└── icon-512.png
```

## Deploy in 60 seconds (Netlify Drop)

1. Open https://app.netlify.com/drop in a browser
2. Drag this entire `pep-tracker-pwa` folder onto the page
3. You'll get a URL like `https://random-name.netlify.app` — that's your live PWA over HTTPS

(Cloudflare Pages, Vercel, GitHub Pages all work too. The only requirement is HTTPS.)

## Install on iPhone + verify watch buzz

1. Open the Netlify URL in **Safari** on the iPhone (not Chrome — Chrome on iOS won't surface the right Add-to-Home-Screen flow for PWAs)
2. Tap **Share → Add to Home Screen**
3. Launch the PEP icon from the home screen
4. Tap **Start Session**
5. When prompted, **Allow** notifications
6. In the session header, tap the **⌚** button — this should fire a test notification
7. With your iPhone screen off (or wrist down), the notification should mirror to Apple Watch as a haptic tap

## Troubleshooting

| Symptom | Fix |
|---|---|
| No "Add to Home Screen" option in Safari | Make sure you're on iOS 16.4 or later |
| ⌚ test fires but no watch buzz | iPhone unlocked + screen on = notif goes to phone, not watch. Lock the phone, then test |
| Notification permission dialog never appears | Settings → Notifications → PEP Tracker; or delete the home screen icon and re-add |
| First load is slow | Babel-standalone is ~3MB. Service worker caches it after first load — second launch is instant |
| Audio doesn't play | iOS requires the page to be unmuted in the silent-switch sense. Toggle the iPhone ringer on |

## Limits of this build

- **No history logging.** This standalone build doesn't save sessions anywhere. The post-session screen lets you record pain/notes for manual entry. The Umbrel build will add Postgres + auto-Notion sync.
- **Babel runs in-browser.** Fine for a personal PWA, not what you'd ship to production. The Umbrel build will pre-compile.
- **No Web Push.** Notifications fire while the page is open (foreground or wake-locked). For "phone in pocket, run for 30 min, watch buzzes when interval timer ends", you need Web Push + a backend pushing — that's the Umbrel path.

# Base44 Dev Environment

## Project Overview

A Roblox website recreation. The main site (`Website/`) is an ASP.NET Web Forms project targeting .NET Framework 4.7.2 (Windows/IIS only — cannot run on Linux). The runnable part here is the **VoidVerse** static frontend at `Website/VoidVerse/`.

## What Runs Here

The VoidVerse static SPA is served by nginx on port 3000. It works in demo mode — all state is in `localStorage`, no backend needed.

## Running

```bash
docker compose -f docker-compose.base44.yml up -d
```

Preview: http://localhost:3000

## Architecture

- `Website/` — Classic ASP.NET Web Forms (.NET Framework 4.7.2, Windows-only). Not runnable on Linux.
- `Website/VoidVerse/` — Static HTML/CSS/JS SPA. Served by nginx. This is what runs in the preview.
- `server/VoidVerseApi/` — ASP.NET Core 8.0 API with SQLite + JWT auth. For the Android app, not wired to the web frontend.
- `Assemblies/` — ~60 .NET libraries (Roblox.* namespaces) referenced by the Website project.
- `android/` — Android app (Gradle/Kotlin).

## File Fixes Applied During Setup

The files in `Website/VoidVerse/` were swapped and had trailing garbage:
- `app.js` contained the HTML page → moved to `index.html`
- `README.md` contained the JavaScript app code → moved to `app.js`
- `styles.css` had trailing garbage → cleaned
- `README.md` → restored as documentation

## Notes

- The VoidVerse frontend works in demo mode without any backend. Sign-in/signup buttons open the app with localStorage-based state.
- The ASP.NET Web Forms site requires Windows + IIS + .NET Framework 4.7.2.
- The VoidVerseApi (.NET 8) could be run separately but is not connected to the web frontend's auth.

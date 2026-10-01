# VoidVerse

A static web frontend for the VoidVerse game platform — a Roblox-style universe explorer with avatar customization, economy, quests, and creator tools.

## Running

The app is served as static files via nginx:

```bash
docker compose -f docker-compose.base44.yml up -d
```

The app runs in **demo mode** — all state (avatar, currency, quests, badges) is stored in `localStorage`. No backend is required.

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Main app — auth gate, discover, avatar customizer, economy, quests, badges, portal |
| `lobby.html` | Game lobby with chat and member list |
| `Game.html` | In-game view (standalone) |
| `Studio.html` | Creator tool for publishing instances |
| `account-settings.html` | Account profile, security, privacy, and rewards |
| `creator-dashboard.html` | Creator analytics and game management |
| `terms.html` / `privacy.html` | Legal pages |

## Architecture

- **Frontend**: Vanilla HTML/CSS/JS, no build step. State managed via `localStorage`.
- **Auth**: Demo mode (no backend). When hosted on ASP.NET, `auth-client.js` calls `../Game/VoidVerseAuth.ashx` for live auth.
- **Backend (not required for demo)**: The main Roblox Website is an ASP.NET Web Forms project (Windows/IIS). `server/VoidVerseApi` is a .NET 8 API for the Android app.

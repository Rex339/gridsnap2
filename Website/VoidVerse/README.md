# VoidVerse

A responsive game-platform prototype inside the `gridsnap2` ASP.NET website project.

## Run the static experience

Open `Website/VoidVerse/index.html` directly, or serve the repository with a static file server. Static mode keeps the demo profile in `localStorage`; server authentication is unavailable when the page is opened with `file://`.

## Run live authentication

Live authentication requires the ASP.NET website hosted by IIS/IIS Express:

1. Build the website project with the .NET Framework 4.7.2 developer pack installed.
2. Host the `Website` directory so `Website/Game/VoidVerseAuth.ashx` is reachable.
3. Open `/VoidVerse/index.html` through that host, not directly from disk.
4. Create an account with a 3–20 character username, valid email, and 10–128 character password.
5. Confirm that the session survives a page refresh, then use the sign-out control.

Accounts are stored server-side in `Website/App_Data/VoidVerse/accounts.json` and passwords are stored as BCrypt hashes. Do not commit that file or use this file-backed store as a production database.

## Included systems

- Server-backed VoidVerse signup and sign-in.
- BCrypt password hashing and Forms Authentication sessions.
- Current-user lookup through `Game/GetCurrentUser.ashx`.
- Logout and client session restoration.
- Static demo fallback when the ASP.NET endpoint is unavailable.
- Persistent `localStorage` player profile with 150 TIX and 0 VV Tokens on a new profile.
- Economy rule: exactly 50 TIX is burned for exactly 10 VV Tokens.
- Avatar customization, creator tools, discovery catalog, moderation queue, and multiplayer lobby prototype.

## Verification checklist

- [ ] Build `Website/Roblox.Website.csproj` in Visual Studio/IIS environment.
- [ ] Verify `BCrypt.Net-Next` and `Newtonsoft.Json` resolve from the configured package source.
- [ ] Sign up and verify a record appears in `App_Data/VoidVerse/accounts.json`.
- [ ] Refresh the page and verify the authenticated profile remains active.
- [ ] Sign out and verify the auth gate returns.
- [ ] Verify invalid credentials do not create a session.
- [ ] Move account storage to a real database before production deployment.

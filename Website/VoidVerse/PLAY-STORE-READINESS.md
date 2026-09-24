# VoidVerse release readiness

The web experience now includes a mobile installable shell, offline static-shell caching, a collection catalog, equipable customization items, and an emote wheel launcher.

## Important release status

This repository is **not yet a Play Store submission**. A Play Store release still requires a signed Android App Bundle, a production HTTPS backend, Play Console configuration, store assets, privacy/data-safety declarations, and device testing.

## Recommended Android packaging

1. Serve `Website/VoidVerse` over HTTPS.
2. Package the hosted experience with Capacitor or a small Android WebView shell.
3. Set a unique application ID such as `space.voidverse.app`.
4. Generate a signed `.aab`, enable Play App Signing, and test the release build on physical Android devices.
5. Complete Google Play content rating, Data Safety, privacy-policy, account deletion, and store-listing requirements.

## Product hardening still required

- Move accounts, inventory, emotes, currency, and purchases from localStorage/file JSON to a transactional production database.
- Authorize every inventory and economy mutation on the server.
- Add HTTPS-only cookies, CSRF protection, rate limiting, email verification, recovery, deletion, audit logging, and moderation tooling.
- Add real item art, accessibility testing, crash reporting, automated tests, and a closed Play testing track.

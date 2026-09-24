# VoidVerse product experience

VoidVerse now includes a Roblox-inspired product layer without copying Roblox branding or proprietary UI:

- Dashboard navigation with search and a More menu.
- Discovery filtering for visible experiences.
- Account settings, security, privacy, username changes, and email-gated password reset.
- Experience chat panel connected to the server handler when hosted by ASP.NET.
- Game launch navigation to a live VoidVerse experience route.
- Avatar, economy, Studio, and creator workflows remain available.

This is a VoidVerse implementation, not a clone of Roblox. Production authentication, password reset email delivery, moderation storage, and real-time multiplayer should be connected to a database, identity provider, mail provider, and WebSocket/SignalR service before public release.

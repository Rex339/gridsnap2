<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#090a12" />
  <title>VoidVerse — Play beyond the horizon</title>
  <link rel="stylesheet" href="styles.css" />
  <link rel="manifest" href="manifest.webmanifest" />
</head>
<body>
  <div class="ambient ambient-one"></div>
  <div class="ambient ambient-two"></div>

  <section class="auth-gate" id="authGate">
    <div class="auth-copy">
      <div class="brand-lockup"><span class="brand-mark">✦</span><span>VOID<span>VERSE</span></span></div>
      <p class="eyebrow">THE NEXT PLAYGROUND</p>
      <h1>Build worlds.<br /><em>Find yours.</em></h1>
      <p class="hero-copy">A living universe of games, creators, and impossible ideas.</p>
      <div class="orbit orbit-a"></div><div class="orbit orbit-b"></div>
    </div>

    <div class="auth-card glass-card">
      <div class="auth-tabs">
        <button class="tab active" data-auth="signin">Sign in</button>
        <button class="tab" data-auth="signup">Create account</button>
      </div>

      <div class="auth-form" data-form="signin">
        <p class="eyebrow">WELCOME BACK</p>
        <h2>Return to the Verse</h2>
        <label>Username or email<input id="signinName" type="text" placeholder="e.g. astral_player" /></label>
        <label>Password<input id="signinPassword" type="password" placeholder="••••••••" /></label>
        <button class="primary full" id="signinButton">Enter VoidVerse <span>↗</span></button>
        <p class="form-note" id="signinNote">Demo mode — no account required.</p>
      </div>

      <div class="auth-form hidden" data-form="signup">
        <p class="eyebrow">START YOUR STORY</p>
        <h2>Claim your constellation</h2>
        <label>Choose a username<input id="signupName" type="text" placeholder="e.g. nova_builder" /></label>
        <label>Email address<input id="signupEmail" type="email" placeholder="you@voidverse.space" /></label>
        <label>Create password<input id="signupPassword" type="password" placeholder="••••••••" /></label>
        <button class="primary full" id="signupButton">Create account <span>↗</span></button>
        <p class="form-note" id="signupNote">Your new profile begins with 150 TIX.</p>
      </div>
    </div>
  </section>

  <main class="app-shell hidden" id="appShell">
    <header class="topbar">
      <a class="brand-lockup" href="#top"><span class="brand-mark">✦</span><span>VOID<span>VERSE</span></span></a>
      <nav class="desktop-nav">
        <a class="nav-link active" href="#discover">Discover</a>
        <a class="nav-link" href="#customize">Avatar</a>
        <a class="nav-link" href="#quests">Quests</a>
        <a class="nav-link" href="#studio">Studio</a>
      </nav>
      <div class="top-actions">
        <div class="wallet-pill">
          <span class="tix-dot">T</span><strong id="topTix">150</strong>
          <span class="vv-dot">✦</span><strong id="topVv">0</strong>
        </div>
        <button class="secondary tiny" id="logOutButton">Log out</button>
      </div>
    </header>

    <section class="welcome" id="top">
      <div>
        <p class="eyebrow" id="dateLabel">THURSDAY, SEPTEMBER 24</p>
        <h1>Good evening, <span id="playerName">Nova</span>.</h1>
        <p class="subtle">The Verse is waiting for your next moment of wonder.</p>
      </div>
      <div class="welcome-actions">
        <button class="primary" id="playPortalButton">Enter Portal</button>
        <button class="ghost" id="photoModeButton">Photo mode</button>
      </div>
    </section>

    <section class="featured glass-card" id="discover">
      <div class="featured-art">
        <div class="planet planet-one"></div>
        <div class="planet planet-two"></div>
        <div class="featured-star">✦</div>
        <span class="floating-label label-one">NEW REALMS</span>
        <span class="floating-label label-two">12K PLAYING</span>
      </div>
      <div class="featured-content">
        <div class="tag-row">
          <span class="tag violet">FEATURED</span>
          <span class="tag">12K PLAYING</span>
        </div>
        <h2>Neon Drift:<br /><em>Afterlight</em></h2>
        <p>Race through endless light trails, dodge gravity ripples, and outpace rival creators in the galaxy’s loudest arena.</p>
        <button class="primary" type="button">Join world</button>
      </div>
    </section>

    <section class="section-block worlds-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">CURATED FOR YOU</p>
          <h2>Explore worlds</h2>
        </div>
        <button class="text-button" type="button">View all <span>→</span></button>
      </div>

      <div class="world-grid">
        <article class="world-card glass-card">
          <div class="world-thumb thumb-one"></div>
          <div class="world-copy">
            <h3>Galaxy Garden</h3>
            <p>Grow impossible flowers and decorate floating islands.</p>
          </div>
        </article>
        <article class="world-card glass-card">
          <div class="world-thumb thumb-two"></div>
          <div class="world-copy">
            <h3>Skyline Rush</h3>
            <p>Boost through neon rails and push your speedrun score.</p>
          </div>
        </article>
        <article class="world-card glass-card">
          <div class="world-thumb thumb-three"></div>
          <div class="world-copy">
            <h3>Stone Drift</h3>
            <p>Build a floating home and meet up with friends at sunset.</p>
          </div>
        </article>
      </div>
    </section>

    <section class="economy-panel glass-card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">YOUR ECONOMY</p>
          <h2>Vault</h2>
        </div>
        <span class="live-status"><i></i> LIVE</span>
      </div>
      <div class="economy-grid">
        <div class="currency-box">
          <span class="eyebrow">TIX</span>
          <strong id="tixBalance">150</strong>
          <small>Starter currency</small>
        </div>
        <div class="currency-box highlight">
          <span class="eyebrow">VV Tokens</span>
          <strong id="vvBalance">0</strong>
          <small>Cosmic premium economy</small>
        </div>
        <div class="currency-box action-box">
          <span class="eyebrow">EXCHANGE</span>
          <button class="primary" id="exchangeButton">Trade 50 TIX → 10 VV</button>
          <small id="economyToast"></small>
        </div>
      </div>
    </section>

    <section class="customizer-section glass-card" id="customize">
      <div class="section-heading">
        <div>
          <p class="eyebrow">IDENTITY LAB</p>
          <h2>Make it yours</h2>
        </div>
        <span class="section-count">01 / 03</span>
      </div>

      <div class="customizer-grid">
        <div class="avatar-stage">
          <div class="avatar-shell">
            <div class="avatar-shadow"></div>
            <div id="avatarPreview" class="avatar-preview"> </div>
          </div>
          <div class="avatar-controls">
            <button class="chip active" data-color="violet">Violet</button>
            <button class="chip" data-color="cyan">Cyan</button>
            <button class="chip" data-color="pink">Pink</button>
            <button class="chip" data-color="lime">Lime</button>
          </div>
        </div>

        <div class="catalog-panel">
          <div class="catalog-header">
            <h3>Items</h3>
            <span class="tag violet" id="catalogNote">Starter kit</span>
          </div>
          <div id="itemCatalog" class="catalog-list"></div>
          <h3 class="emote-title">Emotes</h3>
          <div id="emoteCatalog" class="catalog-list"></div>
        </div>
      </div>
    </section>

    <section class="quest-panel glass-card" id="quests">
      <div class="section-heading">
        <div>
          <p class="eyebrow">STORYLINE</p>
          <h2>Daily quests</h2>
        </div>
        <span class="tag violet">3 active</span>
      </div>
      <div id="questList" class="quest-list"></div>
    </section>

    <section class="badges-panel glass-card" id="badges">
      <div class="section-heading">
        <div>
          <p class="eyebrow">COLLECTION</p>
          <h2>Badges</h2>
        </div>
      </div>
      <div id="badgeList" class="badge-list"></div>
    </section>

    <section class="portal-panel glass-card" id="studio">
      <div class="section-heading">
        <div>
          <p class="eyebrow">MYSTERY PORTAL</p>
          <h2>Portal of whispers</h2>
        </div>
        <span class="tag violet">Secret room</span>
      </div>
      <div class="portal-content">
        <div class="portal-visual">
          <div class="portal-core">✦</div>
        </div>
        <div class="portal-copy">
          <p class="subtle">Explore the hidden portal to find rare rewards and world secrets.</p>
          <button class="primary" id="portalSecretButton">Open the portal</button>
          <p id="portalStatus" class="portal-status">Nothing here yet…</p>
        </div>
      </div>
    </section>

    <footer>
      <span>✦ VOIDVERSE</span>
      <span>Made for the curious.</span>
      <span>v0.9.6</span>
    </footer>
  </main>

  <div id="tutorialOverlay" class="tutorial-overlay hidden">
    <div class="tutorial-card glass-card">
      <p class="eyebrow">STARTER GUIDE</p>
      <h3>Welcome to your first run.</h3>
      <ol>
        <li>Customize your avatar.</li>
        <li>Collect a free emote.</li>
        <li>Complete 3 daily quests.</li>
        <li>Open the mystery portal.</li>
      </ol>
      <button class="primary" id="closeTutorialButton">Start exploring</button>
    </div>
  </div>

  <div id="photoOverlay" class="photo-overlay hidden">
    <div class="photo-card glass-card">
      <div class="photo-header">
        <h3>Photo mode</h3>
        <button class="ghost" id="closePhotoButton">Close</button>
      </div>
      <div class="photo-preview">
        <div id="photoAvatar" class="avatar-preview large"> </div>
      </div>
      <p id="photoCaption">VoidVerse moment captured.</p>
    </div>
  </div>

  <script src="app.js"></script>
</body>
</html>


























































































































































































\n"},{
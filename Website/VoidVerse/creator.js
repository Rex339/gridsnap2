(() => {
  const gamesKey = 'voidverse-games';
  const reportsKey = 'voidverse-reports';
  const bansKey = 'voidverse-bans';

  const read = (name, fallback = []) => {
    try {
      const raw = localStorage.getItem(name);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const save = (name, value) => localStorage.setItem(name, JSON.stringify(value));

  const renderGames = () => {
    const list = document.getElementById('gamesList');
    const games = read(gamesKey, []);
    if (!list) return;
    document.getElementById('gameCount').textContent = String(games.length);
    list.innerHTML = games.length ? games.map((game, index) => `
      <div class="game-card small-game" data-index="${index}">
        <div class="game-thumb"></div>
        <div class="game-info">
          <strong>${game.name}</strong>
          <span>${game.visibility} • by ${game.owner || 'Creator'}</span>
          <small>Created ${game.created}</small>
        </div>
      </div>
    `).join('') : '<p class="page-subtitle">No games published yet.</p>';
  };

  const renderModeration = () => {
    const list = document.getElementById('moderationList');
    if (!list) return;
    const reports = read(reportsKey, []);
    const bans = read(bansKey, []);

    const items = [
      ...reports.map(r => ({
        type: 'report',
        title: `${r.type} report`,
        meta: `${r.user} • ${r.reason}`,
        status: r.status || 'Open'
      })),
      ...bans.map(b => ({
        type: 'ban',
        title: `Ban active`,
        meta: `${b.user} • ${b.length} day(s) • ${b.reason}`,
        status: 'Active'
      }))
    ];

    list.innerHTML = items.length ? items.map(item => `
      <div class="game-card small-game">
        <div class="game-thumb ${item.type === 'ban' ? 'alert' : ''}"></div>
        <div class="game-info">
          <strong>${item.title}</strong>
          <span>${item.meta}</span>
          <small>Status: ${item.status}</small>
        </div>
      </div>
    `).join('') : '<p class="page-subtitle">Safety queue is clear.</p>';
  };

  const syncStats = () => {
    const games = read(gamesKey, []);
    const reports = read(reportsKey, []);
    const bans = read(bansKey, []);
    document.getElementById('gameCount').textContent = String(games.length);
    document.getElementById('activeCount').textContent = String(Math.max(8, reports.length + bans.length + 6));
  };

  const createGame = () => {
    const name = document.getElementById('gameName').value.trim();
    const owner = document.getElementById('gameOwner').value.trim() || 'Creator';
    const visibility = document.getElementById('gameVisibility').value;
    const msg = document.getElementById('gameMessage');

    if (!name) {
      msg.textContent = 'Give your game a name first.';
      msg.className = 'account-message error';
      return;
    }

    const games = read(gamesKey, []);
    games.unshift({
      name,
      owner,
      visibility,
      created: new Date().toLocaleDateString()
    });
    save(gamesKey, games);
    msg.textContent = 'Game published successfully.';
    msg.className = 'account-message';
    document.getElementById('gameName').value = '';
    renderGames();
    syncStats();
  };

  document.getElementById('createGame')?.addEventListener('click', createGame);
  document.querySelectorAll('.account-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.account-tab').forEach(x => x.classList.toggle('active', x === tab));
      document.querySelectorAll('.account-pane').forEach(panel => {
        panel.classList.toggle('hidden', panel.dataset.paneView !== tab.dataset.pane);
      });
    });
  });

  renderGames();
  renderModeration();
  syncStats();
})();

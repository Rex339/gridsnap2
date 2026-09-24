(() => {
  const KEY = 'voidverse-player-v1';
  const gamesKey = 'voidverse-games';

  const read = (name) => {
    try { return JSON.parse(localStorage.getItem(name) || '[]'); }
    catch { return []; }
  };

  const save = (name, value) => localStorage.setItem(name, JSON.stringify(value));

  const renderGames = () => {
    const list = document.getElementById('gamesList');
    if (!list) return;
    const games = read(gamesKey);
    list.innerHTML = games.length ? games.map(game => `
      <div class="game-card small-game">
        <div class="game-thumb"></div>
        <div class="game-info">
          <strong>${game.name}</strong>
          <span>${game.visibility} • by ${game.owner || 'Creator'}</span>
          <small>Created ${game.created}</small>
        </div>
      </div>
    `).join('') : '<p class="page-subtitle">No games published yet.</p>';
    document.getElementById('gameCount').textContent = String(games.length);
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

    const games = read(gamesKey);
    const record = {
      name,
      owner,
      visibility,
      created: new Date().toLocaleDateString()
    };
    games.unshift(record);
    save(gamesKey, games);
    msg.textContent = 'Game published successfully.';
    msg.className = 'account-message';
    document.getElementById('gameName').value = '';
    renderGames();
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
})();

(() => {
  const KEY = 'voidverse-player-v1';
  const defaults = { name: 'Nova', email: '', voidMoon: 0, voidShards: 0, lastDailyClaim: null, privacy: { invites: true, online: true } };
  const read = () => { try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { ...defaults }; } };
  const write = (patch) => localStorage.setItem(KEY, JSON.stringify({ ...read(), ...patch }));
  const state = read();
  const $ = (id) => document.getElementById(id);
  const today = () => new Date().toISOString().slice(0, 10);
  const safe = (value) => String(value || '').replace(/[<>]/g, '');

  function addNav() {
    const topbar = document.querySelector('.topbar');
    if (!topbar || document.querySelector('.vv-account-links')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'vv-account-links';
    wrapper.innerHTML = '<a href="account-settings.html">Settings</a><a href="terms.html">ToS</a><a href="privacy.html">Privacy</a>';
    topbar.querySelector('.top-actions')?.before(wrapper);
  }

  function addDailyPanel() {
    if (!document.querySelector('.economy-panel') || document.querySelector('.daily-moon-card')) return;
    const panel = document.createElement('div');
    panel.className = 'daily-moon-card glass-card';
    panel.innerHTML = `<div><p class="eyebrow">DAILY REWARD</p><h3>Void Moon</h3><p class="moon-copy">Claim 10 Void Moon once every UTC day. Transfer 2 Moon into 1 Void Shard.</p></div><div class="moon-actions"><div class="moon-balances"><span>☾ <b id="moonBalance">${state.voidMoon || 0}</b></span><span>◇ <b id="shardBalance">${state.voidShards || 0}</b></span></div><button class="secondary" id="claimMoon">Claim +10</button><button class="secondary" id="convertMoon">Make shard</button></div><p class="toast" id="moonToast"></p>`;
    document.querySelector('.economy-panel').after(panel);
    const refresh = () => {
      const current = read();
      $('moonBalance').textContent = current.voidMoon || 0;
      $('shardBalance').textContent = current.voidShards || 0;
      const claimed = current.lastDailyClaim === today();
      $('claimMoon').disabled = claimed;
      $('claimMoon').textContent = claimed ? 'Claimed today' : 'Claim +10';
    };
    $('claimMoon').onclick = () => {
      const current = read();
      if (current.lastDailyClaim === today()) return $('moonToast').textContent = 'Your daily Void Moon has already been claimed.';
      write({ voidMoon: (current.voidMoon || 0) + 10, lastDailyClaim: today() });
      $('moonToast').textContent = 'Daily reward claimed: +10 Void Moon.'; refresh();
    };
    $('convertMoon').onclick = () => {
      const current = read();
      if ((current.voidMoon || 0) < 2) return $('moonToast').textContent = 'You need 2 Void Moon to make 1 Void Shard.';
      write({ voidMoon: current.voidMoon - 2, voidShards: (current.voidShards || 0) + 1 });
      $('moonToast').textContent = 'Conversion complete: −2 Moon, +1 Void Shard.'; refresh();
    };
    refresh();
  }

  addNav();
  addDailyPanel();
})();

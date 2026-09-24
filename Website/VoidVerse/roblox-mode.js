(() => {
  const KEY = 'voidverse-player-v1';
  const defaults = { name: 'Nova', email: '', voidMoon: 0, voidShards: 0, lastDailyClaim: null, privacy: { invites: true, online: true }, color: 'violet', items: [], emotes: [], equippedItem: null, equippedEmote: null };
  const read = () => { try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { ...defaults }; } };
  const write = patch => localStorage.setItem(KEY, JSON.stringify({ ...read(), ...patch }));
  const $ = id => document.getElementById(id);
  const today = () => new Date().toISOString().slice(0, 10);
  const safe = value => String(value || '').replace(/[<>]/g, '');

  const catalog = [
    { id: 'nebula-hood', name: 'Nebula Hood', kind: 'Outfit', price: 8, icon: '◈', color: '#9b7cff' },
    { id: 'orbit-aura', name: 'Orbit Aura', kind: 'Aura', price: 12, icon: '✦', color: '#75e9e0' },
    { id: 'void-wings', name: 'Void Wings', kind: 'Back item', price: 18, icon: '⌁', color: '#f47cd8' },
    { id: 'pixel-crown', name: 'Pixel Crown', kind: 'Headwear', price: 25, icon: '♛', color: '#d8f67c' }
  ];
  const emotes = [
    { id: 'wave', name: 'Cosmic Wave', price: 4, icon: '👋' },
    { id: 'spark', name: 'Sparkle', price: 6, icon: '✨' },
    { id: 'dance', name: 'Zero-G Dance', price: 10, icon: '🕺' },
    { id: 'laugh', name: 'Star Laugh', price: 7, icon: '😄' }
  ];

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
    panel.innerHTML = '<div><p class="eyebrow">DAILY REWARD</p><h3>Void Moon</h3><p class="moon-copy">Claim 10 Void Moon once every UTC day. Transfer 2 Moon into 1 Void Shard.</p></div><div class="moon-actions"><strong><span id="moonBalance">0</span> Moon · <span id="shardBalance">0</span> Shards</strong><button class="primary" id="claimMoon" type="button">Claim +10</button><button class="secondary" id="convertMoon" type="button">Convert 2 → 1</button><small id="moonToast"></small></div>';
    document.querySelector('.economy-panel').after(panel);
    const refresh = () => { const current = read(); $('moonBalance').textContent = current.voidMoon || 0; $('shardBalance').textContent = current.voidShards || 0; const claimed = current.lastDailyClaim === today(); $('claimMoon').disabled = claimed; $('claimMoon').textContent = claimed ? 'Claimed today' : 'Claim +10'; };
    $('claimMoon').onclick = () => { const current = read(); if (current.lastDailyClaim === today()) return $('moonToast').textContent = 'Your daily Void Moon has already been claimed.'; write({ voidMoon: (current.voidMoon || 0) + 10, lastDailyClaim: today() }); $('moonToast').textContent = 'Daily reward claimed: +10 Void Moon.'; refresh(); };
    $('convertMoon').onclick = () => { const current = read(); if ((current.voidMoon || 0) < 2) return $('moonToast').textContent = 'You need 2 Void Moon to make 1 Void Shard.'; write({ voidMoon: current.voidMoon - 2, voidShards: (current.voidShards || 0) + 1 }); $('moonToast').textContent = 'Conversion complete: −2 Moon, +1 Void Shard.'; refresh(); };
    refresh();
  }

  function card(item, owned, action) {
    const button = owned ? `<button class="vv-item-button owned" data-action="${action}" data-id="${item.id}">${action === 'emote' ? 'Use' : 'Equip'}</button>` : `<button class="vv-item-button" data-action="buy" data-id="${item.id}">${item.price} VV</button>`;
    return `<article class="vv-catalog-card"><div class="vv-item-icon" style="--item-color:${item.color || '#b693ff'}">${item.icon}</div><div><strong>${safe(item.name)}</strong><small>${safe(item.kind || 'Emote')}</small></div>${button}</article>`;
  }

  function addCustomizationPanel() {
    const section = document.querySelector('#customize');
    if (!section || document.querySelector('.vv-customization-panel')) return;
    const panel = document.createElement('div'); panel.className = 'vv-customization-panel glass-card';
    panel.innerHTML = `<div class="section-heading"><div><p class="eyebrow">COLLECTION</p><h3>Items & emotes</h3></div><span class="tag violet">${catalog.length + emotes.length} DROPS</span></div><p class="subtle">Build your identity with VV Tokens earned in the Verse. Purchases are saved to this device in demo mode.</p><div class="vv-catalog-grid" id="vvItems"></div><h4>Emote wheel</h4><div class="vv-catalog-grid" id="vvEmotes"></div><p class="vv-equip-status" id="vvEquipStatus"></p>`;
    section.append(panel);
    const render = () => { const current = read(); const owned = new Set(current.items || []); const ownedEmotes = new Set(current.emotes || []); $('vvItems').innerHTML = catalog.map(item => card(item, owned.has(item.id), 'item')).join(''); $('vvEmotes').innerHTML = emotes.map(item => card(item, ownedEmotes.has(item.id), 'emote')).join(''); $('vvEquipStatus').textContent = `Equipped: ${current.equippedItem || 'default look'} · Emote: ${current.equippedEmote || 'none'}`; };
    panel.addEventListener('click', event => { const button = event.target.closest('[data-id]'); if (!button) return; const id = button.dataset.id; const action = button.dataset.action; const current = read(); if (action === 'buy') { const item = [...catalog, ...emotes].find(x => x.id === id); const field = emotes.some(x => x.id === id) ? 'emotes' : 'items'; if ((current.vv || 0) < item.price) { $('vvEquipStatus').textContent = `You need ${item.price} VV Tokens for ${item.name}.`; return; } write({ vv: current.vv - item.price, [field]: [...new Set([...(current[field] || []), id])] }); } else if (action === 'item') write({ equippedItem: id }); else write({ equippedEmote: id }); render(); });
    render();
  }

  function addEmoteButton() {
    if (document.querySelector('.vv-emote-launcher')) return;
    const button = document.createElement('button'); button.className = 'settings-button vv-emote-launcher'; button.type = 'button'; button.title = 'Play equipped emote'; button.textContent = '✦';
    button.onclick = () => { const current = read(); const emote = emotes.find(x => x.id === current.equippedEmote); if (!emote) return; const toast = document.createElement('div'); toast.className = 'vv-emote-toast'; toast.textContent = `${emote.icon} ${emote.name}!`; document.body.append(toast); setTimeout(() => toast.remove(), 1800); };
    document.querySelector('.top-actions')?.append(button);
  }

  function addPwaSupport() {
    if (!document.querySelector('link[rel="manifest"]')) { const link = document.createElement('link'); link.rel = 'manifest'; link.href = 'manifest.webmanifest'; document.head.append(link); }
    if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }

  addNav(); addDailyPanel(); addCustomizationPanel(); addEmoteButton(); addPwaSupport();
})();

const STORAGE_KEY = 'voidverse-player-v1';
const defaultState = {
  name: 'Nova',
  email: '',
  tix: 150,
  vv: 0,
  published: false,
  color: 'violet',
  items: [],
  emotes: [],
  equippedItem: null,
  equippedEmote: null,
  quests: {
    customize: true,
    emote: true,
    portal: true,
    world: false
  },
  badges: [],
  tutorialDone: false,
  hiddenPortalOpen: false,
  photoMode: false
};

const itemCatalog = [
  { id: 'nebula-hood', name: 'Nebula Hood', kind: 'Headwear', price: 8, icon: '◈', color: '#9b7cff', tint: 'violet' },
  { id: 'orbit-aura', name: 'Orbit Aura', kind: 'Aura', price: 12, icon: '✦', color: '#75e9e0', tint: 'cyan' },
  { id: 'void-wings', name: 'Void Wings', kind: 'Back item', price: 18, icon: '⌁', color: '#f47cd8', tint: 'pink' },
  { id: 'pixel-crown', name: 'Pixel Crown', kind: 'Headwear', price: 25, icon: '♛', color: '#d8f67c', tint: 'lime' }
];

const emoteCatalog = [
  { id: 'wave', name: 'Cosmic Wave', price: 4, icon: '👋' },
  { id: 'spark', name: 'Sparkle', price: 6, icon: '✨' },
  { id: 'dance', name: 'Zero-G Dance', price: 10, icon: '🕺' },
  { id: 'laugh', name: 'Star Laugh', price: 7, icon: '😄' }
];

const badgeCatalog = [
  { id: 'first-login', name: 'First Steps', icon: '✧', text: 'Started the journey' },
  { id: 'fashion-star', name: 'Fashion Star', icon: '☄', text: 'Equipped a new item' },
  { id: 'emote-master', name: 'Emote Master', icon: '⚡', text: 'Unlocked a special emote' },
  { id: 'portal-runner', name: 'Portal Runner', icon: '🌀', text: 'Opened the mystery portal' }
];

let state = loadState();

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch { return { ...defaultState }; }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  render();
}

function $(id) { return document.getElementById(id); }

function setColor(color) {
  state.color = color;
  const root = document.getElementById('avatarPreview');
  if (root) {
    const palette = { violet: '#9b7cff', cyan: '#75e9e0', pink: '#f47cd8', lime: '#d8f67c' };
    root.style.color = palette[color] || '#9b7cff';
    const photo = document.getElementById('photoAvatar');
    if (photo) photo.style.color = palette[color] || '#9b7cff';
  }
  saveState();
}

function openApp(name, email = '') {
  state.name = name || 'Nova';
  if (email) state.email = email;
  state.tutorialDone = state.tutorialDone || false;
  saveState();
  $('authGate').classList.add('hidden');
  $('appShell').classList.remove('hidden');
  window.scrollTo(0, 0);
  if (!state.tutorialDone) {
    $('tutorialOverlay').classList.remove('hidden');
  }
}

function closeTutorial() {
  state.tutorialDone = true;
  saveState();
  $('tutorialOverlay').classList.add('hidden');
}

function toast(id, message) {
  const el = $(id);
  if (!el) return;
  el.textContent = message;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => {
    el.textContent = '';
  }, 2600);
}

function buyItem(entry) {
  if (state.vv < entry.price) {
    toast('economyToast', `You need ${entry.price} VV Tokens for ${entry.name}.`);
    return;
  }
  state.vv -= entry.price;
  if (!state.items.includes(entry.id)) state.items.push(entry.id);
  state.equippedItem = entry.id;
  saveState();
  toast('economyToast', `${entry.name} equipped.`);
}

function buyEmote(entry) {
  if (state.vv < entry.price) {
    toast('economyToast', `You need ${entry.price} VV Tokens for ${entry.name}.`);
    return;
  }
  state.vv -= entry.price;
  if (!state.emotes.includes(entry.id)) state.emotes.push(entry.id);
  state.equippedEmote = entry.id;
  saveState();
  toast('economyToast', `${entry.name} ready.`);
}

function renderCatalog() {
  const itemRoot = $('itemCatalog');
  itemRoot.innerHTML = itemCatalog.map(item => {
    const owned = state.items.includes(item.id);
    const label = owned ? 'Owned' : `${item.price} VV`;
    const action = owned ? 'Equip' : 'Buy';
    return `
      <div class="catalog-item">
        <div class="catalog-icon" style="color:${item.color}; background:${item.color}22;">${item.icon}</div>
        <div>
          <h4>${item.name}</h4>
          <small>${item.kind}</small>
        </div>
        <button class="catalog-buy ${owned ? 'owned' : 'buy'}" data-type="item" data-id="${item.id}">${owned ? action : label}</button>
      </div>
    `;
  }).join('');

  const emoteRoot = $('emoteCatalog');
  emoteRoot.innerHTML = emoteCatalog.map(item => {
    const owned = state.emotes.includes(item.id);
    const label = owned ? 'Use' : `${item.price} VV`;
    return `
      <div class="catalog-item">
        <div class="catalog-icon">${item.icon}</div>
        <div>
          <h4>${item.name}</h4>
          <small>Emote</small>
        </div>
        <button class="catalog-buy ${owned ? 'owned' : 'buy'}" data-type="emote" data-id="${item.id}">${owned ? 'Use' : label}</button>
      </div>
    `;
  }).join('');
}

function renderBadges() {
  const badgeRoot = $('badgeList');
  const earned = new Set(state.badges || []);
  badgeRoot.innerHTML = badgeCatalog.map(badge => {
    const unlocked = earned.has(badge.id);
    return `
      <div class="badge-item">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="badge-pill">${badge.icon}</div>
          <div>
            <strong>${badge.name}</strong><br />
            <small>${badge.text}</small>
          </div>
        </div>
        <span class="tag ${unlocked ? 'violet' : ''}">${unlocked ? 'Unlocked' : 'Hidden'}</span>
      </div>
    `;
  }).join('');
}

function renderQuests() {
  const questRoot = $('questList');
  const quests = [
    { id: 'customize', title: 'Customize your avatar', reward: '+10 TIX', complete: state.items.length > 0 || state.color },
    { id: 'emote', title: 'Unlock an emote', reward: '+15 TIX', complete: state.emotes.length > 0 },
    { id: 'portal', title: 'Open the mystery portal', reward: '+25 TIX', complete: state.hiddenPortalOpen },
    { id: 'world', title: 'Visit the featured world', reward: '+20 TIX', complete: state.published }
  ];

  questRoot.innerHTML = quests.map(quest => `
    <div class="quest-item">
      <div>
        <strong>${quest.title}</strong><br />
        <small>${quest.reward}</small>
      </div>
      <button class="primary quest-button" data-quest="${quest.id}" ${quest.complete ? 'disabled' : ''}>${quest.complete ? 'Done' : 'Claim'}</button>
    </div>
  `).join('');
}

function claimQuest(id) {
  if (id === 'customize' && state.items.length === 0) return;
  if (id === 'emote' && state.emotes.length === 0) return;
  if (id === 'portal' && !state.hiddenPortalOpen) return;
  if (id === 'world' && !state.published) return;

  const rewardMap = { customize: 10, emote: 15, portal: 25, world: 20 };
  state.tix += rewardMap[id] || 0;
  if (!state.badges.includes('first-login') && state.tix >= 150) state.badges.push('first-login');
  if (state.items.length > 0 && !state.badges.includes('fashion-star')) state.badges.push('fashion-star');
  if (state.emotes.length > 0 && !state.badges.includes('emote-master')) state.badges.push('emote-master');
  if (state.hiddenPortalOpen && !state.badges.includes('portal-runner')) state.badges.push('portal-runner');
  saveState();
}

function renderAvatar() {
  const avatar = $('avatarPreview');
  const photo = $('photoAvatar');
  const palette = { violet: '#9b7cff', cyan: '#75e9e0', pink: '#f47cd8', lime: '#d8f67c' };
  const color = palette[state.color] || '#9b7cff';
  if (avatar) avatar.style.color = color;
  if (photo) photo.style.color = color;
}

function render() {
  const tix = state.tix || 0;
  const vv = state.vv || 0;
  if ($('topTix')) $('topTix').textContent = tix;
  if ($('topVv')) $('topVv').textContent = vv;
  if ($('tixBalance')) $('tixBalance').textContent = tix;
  if ($('vvBalance')) $('vvBalance').textContent = vv;
  if ($('playerName')) $('playerName').textContent = state.name || 'Nova';
  renderAvatar();
  renderCatalog();
  renderQuests();
  renderBadges();
}

function bindUI() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(el => el.classList.toggle('active', el === tab));
      const mode = tab.dataset.auth;
      document.querySelectorAll('.auth-form').forEach(form => {
        const show = form.dataset.form === mode;
        form.classList.toggle('hidden', !show);
      });
    });
  });

  $('signinButton').addEventListener('click', () => {
    const name = $('signinName').value.trim();
    const entered = name || 'Nova';
    openApp(entered);
  });

  $('signupButton').addEventListener('click', () => {
    const name = $('signupName').value.trim();
    if (!name) {
      $('signupNote').textContent = 'Choose a username before entering the Verse.';
      $('signupNote').classList.add('error');
      return;
    }
    $('signupNote').classList.remove('error');
    openApp(name, $('signupEmail').value.trim());
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === chip));
      setColor(chip.dataset.color);
    });
  });

  $('exchangeButton').addEventListener('click', () => {
    if (state.tix < 50) {
      toast('economyToast', 'You need 50 TIX to make this exchange.');
      return;
    }
    state.tix -= 50;
    state.vv += 10;
    saveState();
    toast('economyToast', 'Exchange complete: −50 TIX, +10 VV.');
  });

  $('playPortalButton').addEventListener('click', () => {
    state.tix += 15;
    state.hiddenPortalOpen = true;
    state.published = true;
    if (!state.badges.includes('portal-runner')) state.badges.push('portal-runner');
    $('portalStatus').textContent = 'A secret portal opens and reveals a hidden shimmer trail. +15 TIX unlocked!';
    saveState();
  });

  $('portalSecretButton').addEventListener('click', () => {
    state.hiddenPortalOpen = true;
    state.tix += 25;
    state.vv += 5;
    if (!state.badges.includes('portal-runner')) state.badges.push('portal-runner');
    $('portalStatus').textContent = 'You found the hidden portal. The stars reward you with +25 TIX and +5 VV.';
    saveState();
  });

  $('logOutButton').addEventListener('click', () => {
    $('appShell').classList.add('hidden');
    $('authGate').classList.remove('hidden');
    $('signinName').value = '';
    $('signinPassword').value = '';
    $('signupName').value = '';
    $('signupEmail').value = '';
    $('signupPassword').value = '';
  });

  $('closeTutorialButton').addEventListener('click', closeTutorial);

  $('photoModeButton').addEventListener('click', () => {
    const photo = $('photoOverlay');
    photo.classList.remove('hidden');
    $('photoCaption').textContent = `${state.name}'s VoidVerse snapshot — ${state.color} palette active.`;
  });

  $('closePhotoButton').addEventListener('click', () => {
    $('photoOverlay').classList.add('hidden');
  });

  document.body.addEventListener('click', (event) => {
    const itemButton = event.target.closest('[data-type="item"]');
    if (itemButton) {
      const item = itemCatalog.find(entry => entry.id === itemButton.dataset.id);
      if (!state.items.includes(item.id)) buyItem(item);
      else {
        state.equippedItem = item.id;
        saveState();
        toast('economyToast', `${item.name} equipped.`);
      }
    }

    const emoteButton = event.target.closest('[data-type="emote"]');
    if (emoteButton) {
      const emote = emoteCatalog.find(entry => entry.id === emoteButton.dataset.id);
      if (!state.emotes.includes(emote.id)) buyEmote(emote);
      else {
        state.equippedEmote = emote.id;
        saveState();
        toast('economyToast', `${emote.name} ready to use.`);
      }
    }

    const questButton = event.target.closest('[data-quest]');
    if (questButton) {
      claimQuest(questButton.dataset.quest);
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  bindUI();
  render();
  const palette = { violet: '#9b7cff', cyan: '#75e9e0', pink: '#f47cd8', lime: '#d8f67c' };
  const color = palette[state.color] || '#9b7cff';
  const avatar = $('avatarPreview');
  if (avatar) avatar.style.color = color;
  const photo = $('photoAvatar');
  if (photo) photo.style.color = color;
  if (!state.tutorialDone) $('tutorialOverlay').classList.remove('hidden');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}

























































































































































































































{
  "error": "Not allowed"
}



































































































































































a"}










































































"},{
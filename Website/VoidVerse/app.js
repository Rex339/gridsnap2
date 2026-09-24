const STORAGE_KEY = 'voidverse-player-v1';
const defaultState = { name: 'Nova', tix: 150, vv: 0, published: false, color: 'violet', items: [] };
let state = loadState();

function loadState() {
  try { return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return { ...defaultState }; }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); render(); }
function $(id) { return document.getElementById(id); }
function showToast(id, message) { const el = $(id); el.textContent = message; clearTimeout(el._timer); el._timer = setTimeout(() => el.textContent = '', 3200); }

function render() {
  $('tixBalance').textContent = state.tix;
  $('vvBalance').textContent = state.vv;
  $('topTix').textContent = state.tix;
  $('topVv').textContent = state.vv;
  $('playerName').textContent = state.name;
  $('publishButton').innerHTML = state.published ? 'Instance published ✓' : 'Publish Instance <span>↗</span>';
  $('publishButton').disabled = state.published;
  document.documentElement.dataset.avatarColor = state.color;
  document.querySelectorAll('.color-node').forEach(node => node.classList.toggle('selected', node.dataset.color === state.color));
  const names = { violet: 'Violet', cyan: 'Cyan', lime: 'Lime', coral: 'Coral', ice: 'Ice' };
  $('selectedColorName').textContent = names[state.color];
  document.querySelectorAll('.item-row').forEach(row => {
    const owned = state.items.includes(row.dataset.item);
    row.classList.toggle('owned', owned);
    row.querySelector('strong').textContent = owned ? 'OWNED ✓' : `${row.dataset.cost} ✦`;
  });
}

function enterApp(name) {
  state.name = name || 'Nova';
  save();
  $('authGate').classList.add('hidden');
  $('appShell').classList.remove('hidden');
  window.scrollTo(0, 0);
}

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(item => item.classList.toggle('active', item === tab));
  document.querySelectorAll('.auth-form').forEach(form => form.classList.toggle('hidden', form.dataset.form !== tab.dataset.auth));
}));
$('signinButton').addEventListener('click', () => enterApp($('signinName').value.trim() || 'Nova'));
$('signupButton').addEventListener('click', () => {
  const name = $('signupName').value.trim();
  if (!name) { $('signupNote').textContent = 'Choose a username to continue.'; return; }
  $('signupNote').textContent = 'Account created — welcome to the Verse.';
  enterApp(name);
});
$('logoutButton').addEventListener('click', () => { $('appShell').classList.add('hidden'); $('authGate').classList.remove('hidden'); });
$('playButton').addEventListener('click', () => showToast('economyToast', 'Launching Neon Drift: Afterlight…'));
$('exchangeButton').addEventListener('click', () => {
  if (state.tix < 50) return showToast('economyToast', 'You need 50 TIX to make this exchange.');
  state.tix -= 50; state.vv += 10; save(); showToast('economyToast', 'Exchange complete: −50 TIX, +10 VV Tokens.');
});
document.querySelectorAll('.color-node').forEach(node => node.addEventListener('click', () => {
  state.color = node.dataset.color; save(); showToast('customToast', `Color mesh switched to ${$('selectedColorName').textContent}.`);
}));
document.querySelectorAll('.item-row').forEach(row => row.addEventListener('click', () => {
  const cost = Number(row.dataset.cost);
  if (state.items.includes(row.dataset.item)) return showToast('customToast', `${row.dataset.item} is already equipped.`);
  if (state.vv < cost) return showToast('customToast', `You need ${cost} VV Tokens for ${row.dataset.item}.`);
  state.vv -= cost; state.items.push(row.dataset.item); save(); showToast('customToast', `${row.dataset.item} equipped to your model.`);
}));
$('publishButton').addEventListener('click', () => {
  if (state.published) return;
  state.published = true; state.tix += 100; save(); showToast('studioToast', 'Instance published! Developer reward +100 TIX added.');
});
render();

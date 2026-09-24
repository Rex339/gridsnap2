(() => {
  const KEY = 'voidverse-player-v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
  const write = (patch) => localStorage.setItem(KEY, JSON.stringify({ ...read(), ...patch }));
  const state = read();

  const format = (text) => text ? text : 'Not set';
  async function api(action, params = {}) {
    const query = new URLSearchParams({ action, ...params });
    const res = await fetch('../Game/Account.ashx?' + query.toString());
    return res.json();
  }

  function setMessage(text, isError = false) {
    const el = document.getElementById('message');
    if (!el) return;
    el.textContent = text;
    el.className = 'account-message' + (isError ? ' error' : '');
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const profile = await api('profile');
      if (profile && profile.ok) {
        document.getElementById('username').value = profile.username || '';
        document.getElementById('email').value = profile.email || '';
        document.getElementById('moon').textContent = profile.voidMoon || 0;
        document.getElementById('shards').textContent = profile.voidShards || 0;
      }
    } catch (err) {
      // demo mode: ignore if not hosted
    }
  });

  document.getElementById('saveUsername')?.addEventListener('click', async () => {
    const value = document.getElementById('username').value.trim();
    const result = await api('saveSettings', { mode: 'username', newUsername: value });
    if (result.ok) setMessage('Username saved.');
    else setMessage(result.error || 'Unable to save username.', true);
  });

  document.getElementById('resetPassword')?.addEventListener('click', async () => {
    const value = document.getElementById('email').value.trim();
    const result = await api('saveSettings', { mode: 'password', email: value });
    if (result.ok) setMessage('Reset instructions sent to your email.');
    else setMessage(result.error || 'Unable to send instructions.', true);
  });

  document.getElementById('savePrivacy')?.addEventListener('click', async () => {
    const result = await api('saveSettings', {
      mode: 'privacy',
      invites: document.getElementById('invites').checked ? 'true' : 'false',
      online: document.getElementById('online').checked ? 'true' : 'false'
    });
    if (result.ok) setMessage('Privacy settings saved.');
    else setMessage(result.error || 'Unable to save privacy settings.', true);
  });

  document.getElementById('claim')?.addEventListener('click', async () => {
    const result = await api('dailyReward');
    if (result.ok) {
      document.getElementById('moon').textContent = result.voidMoon || 0;
      setMessage(result.message || 'Daily reward claimed.');
    } else setMessage(result.error || 'Unable to claim reward.', true);
  });

  document.getElementById('convert')?.addEventListener('click', async () => {
    const result = await api('convertMoon');
    if (result.ok) {
      document.getElementById('moon').textContent = result.voidMoon || 0;
      document.getElementById('shards').textContent = result.voidShards || 0;
      setMessage(result.message || 'Conversion complete.');
    } else setMessage(result.error || 'Unable to convert.', true);
  });
})();

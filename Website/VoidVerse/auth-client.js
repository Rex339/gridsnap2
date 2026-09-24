(() => {
  const endpoint = '../Game/VoidVerseAuth.ashx';
  const playerKey = 'voidverse-player-v1';

  async function request(action, fields = {}) {
    const body = new URLSearchParams({ action, ...fields });
    const response = await fetch(endpoint, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body
    });
    if (!response.ok) throw new Error('Authentication request failed.');
    return response.json();
  }

  const message = (id, text, error = false) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = text;
    element.classList.toggle('error', error);
  };

  const readPlayer = () => {
    try { return JSON.parse(localStorage.getItem(playerKey) || '{}'); } catch { return {}; }
  };

  const writePlayer = patch => {
    const current = readPlayer();
    localStorage.setItem(playerKey, JSON.stringify({ ...current, ...patch }));
  };

  const showApp = user => {
    if (!user || !user.authenticated) return;
    writePlayer({ name: user.username, email: user.email, authId: user.id });
    document.getElementById('authGate')?.classList.add('hidden');
    document.getElementById('appShell')?.classList.remove('hidden');
    const playerName = document.getElementById('playerName');
    if (playerName) playerName.textContent = user.username;
  };

  const showAuth = () => {
    document.getElementById('authGate')?.classList.remove('hidden');
    document.getElementById('appShell')?.classList.add('hidden');
  };

  const addLogout = () => {
    const actions = document.querySelector('.top-actions');
    if (!actions || document.getElementById('logoutButton')) return;
    const button = document.createElement('button');
    button.id = 'logoutButton';
    button.className = 'settings-button';
    button.type = 'button';
    button.title = 'Sign out';
    button.textContent = '↪';
    button.addEventListener('click', async () => {
      try {
        await request('logout');
        localStorage.removeItem(playerKey);
        window.location.reload();
      } catch {
        message('signinNote', 'Unable to sign out right now.', true);
      }
    });
    actions.appendChild(button);
  };

  const bootstrap = async () => {
    try {
      const result = await request('me');
      if (result.ok && result.authenticated) {
        showApp(result);
        addLogout();
      } else {
        showAuth();
      }
    } catch {
      // Opening index.html directly has no ASP.NET endpoint; retain demo mode.
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signinButton')?.addEventListener('click', async event => {
      event.preventDefault();
      const username = document.getElementById('signinName')?.value.trim();
      const password = document.getElementById('signinPassword')?.value;
      try {
        const result = await request('signin', { username, password });
        if (!result.ok) return message('signinNote', result.error || 'Unable to sign in.', true);
        showApp(result);
        addLogout();
      } catch {
        message('signinNote', 'Live auth is unavailable. Start the ASP.NET site or use demo mode.', true);
      }
    });

    document.getElementById('signupButton')?.addEventListener('click', async event => {
      event.preventDefault();
      const username = document.getElementById('signupName')?.value.trim();
      const email = document.getElementById('signupEmail')?.value.trim();
      const password = document.getElementById('signupPassword')?.value;
      try {
        const result = await request('signup', { username, email, password });
        if (!result.ok) return message('signupNote', result.error || 'Unable to create account.', true);
        showApp(result);
        addLogout();
      } catch {
        message('signupNote', 'Live auth is unavailable. Start the ASP.NET site or use demo mode.', true);
      }
    });

    bootstrap();
  });
})();

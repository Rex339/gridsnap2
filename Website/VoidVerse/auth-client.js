(() => {
  const endpoint = '../Game/VoidVerseAuth.ashx';

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

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signinButton')?.addEventListener('click', async event => {
      event.preventDefault();
      const username = document.getElementById('signinName')?.value.trim();
      const password = document.getElementById('signinPassword')?.value;
      try {
        const result = await request('signin', { username, password });
        if (!result.ok) return message('signinNote', result.error || 'Unable to sign in.', true);
        window.location.reload();
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
        window.location.reload();
      } catch {
        message('signupNote', 'Live auth is unavailable. Start the ASP.NET site or use demo mode.', true);
      }
    });
  });
})();

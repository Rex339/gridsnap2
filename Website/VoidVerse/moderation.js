(() => {
  const KEY = 'voidverse-player-v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
  const write = (patch) => localStorage.setItem(KEY, JSON.stringify({ ...read(), ...patch }));
  const today = () => new Date().toISOString().slice(0, 10);
  const $ = (id) => document.getElementById(id);

  const addReportSystem = () => {
    if (document.querySelector('.vv-report-panel')) return;
    const panel = document.createElement('aside');
    panel.className = 'vv-report-panel glass-card';
    panel.innerHTML = `
      <div class="section-heading compact"><div><p class="eyebrow">SAFETY</p><h3>Report & moderation</h3></div></div>
      <div class="report-controls">
        <label>Report type
          <select id="reportType">
            <option>Harassment</option>
            <option>Spam</option>
            <option>Scam or fraud</option>
            <option>Inappropriate content</option>
            <option>Exploiting</option>
          </select>
        </label>
        <label>Player name
          <input id="reportUser" placeholder="username" maxlength="24" />
        </label>
        <label>Reason
          <textarea id="reportReason" rows="3" maxlength="240" placeholder="Explain what happened..."></textarea>
        </label>
        <button class="primary full" id="submitReport">Submit report</button>
        <p class="report-result" id="reportResult"></p>
      </div>
    `;
    const route = document.querySelector('.studio-section, .customizer-section, .economy-panel');
    route?.after(panel);

    $('#submitReport').onclick = () => {
      const type = $('#reportType').value;
      const user = ($('#reportUser').value || 'unknown-user').trim();
      const reason = ($('#reportReason').value || 'No details provided').trim();
      const result = $('#reportResult');
      if (!user || user.length < 2) return result.textContent = 'Please enter a player name.';
      const report = { type, user, reason, date: new Date().toISOString(), status: 'Pending review' };
      const existing = JSON.parse(localStorage.getItem('voidverse-reports') || '[]');
      existing.push(report);
      localStorage.setItem('voidverse-reports', JSON.stringify(existing));
      result.textContent = 'Report submitted. Moderation has been notified.';
      $('#reportType').value = 'Harassment';
      $('#reportUser').value = '';
      $('#reportReason').value = '';
    };
  };

  const addCreatorModeration = () => {
    if (document.querySelector('.vv-creator-tools')) return;
    const tools = document.createElement('div');
    tools.className = 'vv-creator-tools glass-card';
    tools.innerHTML = `
      <div class="section-heading compact"><div><p class="eyebrow">CREATOR TOOLS</p><h3>Moderation</h3></div></div>
      <div class="moderation-grid">
        <div class="moderation-card">
          <label>Player name<input id="banUser" placeholder="username" maxlength="24"></label>
          <label>Ban length<select id="banLength"><option value="1">1 day</option><option value="3">3 days</option><option value="7">7 days</option><option value="30">30 days</option><option value="999">Permanent</option></select></label>
          <label>Reason<textarea id="banReason" rows="3" maxlength="220" placeholder="Why is this player being banned?"></textarea></label>
          <button class="primary full" id="banPlayer">Ban player</button>
          <p class="report-result" id="banResult"></p>
        </div>
      </div>
    `;
    document.querySelector('.studio-section')?.after(tools);

    $('#banPlayer').onclick = () => {
      const user = ($('#banUser').value || '').trim();
      const length = $('#banLength').value;
      const reason = $('#banReason').value.trim() || 'No reason provided';
      const result = $('#banResult');
      if (!user) return result.textContent = 'Enter a player name to ban.';
      const logs = JSON.parse(localStorage.getItem('voidverse-bans') || '[]');
      logs.push({ user, length, reason, date: new Date().toISOString() });
      localStorage.setItem('voidverse-bans', JSON.stringify(logs));
      result.textContent = `Ban applied: ${user} — ${length === '999' ? 'Permanent' : `${length} day(s)`}.`;
      $('#banUser').value = '';
      $('#banReason').value = '';
    };
  };

  const addUiStyles = () => {
    if (document.querySelector('.vv-report-panel')) return;
    const style = document.createElement('style');
    style.textContent = `
      .vv-report-panel, .vv-creator-tools { padding: 24px; margin-top: 34px; }
      .report-controls, .moderation-card { display:grid; gap:14px; }
      .report-controls label, .moderation-card label { display:grid; gap:8px; font-size:11px; color:#c6c0d4; }
      .report-controls input, .report-controls textarea, .report-controls select, .moderation-card input, .moderation-card textarea, .moderation-card select {
        width:100%; border:1px solid var(--line); border-radius:10px; background:#090a12; color:#fff; padding:11px 12px; font:12px Manrope;
      }
      .report-result { min-height:18px; font-size:11px; color:var(--cyan); margin:0; }
      .compact { margin-bottom: 10px; }
      .full { width:100%; }
      @media(max-width:760px){ .vv-report-panel, .vv-creator-tools { padding:18px; } }
    `;
    document.head.appendChild(style);
  };

  addUiStyles();
  addReportSystem();
  addCreatorModeration();
})();

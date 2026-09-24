const moderationApi = {
  report: async (payload) => fetch('../Game/Moderation.ashx?action=report&' + new URLSearchParams(payload)).then(r => r.json()),
  ban: async (payload) => fetch('../Game/Moderation.ashx?action=ban&' + new URLSearchParams(payload)).then(r => r.json())
};

(() => {
  const reportBtn = document.getElementById('submitReport');
  if (!reportBtn) return;
  reportBtn.onclick = async () => {
    const payload = {
      type: document.getElementById('reportType')?.value || 'Harassment',
      user: document.getElementById('reportUser')?.value || '',
      reason: document.getElementById('reportReason')?.value || ''
    };
    const result = await moderationApi.report(payload);
    const el = document.getElementById('reportResult');
    el.textContent = result.ok ? 'Report submitted.' : result.error || 'Unable to submit report.';
  };

  const banBtn = document.getElementById('banPlayer');
  if (!banBtn) return;
  banBtn.onclick = async () => {
    const payload = {
      user: document.getElementById('banUser')?.value || '',
      length: document.getElementById('banLength')?.value || '1',
      reason: document.getElementById('banReason')?.value || ''
    };
    const result = await moderationApi.ban(payload);
    const el = document.getElementById('banResult');
    el.textContent = result.ok ? 'Ban applied.' : result.error || 'Unable to ban player.';
  };
})();

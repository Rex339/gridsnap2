/* Roblox-inspired interaction layer for VoidVerse. Keeps VoidVerse branding while adding familiar dashboard patterns. */
(() => {
  const $ = (id) => document.getElementById(id);
  const getState = () => { try { return JSON.parse(localStorage.getItem('voidverse-player-v1') || '{}'); } catch { return {}; } };
  const saveState = (patch) => localStorage.setItem('voidverse-player-v1', JSON.stringify({ ...getState(), ...patch }));
  const state = getState();

  const style = document.createElement('style');
  style.textContent = `
    .vv-product-nav{display:flex;align-items:center;gap:10px;margin-left:auto;margin-right:20px}.vv-search{width:min(260px,28vw);border:1px solid var(--line);border-radius:8px;background:#090a12aa;color:#fff;padding:9px 12px;font:12px Manrope}.vv-nav-menu{position:relative}.vv-nav-menu button{border:0;background:transparent;color:#aaa5b8;cursor:pointer;font:12px Manrope}.vv-dropdown{position:absolute;right:0;top:35px;z-index:20;min-width:180px;padding:8px;border:1px solid var(--line);border-radius:12px;background:#171525;box-shadow:0 18px 45px #0009}.vv-dropdown button{display:block;width:100%;padding:10px;text-align:left;border-radius:8px;color:#ddd;background:transparent}.vv-dropdown button:hover{background:#ffffff12;color:#fff}.vv-chat{position:fixed;right:22px;bottom:22px;width:min(340px,calc(100vw - 32px));z-index:30;padding:18px}.vv-chat-log{height:160px;overflow:auto;margin:12px 0;border:1px solid var(--line);border-radius:10px;padding:10px;background:#07081088}.vv-chat-line{font-size:11px;margin:0 0 9px;color:#c8c3d2}.vv-chat-line b{color:var(--purple-bright)}.vv-chat-form{display:flex;gap:7px}.vv-chat-form input{min-width:0;flex:1}.vv-chat-toggle{position:fixed;right:22px;bottom:22px;z-index:29;border:1px solid var(--line);border-radius:50%;width:46px;height:46px;background:#8259ed;color:#fff;cursor:pointer}.vv-chat.hidden,.vv-chat-toggle.hidden{display:none}.settings-button{border:1px solid var(--line);background:#ffffff08;color:#c9c1d9;border-radius:9px;width:32px;height:32px;cursor:pointer}.settings-overlay{position:fixed;inset:0;z-index:50;background:#03040ab8;display:grid;place-items:center;padding:18px}.settings-modal{position:relative;width:min(560px,100%);padding:30px;max-height:90vh;overflow:auto}.settings-close{position:absolute;right:18px;top:15px;background:none;border:0;color:#aaa;font-size:26px;cursor:pointer}.settings-modal h2{margin:0 0 22px}.settings-tabs{display:flex;gap:20px;border-bottom:1px solid var(--line);margin-bottom:22px}.settings-tab{padding:0 0 12px;border:0;background:none;color:#8c8798;cursor:pointer;font-size:11px}.settings-tab.active{color:#fff;border-bottom:2px solid var(--purple-bright)}.settings-pane h3{font-size:15px}.settings-hint{color:#888492;font-size:11px;line-height:1.6}.settings-message{min-height:18px;color:var(--cyan);font-size:11px}.settings-message.error{color:#ff9eae}.settings-footer{display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--line);padding-top:18px;margin-top:24px;color:#777284;font:10px 'DM Mono'}.toggle-row{display:flex!important;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line);padding:14px 0}.toggle-row input{width:auto!important;margin:0!important;accent-color:var(--purple)}
    @media(max-width:760px){.vv-product-nav{margin:0 8px}.vv-search{display:none}.vv-chat{right:16px;bottom:16px}.vv-chat-toggle{right:16px;bottom:16px}}
  `;
  document.head.appendChild(style);

  function addNavigation() {
    const topbar = document.querySelector('.topbar');
    if (!topbar || document.querySelector('.vv-product-nav')) return;
    const nav = document.createElement('div'); nav.className = 'vv-product-nav';
    nav.innerHTML = `<input class="vv-search" id="vvSearch" aria-label="Search experiences" placeholder="Search experiences" /><div class="vv-nav-menu"><button id="vvMore">More ▾</button><div class="vv-dropdown hidden" id="vvDropdown"><button data-scroll="discover">Discover</button><button data-scroll="customize">Avatar</button><button data-scroll="studio">Create</button><button id="vvHelp">Help & Safety</button></div></div>`;
    topbar.querySelector('.top-actions')?.before(nav);
    $('vvMore').onclick = () => $('vvDropdown').classList.toggle('hidden');
    nav.querySelectorAll('[data-scroll]').forEach(b => b.onclick = () => { document.getElementById(b.dataset.scroll)?.scrollIntoView({ behavior:'smooth' }); $('vvDropdown').classList.add('hidden'); });
    $('vvHelp').onclick = () => alert('VoidVerse Safety: block, report, and leave any experience that makes you uncomfortable. Never share your password.');
    $('vvSearch').oninput = (e) => { const q=e.target.value.toLowerCase(); document.querySelectorAll('.game-card').forEach(c=>c.style.display=!q||c.textContent.toLowerCase().includes(q)?'':'none'); };
  }

  function addChat() {
    if (document.querySelector('.vv-chat-toggle')) return;
    const toggle=document.createElement('button'); toggle.className='vv-chat-toggle'; toggle.textContent='✉'; toggle.title='Open chat'; document.body.appendChild(toggle);
    const panel=document.createElement('section'); panel.className='vv-chat glass-card hidden'; panel.innerHTML=`<div class="section-heading"><h3>Experience chat</h3><button class="settings-close" id="vvChatClose">×</button></div><div class="vv-chat-log" id="vvChatLog"><p class="vv-chat-line"><b>System</b> Welcome to the lobby.</p></div><form class="vv-chat-form" id="vvChatForm"><input id="vvChatInput" maxlength="240" placeholder="Say something…" autocomplete="off" /><button class="primary">Send</button></form>`; document.body.appendChild(panel);
    toggle.onclick=()=>{panel.classList.remove('hidden');toggle.classList.add('hidden');}; $('vvChatClose').onclick=()=>{panel.classList.add('hidden');toggle.classList.remove('hidden');};
    $('vvChatForm').onsubmit=async(e)=>{e.preventDefault();const input=$('vvChatInput');const message=input.value.trim();if(!message)return;const name=getState().name||'Guest';const line=document.createElement('p');line.className='vv-chat-line';line.innerHTML=`<b>${name.replace(/[<>]/g,'')}</b> ${message.replace(/[<>]/g,'')}`;$('vvChatLog').appendChild(line);input.value='';$('vvChatLog').scrollTop=$('vvChatLog').scrollHeight;try{await fetch('../Game/ChatFilter.ashx',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({room:'lobby',user:name,message})});}catch{ /* static preview mode */ }};
  }

  function improvePlayButton() { $('playButton')?.addEventListener('click',()=>{ window.location.href='Game.html?game=neon-drift'; },{once:true}); }
  function improveSettings() { const old=$('settingsButton'); if(old) old.title='Account settings'; }
  addNavigation(); addChat(); improvePlayButton(); improveSettings();
})();

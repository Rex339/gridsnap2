(() => {
  const roomKey = 'voidverse-lobbies';
  const chatKey = 'voidverse-chat';

  const seedRooms = [
    { name: 'Skyforge Arena', mode: 'public', players: 12, max: 16, objective: 'Capture the core and hold the line.' },
    { name: 'Moonlit Market', mode: 'friends', players: 8, max: 10, objective: 'Trade, explore, and survive the midnight event.' },
    { name: 'Nova Drift', mode: 'public', players: 16, max: 18, objective: 'Set the fastest lap on the final track.' },
    { name: 'Crystal Realms', mode: 'private', players: 5, max: 8, objective: 'Solve puzzles and unlock hidden vaults.' }
  ];

  const seedChat = [
    'Astra: Queueing up for the next arena round.',
    'Luna: Moonlit Market is open — anyone want to trade?',
    'Kairo: I can host a rematch in 2 minutes.',
    'Vex: Crystal Realms is live and the vault is active.'
  ];

  const read = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const renderRooms = () => {
    const list = document.getElementById('roomList');
    const rooms = read(roomKey, seedRooms);
    if (!list) return;

    list.innerHTML = rooms.map(room => `
      <div class="room-card">
        <div class="room-top">
          <strong>${room.name}</strong>
          <span class="badge ${room.mode}">${room.mode}</span>
        </div>
        <div class="meta-row">
          <span>${room.players}/${room.max} playing</span>
          <span>${room.objective}</span>
        </div>
        <button class="secondary-btn" data-room="${room.name}">Join room</button>
      </div>
    `).join('');

    list.querySelectorAll('button[data-room]').forEach(button => {
      button.addEventListener('click', () => {
        const roomName = button.dataset.room;
        const chat = document.getElementById('chatList');
        if (!chat) return;
        const joinText = `You joined ${roomName}.`;
        const existing = read(chatKey, seedChat);
        existing.push(joinText);
        write(chatKey, existing.slice(-8));
        renderChat();
      });
    });
  };

  const renderChat = () => {
    const chat = document.getElementById('chatList');
    if (!chat) return;
    const messages = read(chatKey, seedChat);
    chat.innerHTML = messages.map(message => `
      <div class="chat-message">${message}</div>
    `).join('');
  };

  const renderMembers = () => {
    const list = document.getElementById('memberList');
    if (!list) return;

    const members = [
      { name: 'Astra', status: 'In arena' },
      { name: 'Luna', status: 'Trading' },
      { name: 'Kairo', status: 'Ready' },
      { name: 'Vex', status: 'Scouting' },
      { name: 'Nova', status: 'In lobby' }
    ];

    list.innerHTML = members.map(member => `
      <div class="member-card">
        <div>
          <strong>${member.name}</strong>
          <div class="presence"><span class="presence-dot"></span>${member.status}</div>
        </div>
        <span class="status-pill">online</span>
      </div>
    `).join('');
  };

  const createRoom = () => {
    const name = document.getElementById('roomName')?.value?.trim();
    const mode = document.getElementById('roomType')?.value || 'public';
    const objective = document.getElementById('roomGoal')?.value?.trim() || 'Battle for control.';

    if (!name) return;

    const rooms = read(roomKey, seedRooms);
    rooms.unshift({
      name,
      mode,
      players: 1,
      max: 16,
      objective
    });

    write(roomKey, rooms.slice(0, 8));
    const chat = read(chatKey, seedChat);
    chat.push(`You created a new room: ${name} (${mode}).`);
    write(chatKey, chat.slice(-8));

    renderRooms();
    renderChat();
  };

  const quickJoin = () => {
    const rooms = read(roomKey, seedRooms);
    const room = rooms[0];
    const chat = read(chatKey, seedChat);
    chat.push(`Quick join connected you to ${room.name}.`);
    write(chatKey, chat.slice(-8));
    renderChat();
  };

  document.getElementById('createRoomBtn')?.addEventListener('click', createRoom);
  document.getElementById('quickJoin')?.addEventListener('click', quickJoin);
  document.getElementById('hostLobby')?.addEventListener('click', () => document.getElementById('roomName')?.focus());

  if (!localStorage.getItem(roomKey)) write(roomKey, seedRooms);
  if (!localStorage.getItem(chatKey)) write(chatKey, seedChat);

  renderRooms();
  renderChat();
  renderMembers();
})();

'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  command: state => (args, player) => {
    const players = state.PlayerManager.getPlayersAsArray();
    Broadcast.sayAt(player, `<bold><yellow>Online Adventurers (${players.length})</yellow></bold>`);
    Broadcast.sayAt(player, Broadcast.line(54, '-', 'blue'));
    for (const p of players) {
      const pClass = (p.metadata && p.metadata.class) || 'warrior';
      const roomTitle = p.room ? p.room.title : 'The Sanctum';
      const roleTag = p.role === 2 ? ' <bold><yellow>[Admin]</yellow></bold>' : '';
      Broadcast.sayAt(player, `  • <bold><green>${p.name}</green></bold>${roleTag} — Lv.${p.level} ${pClass} (${roomTitle})`);
    }
  },
};

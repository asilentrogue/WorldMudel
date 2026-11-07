'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['kill', 'hit', 'fight'],
  command: state => (args, player) => {
    const query = (args || '').trim().toLowerCase();
    if (!query) {
      return Broadcast.sayAt(player, 'Attack whom?');
    }

    const room = player.room;
    if (!room) return;

    let target = null;
    for (const npc of room.npcs) {
      if (npc.keywords.includes(query) || npc.name.toLowerCase().includes(query)) {
        target = npc;
        break;
      }
    }

    if (!target) {
      return Broadcast.sayAt(player, `You don't see '${args}' here to attack.`);
    }

    if (!target.behaviors.has('combat')) {
      return Broadcast.sayAt(player, `<yellow>${target.name} is a peaceful guardian of the Sanctum and cannot be attacked.</yellow>`);
    }

    player.initiateCombat(target);
    Broadcast.sayAt(player, `<bold><red>You engage ${target.name} in combat!</red></bold>`);
    Broadcast.sayAtExcept(room, `${player.name} engages ${target.name} in combat!`, [player]);

    if (player.socket && typeof player.socket.syncState === 'function') {
      player.socket.syncState();
    }
  },
};

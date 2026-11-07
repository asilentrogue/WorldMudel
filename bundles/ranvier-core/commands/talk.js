'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['speak', 'ask', 'greet'],
  command: state => (args, player) => {
    const room = player.room;
    if (!room) return;

    const query = (args || '').trim().toLowerCase();
    let target = null;

    if (!query && room.npcs.size > 0) {
      target = [...room.npcs][0];
    } else {
      for (const npc of room.npcs) {
        if (npc.keywords.includes(query) || npc.name.toLowerCase().includes(query)) {
          target = npc;
          break;
        }
      }
    }

    if (!target) {
      return Broadcast.sayAt(player, query ? `You don't see '${args}' here.` : 'There is no one here to talk to.');
    }

    const line = (target.metadata && target.metadata.dialogue) || `${target.name} nods respectfully toward you.`;
    Broadcast.sayAt(player, `<bold><yellow>${target.name}</yellow></bold> says: <cyan>"${line}"</cyan>`);

    if (Array.isArray(target.quests) && target.quests.length > 0) {
      Broadcast.sayAt(player, `<yellow>Tip: Type <bold>quest list</bold> or <bold>quest start 1</bold> to accept missions from ${target.name}.</yellow>`);
    }
  },
};

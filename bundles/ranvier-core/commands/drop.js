'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  command: state => (args, player) => {
    const targetName = (args || '').trim().toLowerCase();
    if (!targetName) {
      return Broadcast.sayAt(player, 'Drop what?');
    }

    if (!player.inventory || !player.inventory.size) {
      return Broadcast.sayAt(player, 'You are not carrying anything.');
    }

    let found = null;
    for (const [, item] of player.inventory) {
      if (item.hasKeyword(targetName) || item.name.toLowerCase().includes(targetName)) {
        found = item;
        break;
      }
    }

    if (!found) {
      return Broadcast.sayAt(player, `You don't have '${args}' in your inventory.`);
    }

    player.removeItem(found);
    player.room.addItem(found);
    player.emit('drop', found);

    Broadcast.sayAt(player, `<yellow>You drop <bold>${found.name}</bold>.</yellow>`);
    Broadcast.sayAtExcept(player.room, `${player.name} drops ${found.name}.`, [player]);

    if (player.socket && typeof player.socket.syncState === 'function') {
      player.socket.syncState();
    }
  },
};

'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['take', 'loot', 'pick'],
  command: state => (args, player) => {
    const room = player.room;
    if (!room) return;

    const targetName = (args || '').trim().toLowerCase();
    if (!targetName) {
      return Broadcast.sayAt(player, 'Get what? Try <bold>get all</bold> or <bold>get &lt;item&gt;</bold>.');
    }

    if (player.isInventoryFull()) {
      return Broadcast.sayAt(player, '<red>Your inventory is full!</red>');
    }

    if (targetName === 'all') {
      const items = [...room.items];
      if (!items.length) {
        return Broadcast.sayAt(player, 'There is nothing here to pick up.');
      }
      for (const item of items) {
        if (player.isInventoryFull()) {
          Broadcast.sayAt(player, '<yellow>Your inventory is now full.</yellow>');
          break;
        }
        room.removeItem(item);
        player.addItem(item);
        player.emit('get', item);
        Broadcast.sayAt(player, `<green>You pick up: <bold>${item.name}</bold>.</green>`);
      }
      if (player.socket && typeof player.socket.syncState === 'function') {
        player.socket.syncState();
      }
      return;
    }

    let found = null;
    for (const item of room.items) {
      if (item.hasKeyword(targetName) || item.name.toLowerCase().includes(targetName)) {
        found = item;
        break;
      }
    }

    if (!found) {
      return Broadcast.sayAt(player, `You don't see '${args}' here.`);
    }

    room.removeItem(found);
    player.addItem(found);
    player.emit('get', found);

    Broadcast.sayAt(player, `<green>You pick up <bold>${found.name}</bold>.</green>`);
    Broadcast.sayAtExcept(room, `${player.name} picks up ${found.name}.`, [player]);

    if (player.socket && typeof player.socket.syncState === 'function') {
      player.socket.syncState();
    }
  },
};

'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['remove'],
  command: state => (args, player) => {
    const query = (args || '').trim().toLowerCase();
    if (!query) {
      return Broadcast.sayAt(player, 'Unequip which slot or item?');
    }

    let targetSlot = null;
    for (const [slot, item] of player.equipment) {
      if (slot.toLowerCase() === query || item.hasKeyword(query) || item.name.toLowerCase().includes(query)) {
        targetSlot = slot;
        break;
      }
    }

    if (!targetSlot) {
      return Broadcast.sayAt(player, `Nothing matching '${args}' is currently equipped.`);
    }

    if (player.isInventoryFull()) {
      return Broadcast.sayAt(player, '<red>Your inventory is full!</red>');
    }

    const item = player.equipment.get(targetSlot);
    player.unequip(targetSlot);
    if (item.metadata && item.metadata.armor && player.hasAttribute('armor')) {
      player.setAttributeBase('armor', Math.max(0, player.getBaseAttribute('armor') - item.metadata.armor));
    }

    Broadcast.sayAt(player, `<yellow>You unequip <bold>${item.name}</bold> from [${targetSlot}].</yellow>`);
    if (player.socket && typeof player.socket.syncState === 'function') {
      player.socket.syncState();
    }
  },
};

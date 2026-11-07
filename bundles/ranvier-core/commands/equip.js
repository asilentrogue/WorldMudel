'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['wield', 'wear'],
  command: state => (args, player) => {
    const targetName = (args || '').trim().toLowerCase();
    if (!targetName) {
      return Broadcast.sayAt(player, 'Equip which item from your inventory?');
    }

    if (!player.inventory || !player.inventory.size) {
      return Broadcast.sayAt(player, 'Your inventory is empty.');
    }

    let found = null;
    for (const [, item] of player.inventory) {
      if (item.hasKeyword(targetName) || item.name.toLowerCase().includes(targetName)) {
        found = item;
        break;
      }
    }

    if (!found) {
      return Broadcast.sayAt(player, `You do not carry '${args}'.`);
    }

    const slot = (found.metadata && found.metadata.slot) || (found.type === 'WEAPON' ? 'wield' : 'chest');
    if (player.equipment.has(slot)) {
      const existing = player.equipment.get(slot);
      player.unequip(slot);
      if (existing.metadata && existing.metadata.armor && player.hasAttribute('armor')) {
        player.setAttributeBase('armor', Math.max(0, player.getBaseAttribute('armor') - existing.metadata.armor));
      }
      Broadcast.sayAt(player, `<yellow>You unequip ${existing.name}.</yellow>`);
    }

    player.equip(found, slot);
    if (found.metadata && found.metadata.armor && player.hasAttribute('armor')) {
      player.setAttributeBase('armor', player.getBaseAttribute('armor') + found.metadata.armor);
    }

    Broadcast.sayAt(player, `<bold><green>You equip ${found.name} in your [${slot}] slot.</green></bold>`);
    Broadcast.sayAtExcept(player.room, `${player.name} equips ${found.name}.`, [player]);

    if (player.socket && typeof player.socket.syncState === 'function') {
      player.socket.syncState();
    }
  },
};

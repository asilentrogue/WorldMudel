'use strict';

const { Broadcast, Heal } = require('ranvier');

module.exports = {
  aliases: ['quaff', 'drink', 'read'],
  command: state => (args, player) => {
    const query = (args || '').trim().toLowerCase();
    if (!query) {
      return Broadcast.sayAt(player, 'Use which item from your inventory?');
    }

    if (!player.inventory || !player.inventory.size) {
      return Broadcast.sayAt(player, 'You have no items in your inventory.');
    }

    let found = null;
    for (const [, item] of player.inventory) {
      if (item.hasKeyword(query) || item.name.toLowerCase().includes(query)) {
        found = item;
        break;
      }
    }

    if (!found) {
      return Broadcast.sayAt(player, `You don't have '${args}' in your inventory.`);
    }

    if (!found.metadata || !found.metadata.usable) {
      return Broadcast.sayAt(player, `You cannot use ${found.name} directly.`);
    }

    if (found.metadata.healAmount && player.hasAttribute('health')) {
      const heal = new Heal('health', found.metadata.healAmount, player, found);
      heal.commit(player);
    }
    if (found.metadata.energyAmount && player.hasAttribute('energy')) {
      const energyHeal = new Heal('energy', found.metadata.energyAmount, player, found);
      energyHeal.commit(player);
    }
    if (found.metadata.xpBonus) {
      player.emit('experience', found.metadata.xpBonus);
    }

    player.removeItem(found);
    state.ItemManager.remove(found);

    Broadcast.sayAt(
      player,
      `<bold><green>You use ${found.name}! Vitals and arcane focus surge through you.</green></bold>`
    );

    if (player.socket && typeof player.socket.syncState === 'function') {
      player.socket.syncState();
    }
  },
};

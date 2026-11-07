'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['eq', 'gear'],
  command: state => (args, player) => {
    Broadcast.sayAt(player, '<bold><cyan>Equipped Gear</cyan></bold>');
    Broadcast.sayAt(player, Broadcast.line(48, '-', 'blue'));

    if (!player.equipment || !player.equipment.size) {
      Broadcast.sayAt(player, '  No equipment worn. Use <bold>equip &lt;item&gt;</bold>.');
      return;
    }

    for (const [slot, item] of player.equipment) {
      const bonus = item.metadata && item.metadata.minDamage
        ? ` (${item.metadata.minDamage}-${item.metadata.maxDamage} Dmg)`
        : item.metadata && item.metadata.armor
        ? ` (+${item.metadata.armor} Armor)`
        : '';
      Broadcast.sayAt(player, `  <yellow>[${slot.toUpperCase()}]</yellow> <bold>${item.name}</bold>${bonus}`);
    }
  },
};

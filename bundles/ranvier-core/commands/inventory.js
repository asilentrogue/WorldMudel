'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['i', 'inv'],
  command: state => (args, player) => {
    const count = player.inventory ? player.inventory.size : 0;
    const max = player.inventory ? player.inventory.getMax() : 16;

    Broadcast.sayAt(player, `<bold><cyan>Inventory (${count}/${max} slots)</cyan></bold>`);
    Broadcast.sayAt(player, Broadcast.line(48, '-', 'blue'));

    if (!player.inventory || !player.inventory.size) {
      Broadcast.sayAt(player, '  (Empty)');
      return;
    }

    for (const [, item] of player.inventory) {
      const slotHint = item.metadata && item.metadata.slot ? ` <yellow>[equip: ${item.metadata.slot}]</yellow>` : '';
      const useHint = item.metadata && item.metadata.usable ? ` <green>[usable]</green>` : '';
      Broadcast.sayAt(player, `  • <bold>${item.name}</bold>${slotHint}${useHint}`);
    }
  },
};

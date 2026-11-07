'use strict';

const { Broadcast, SkillErrors } = require('ranvier');

module.exports = {
  aliases: ['heal', 'fortify'],
  command: state => (args, player) => {
    const spell = state.SpellManager.get('mend');
    if (!spell) {
      return Broadcast.sayAt(player, 'Spell unavailable.');
    }

    try {
      spell.execute(args, player, player);
      if (player.socket && typeof player.socket.syncState === 'function') {
        player.socket.syncState();
      }
    } catch (err) {
      if (err instanceof SkillErrors.CooldownError) {
        const rem = Math.ceil(err.effect.remaining / 1000);
        Broadcast.sayAt(player, `<yellow>Astral Mend is on cooldown (${rem}s remaining).</yellow>`);
      } else if (err instanceof SkillErrors.NotEnoughResourcesError) {
        Broadcast.sayAt(player, '<red>Not enough Energy (requires 25 Energy).</red>');
      } else {
        Broadcast.sayAt(player, `<red>${err.message}</red>`);
      }
    }
  },
};

'use strict';

const { Broadcast, SkillErrors } = require('ranvier');

module.exports = {
  aliases: ['strike', 'slash'],
  command: state => (args, player) => {
    const skill = state.SkillManager.get('cleave');
    if (!skill) {
      return Broadcast.sayAt(player, 'Skill unavailable.');
    }

    let target = null;
    const query = (args || '').trim().toLowerCase();
    if (query) {
      for (const npc of player.room.npcs) {
        if (npc.keywords.includes(query) || npc.name.toLowerCase().includes(query)) {
          target = npc;
          break;
        }
      }
    } else if (player.isInCombat()) {
      target = [...player.combatants][0];
    }

    if (!target) {
      return Broadcast.sayAt(player, 'Use <bold>cleave &lt;target&gt;</bold> or use it while in combat.');
    }

    if (!target.behaviors.has('combat')) {
      return Broadcast.sayAt(player, `<yellow>${target.name} cannot be attacked.</yellow>`);
    }

    try {
      skill.execute(args, player, target);
      if (player.socket && typeof player.socket.syncState === 'function') {
        player.socket.syncState();
      }
    } catch (err) {
      if (err instanceof SkillErrors.CooldownError) {
        const rem = Math.ceil(err.effect.remaining / 1000);
        Broadcast.sayAt(player, `<yellow>Cleave is on cooldown (${rem}s remaining).</yellow>`);
      } else if (err instanceof SkillErrors.NotEnoughResourcesError) {
        Broadcast.sayAt(player, '<red>Not enough Energy (requires 20 Energy).</red>');
      } else {
        Broadcast.sayAt(player, `<red>${err.message}</red>`);
      }
    }
  },
};

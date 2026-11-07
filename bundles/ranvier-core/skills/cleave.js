'use strict';

const { Broadcast, Damage, SkillType } = require('ranvier');

module.exports = {
  name: 'Cleave',
  type: SkillType.SKILL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'energy',
    cost: 20,
  },
  cooldown: 6,

  run: state => function (args, player, target) {
    const str = player.hasAttribute('strength') ? player.getAttribute('strength') : 15;
    const weapon = player.equipment.get('wield');
    const weaponBonus = weapon && weapon.metadata && weapon.metadata.maxDamage ? weapon.metadata.maxDamage : 10;
    const amount = Math.floor(str * 1.4 + weaponBonus);

    Broadcast.sayAt(
      player,
      `<bold><yellow>You unleash a sweeping CLEAVE against ${target.name} for ${amount} damage!</yellow></bold>`
    );
    Broadcast.sayAtExcept(
      player.room,
      `${player.name} unleashes a sweeping cleave against ${target.name} for ${amount} damage!`,
      [player, target]
    );

    const damage = new Damage('health', amount, player, this);
    damage.commit(target);

    if (target.hasAttribute('health') && target.getAttribute('health') <= 0) {
      target.emit('killed', player);
    }
    return true;
  },

  info: function (player) {
    return 'Deliver a high-impact arc strike costing 20 Energy (6s cooldown).';
  },
};

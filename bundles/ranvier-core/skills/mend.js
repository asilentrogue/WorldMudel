'use strict';

const { Broadcast, Heal, SkillType } = require('ranvier');

module.exports = {
  name: 'Astral Mend',
  type: SkillType.SPELL,
  requiresTarget: false,
  targetSelf: true,
  initiatesCombat: false,
  resource: {
    attribute: 'energy',
    cost: 25,
  },
  cooldown: 8,

  run: state => function (args, player) {
    const intellect = player.hasAttribute('intellect') ? player.getAttribute('intellect') : 10;
    const healAmount = 45 + intellect * 3;
    const heal = new Heal('health', healAmount, player, this);
    heal.commit(player);

    const fortify = state.EffectFactory.create('fortify');
    player.addEffect(fortify);

    Broadcast.sayAt(
      player,
      `<bold><green>You channel Astral Mend, restoring ${healAmount} Health and fortifying your armor!</green></bold>`
    );
    Broadcast.sayAtExcept(
      player.room,
      `${player.name} channels luminous energy, mending their wounds.`,
      [player]
    );
    return true;
  },

  info: function (player) {
    return 'Restore Health and apply Astral Fortification for 25 Energy (8s cooldown).';
  },
};

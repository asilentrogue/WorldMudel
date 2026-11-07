'use strict';

const { Broadcast, EffectFlag } = require('ranvier');

module.exports = {
  config: {
    name: 'Astral Fortification',
    description: 'Increases Armor by 12 and Stamina by 4.',
    duration: 60000,
    type: 'buff.fortify',
    refreshes: true,
  },
  flags: [EffectFlag.BUFF],
  modifiers: {
    attributes: {
      armor: current => current + 12,
      stamina: current => current + 4,
    },
  },
  listeners: {
    effectActivated: function () {
      Broadcast.sayAt(this.target, '<bold><cyan>A shimmering ward of astral light surrounds you (+12 Armor, +4 Stamina).</cyan></bold>');
    },
    effectDeactivated: function () {
      Broadcast.sayAt(this.target, '<cyan>Your Astral Fortification fades away.</cyan>');
    },
  },
};

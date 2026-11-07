'use strict';

module.exports = [
  { name: 'strength', base: 15 },
  { name: 'agility', base: 12 },
  { name: 'intellect', base: 10 },
  { name: 'stamina', base: 12 },
  {
    name: 'health',
    base: 100,
    formula: {
      requires: ['stamina'],
      fn: function (character, health, stamina) {
        return health + (stamina * 4);
      },
    },
  },
  { name: 'armor', base: 0 },
  {
    name: 'energy',
    base: 100,
    formula: {
      requires: ['intellect'],
      fn: function (character, energy, intellect) {
        return energy + (intellect * 2);
      },
    },
  },
  { name: 'critical', base: 5 },
];

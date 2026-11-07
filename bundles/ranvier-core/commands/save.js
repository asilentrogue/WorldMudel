'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  command: state => (args, player) => {
    player.save(() => {
      Broadcast.sayAt(player, `<bold><green>Character state for ${player.name} saved to Ranvier data store.</green></bold>`);
    });
  },
};

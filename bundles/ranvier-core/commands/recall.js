'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  command: state => (args, player) => {
    if (player.isInCombat()) {
      return Broadcast.sayAt(player, '<red>You cannot recall while in combat! Use <bold>flee</bold> first.</red>');
    }
    const home = state.RoomManager.getRoom(state.Config.get('startingRoom') || 'limbo:white');
    if (!home) {
      return Broadcast.sayAt(player, '<red>Sanctum anchor unavailable.</red>');
    }
    if (player.room === home) {
      return Broadcast.sayAt(player, '<cyan>You are already standing in The White Sanctum of Limbo.</cyan>');
    }

    Broadcast.sayAtExcept(player.room, `${player.name} vanishes in a column of astral light.`, [player]);
    player.moveTo(home);
    Broadcast.sayAt(player, '<bold><cyan>You recall to The White Sanctum of Limbo.</cyan></bold>');
    Broadcast.sayAtExcept(home, `${player.name} materializes at the astral compass.`, [player]);
    state.CommandManager.get('look').execute('', player);
  },
};

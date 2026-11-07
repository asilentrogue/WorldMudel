'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['retreat', 'escape'],
  command: state => (args, player) => {
    if (!player.isInCombat()) {
      return Broadcast.sayAt(player, 'You are not currently in combat.');
    }

    const room = player.room;
    const exits = room ? room.getExits() : [];
    if (!exits.length) {
      return Broadcast.sayAt(player, '<red>There is nowhere to flee!</red>');
    }

    const randomExit = exits[Math.floor(Math.random() * exits.length)];
    const nextRoom = state.RoomManager.getRoom(randomExit.roomId);
    if (!nextRoom) {
      return Broadcast.sayAt(player, '<red>You fail to find an escape route!</red>');
    }

    player.removeFromCombat();
    Broadcast.sayAt(player, `<yellow>You disengage from combat and flee ${randomExit.direction}!</yellow>`);
    Broadcast.sayAtExcept(room, `${player.name} flees ${randomExit.direction}!`, [player]);

    player.moveTo(nextRoom);
    state.CommandManager.get('look').execute('', player);
  },
};

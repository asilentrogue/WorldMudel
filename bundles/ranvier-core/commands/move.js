'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['go', 'walk', 'north', 'south', 'east', 'west', 'up', 'down', 'n', 's', 'e', 'w', 'u', 'd'],
  command: state => (args, player, arg0) => {
    const room = player.room;
    if (!room) {
      return Broadcast.sayAt(player, 'You cannot move right now.');
    }

    if (player.isInCombat()) {
      return Broadcast.sayAt(player, '<red>You are locked in combat! Use <bold>flee</bold> to escape.</red>');
    }

    const dirShortcuts = {
      n: 'north',
      s: 'south',
      e: 'east',
      w: 'west',
      u: 'up',
      d: 'down',
    };

    let direction = (args || '').trim().toLowerCase();
    if (!direction && arg0) {
      const invoked = arg0.trim().toLowerCase();
      if (invoked !== 'move' && invoked !== 'go' && invoked !== 'walk') {
        direction = invoked;
      }
    }
    direction = dirShortcuts[direction] || direction;

    if (!direction) {
      return Broadcast.sayAt(player, 'Move in which direction? (north, south, east, west, up, down)');
    }

    const exit = room.findExit(direction);
    if (!exit) {
      return Broadcast.sayAt(player, `<yellow>There is no exit to the ${direction}.</yellow>`);
    }

    const nextRoom = state.RoomManager.getRoom(exit.roomId);
    if (!nextRoom) {
      return Broadcast.sayAt(player, '<red>That passage leads into uncharted ether.</red>');
    }

    // Check doors
    const door = room.getDoor(nextRoom) || nextRoom.getDoor(room);
    if (door && (door.closed || door.locked)) {
      return Broadcast.sayAt(player, `<yellow>The door to the ${exit.direction} is ${door.locked ? 'locked' : 'closed'}.</yellow>`);
    }

    Broadcast.sayAtExcept(room, `${player.name} leaves ${exit.direction}.`, [player]);
    player.moveTo(nextRoom);
    Broadcast.sayAtExcept(nextRoom, `${player.name} arrives.`, [player]);

    state.CommandManager.get('look').execute('', player);
  },
};

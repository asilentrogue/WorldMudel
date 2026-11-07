'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['l', 'examine', 'inspect'],
  command: state => (args, player) => {
    const room = player.room;
    if (!room) {
      return Broadcast.sayAt(player, '<red>You are floating in a void without a room.</red>');
    }

    if (args && args.trim().length > 0) {
      const search = args.trim().toLowerCase();

      // Check room items
      for (const item of room.items) {
        if (item.hasKeyword(search) || item.name.toLowerCase().includes(search)) {
          Broadcast.sayAt(player, `<bold><cyan>${item.name}</cyan></bold>`);
          Broadcast.sayAt(player, item.description);
          if (item.metadata && (item.metadata.minDamage || item.metadata.armor)) {
            const stats = [];
            if (item.metadata.slot) stats.push(`Slot: ${item.metadata.slot}`);
            if (item.metadata.minDamage) stats.push(`Damage: ${item.metadata.minDamage}-${item.metadata.maxDamage}`);
            if (item.metadata.armor) stats.push(`Armor: +${item.metadata.armor}`);
            Broadcast.sayAt(player, `<yellow>[${stats.join(' · ')}]</yellow>`);
          }
          return;
        }
      }

      // Check inventory items
      if (player.inventory) {
        for (const [, item] of player.inventory) {
          if (item.hasKeyword(search) || item.name.toLowerCase().includes(search)) {
            Broadcast.sayAt(player, `<bold><cyan>${item.name}</cyan></bold> (in inventory)`);
            Broadcast.sayAt(player, item.description);
            return;
          }
        }
      }

      // Check NPCs
      for (const npc of room.npcs) {
        if (npc.keywords.includes(search) || npc.name.toLowerCase().includes(search)) {
          const hp = npc.hasAttribute('health') ? `${npc.getAttribute('health')}/${npc.getMaxAttribute('health')} HP` : '';
          Broadcast.sayAt(player, `<bold><yellow>${npc.name}</yellow></bold> <white>[Level ${npc.level} · ${hp}]</white>`);
          Broadcast.sayAt(player, npc.description || 'An inhabitant of the realm.');
          if (npc.metadata && npc.metadata.dialogue) {
            Broadcast.sayAt(player, `<cyan>"${npc.metadata.dialogue}"</cyan>`);
          }
          return;
        }
      }

      // Check other players
      for (const other of room.players) {
        if (other.name.toLowerCase().includes(search)) {
          Broadcast.sayAt(player, `<bold><green>${other.name}</green></bold> [Level ${other.level} Adventurer]`);
          return;
        }
      }

      return Broadcast.sayAt(player, `You do not see '${args}' here.`);
    }

    // Room Header & Coordinates
    const coordStr = room.coordinates
      ? ` [${room.coordinates.x}, ${room.coordinates.y}, ${room.coordinates.z}]`
      : '';
    Broadcast.sayAt(player, `<bold><yellow>${room.title}</yellow></bold><cyan>${coordStr}</cyan>`);
    Broadcast.sayAt(player, Broadcast.line(64, '-', 'blue'));
    Broadcast.sayAt(player, room.description, 76);
    Broadcast.sayAt(player, '');

    // Exits
    const exits = room.getExits();
    const exitNames = exits.map(ex => {
      const targetRoom = state.RoomManager.getRoom(ex.roomId);
      return `<bold><cyan>${ex.direction}</cyan></bold>${targetRoom ? ` (${targetRoom.title})` : ''}`;
    });
    Broadcast.sayAt(player, `<bold>[Exits:</bold> ${exitNames.length ? exitNames.join(', ') : 'none'}<bold>]</bold>`);

    // Items in room
    for (const item of room.items) {
      Broadcast.sayAt(player, `<magenta>[Item]</magenta> <bold>${item.name}</bold> — ${item.roomDesc || item.description}`);
    }

    // NPCs in room
    for (const npc of room.npcs) {
      const questBadge = Array.isArray(npc.quests) && npc.quests.length > 0 ? ' <bold><yellow>[!Quest]</yellow></bold>' : '';
      const hostileBadge = npc.metadata && npc.metadata.hostile ? ' <bold><red>[Hostile]</red></bold>' : '';
      const hp = npc.hasAttribute('health') ? ` (${npc.getAttribute('health')}/${npc.getMaxAttribute('health')} HP)` : '';
      Broadcast.sayAt(player, `<yellow>[NPC]</yellow> <bold>${npc.name}</bold> [Lv.${npc.level}]${hp}${questBadge}${hostileBadge}`);
    }

    // Other players in room
    for (const other of room.players) {
      if (other !== player) {
        Broadcast.sayAt(player, `<green>[Player]</green> <bold>${other.name}</bold> [Lv.${other.level}] is standing here.`);
      }
    }

    if (player.socket && typeof player.socket.syncState === 'function') {
      player.socket.syncState();
    }
  },
};

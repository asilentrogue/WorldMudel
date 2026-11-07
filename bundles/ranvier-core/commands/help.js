'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['commands', '?'],
  command: state => (args, player) => {
    Broadcast.sayAt(player, '<bold><yellow>RanvierMUD Command Reference</yellow></bold>');
    Broadcast.sayAt(player, Broadcast.line(64, '-', 'blue'));
    Broadcast.sayAt(player, '  <bold><cyan>Exploration & Movement</cyan></bold>');
    Broadcast.sayAt(player, '    look [target]          Inspect room, item, or NPC (alias: l)');
    Broadcast.sayAt(player, '    north/south/east/west  Move between connected rooms (n, s, e, w, u, d)');
    Broadcast.sayAt(player, '    recall                 Teleport back to The White Sanctum of Limbo');
    Broadcast.sayAt(player, '');
    Broadcast.sayAt(player, '  <bold><cyan>Items & Equipment</cyan></bold>');
    Broadcast.sayAt(player, '    get <item|all>         Pick up items from the current room');
    Broadcast.sayAt(player, '    drop <item>            Drop an item from your inventory');
    Broadcast.sayAt(player, '    inventory              List carried items (alias: i)');
    Broadcast.sayAt(player, '    equip <item>           Wield a weapon or wear armor');
    Broadcast.sayAt(player, '    unequip <item|slot>    Remove equipped gear');
    Broadcast.sayAt(player, '    equipment              Inspect equipped weapons and armor (alias: eq)');
    Broadcast.sayAt(player, '    use <item>             Consume a potion or study a tome');
    Broadcast.sayAt(player, '');
    Broadcast.sayAt(player, '  <bold><cyan>Combat & Skills</cyan></bold>');
    Broadcast.sayAt(player, '    attack <npc>           Engage a hostile or training NPC in combat');
    Broadcast.sayAt(player, '    cleave [npc]           Heavy arc strike costing 20 Energy (6s cooldown)');
    Broadcast.sayAt(player, '    mend                   Restore Health & add +12 Armor buff (25 Energy)');
    Broadcast.sayAt(player, '    flee                   Disengage from combat and retreat');
    Broadcast.sayAt(player, '');
    Broadcast.sayAt(player, '  <bold><cyan>Quests, Social & Character</cyan></bold>');
    Broadcast.sayAt(player, '    talk [npc]             Speak with an NPC in the room');
    Broadcast.sayAt(player, '    quest list|start|log   View, accept, or complete quests (e.g. quest start 1)');
    Broadcast.sayAt(player, '    chat <msg> / say <msg> Talk on global or room multiplayer channels');
    Broadcast.sayAt(player, '    score / who / save     Character stats, online players, and save state');
    Broadcast.sayAt(player, Broadcast.line(64, '-', 'blue'));
  },
};

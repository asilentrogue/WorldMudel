'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['quests', 'q'],
  command: state => (args, player) => {
    const parts = (args || '').trim().split(/\s+/).filter(Boolean);
    const sub = (parts[0] || 'log').toLowerCase();
    const arg = parts[1];

    if (sub === 'list') {
      const roomNpcs = player.room ? [...player.room.npcs] : [];
      const available = [];
      for (const npc of roomNpcs) {
        if (Array.isArray(npc.quests)) {
          for (const qRef of npc.quests) {
            const qDef = state.QuestFactory.get(qRef);
            if (qDef) {
              available.push({ ref: qRef, def: qDef, npc });
            }
          }
        }
      }

      Broadcast.sayAt(player, '<bold><yellow>Available Quests in Room</yellow></bold>');
      Broadcast.sayAt(player, Broadcast.line(56, '-', 'blue'));
      if (!available.length) {
        Broadcast.sayAt(player, '  No quest givers in this room. Return to Archivist Veyra in The White Sanctum.');
        return;
      }

      available.forEach((entry, idx) => {
        const active = player.questTracker.isActive(entry.ref);
        const completed = player.questTracker.isComplete(entry.ref);
        const status = completed
          ? '<green>[Completed]</green>'
          : active
          ? '<cyan>[In Progress]</cyan>'
          : '<yellow>[Available]</yellow>';
        Broadcast.sayAt(
          player,
          `  <bold>[${idx + 1}] ${entry.def.config.title}</bold> (${entry.ref}) ${status}\r\n` +
          `      Giver: ${entry.npc.name} — ${entry.def.config.description}`
        );
      });
      Broadcast.sayAt(player, '  Use <bold>quest start &lt;#&gt;</bold> or <bold>quest complete &lt;#&gt;</bold>.');
      return;
    }

    if (sub === 'start' || sub === 'accept') {
      const qRef = arg && arg.includes(':') ? arg : `limbo:${arg || '1'}`;
      if (!state.QuestFactory.canStart(player, qRef)) {
        if (player.questTracker.isActive(qRef)) {
          return Broadcast.sayAt(player, '<yellow>You are already on that quest! Check <bold>quest log</bold>.</yellow>');
        }
        if (player.questTracker.isComplete(qRef)) {
          return Broadcast.sayAt(player, '<green>You have already completed that quest.</green>');
        }
        return Broadcast.sayAt(player, `<red>Quest '${qRef}' was not found.</red>`);
      }

      const quest = state.QuestFactory.create(state, qRef, player);
      quest.on('progress', progress => {
        Broadcast.sayAt(player, `<bold><yellow>[Quest Progress] ${quest.config.title}: ${progress.display} (${progress.percent}%)</yellow></bold>`);
      });
      player.questTracker.start(quest);
      player.save();

      Broadcast.sayAt(player, `<bold><green>Quest Accepted: ${quest.config.title}!</green></bold>`);
      Broadcast.sayAt(player, `<cyan>${quest.config.description}</cyan>`);
      if (player.socket && typeof player.socket.syncState === 'function') {
        player.socket.syncState();
      }
      return;
    }

    if (sub === 'complete' || sub === 'turnin') {
      const qRef = arg && arg.includes(':') ? arg : `limbo:${arg || '1'}`;
      if (!player.questTracker.isActive(qRef)) {
        return Broadcast.sayAt(player, `<yellow>You do not have active quest '${qRef}'.</yellow>`);
      }

      const quest = player.questTracker.get(qRef);
      if (quest.getProgress().percent < 100) {
        return Broadcast.sayAt(
          player,
          `<yellow>You haven't finished all objectives for '${quest.config.title}' yet (${quest.getProgress().percent}%).</yellow>`
        );
      }

      if (quest.config.completionMessage) {
        Broadcast.sayAt(player, `<cyan>${quest.config.completionMessage}</cyan>`);
      }
      quest.complete();
      player.save();
      Broadcast.sayAt(player, `<bold><green>Quest Completed: ${quest.config.title}!</green></bold>`);
      if (player.socket && typeof player.socket.syncState === 'function') {
        player.socket.syncState();
      }
      return;
    }

    // Default: quest log
    Broadcast.sayAt(player, '<bold><yellow>Active Quest Journal</yellow></bold>');
    Broadcast.sayAt(player, Broadcast.line(56, '-', 'blue'));
    const activeQuests = [...player.questTracker.active.values()];
    if (!activeQuests.length) {
      Broadcast.sayAt(player, '  No active quests. Type <bold>quest list</bold> near Archivist Veyra.');
    } else {
      for (const [, q] of player.questTracker.active) {
        const prog = q.getProgress();
        Broadcast.sayAt(player, `  • <bold>${q.config.title}</bold> [${q.entityReference}] — <cyan>${prog.percent}%</cyan>`);
        Broadcast.sayAt(player, `    ${prog.display}`);
      }
    }
  },
};

'use strict';

/**
 * Verifies that the Ranvier engine, bundles, areas, entities, and accounts
 * hydrate cleanly without starting the network listener.
 */
const { init } = require('../ranvier');

async function verify() {
  try {
    const state = await init(false);
    const roomCount = state.RoomManager.rooms.size;
    const cmdCount = state.CommandManager.commands.size;
    if (roomCount === 0 || cmdCount === 0) {
      console.error(`Build verification failed: rooms=${roomCount}, commands=${cmdCount}`);
      process.exit(1);
    }
    console.log(`Ranvier engine verified: ${roomCount} rooms, ${cmdCount} commands loaded.`);
    process.exit(0);
  } catch (err) {
    console.error('Ranvier build verification failed:', err);
    process.exit(1);
  }
}

verify();

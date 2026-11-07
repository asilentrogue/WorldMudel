'use strict';

const { QuestReward } = require('ranvier');

class ExperienceReward extends QuestReward {
  static reward(GameState, quest, config, player) {
    const amount = config.amount || 50;
    player.emit('experience', amount);
  }

  static display(GameState, quest, config, player) {
    return `Experience: ${config.amount || 50} XP`;
  }
}

module.exports = ExperienceReward;

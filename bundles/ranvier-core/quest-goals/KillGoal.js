'use strict';

const { QuestGoal } = require('ranvier');

class KillGoal extends QuestGoal {
  constructor(quest, config, player) {
    config = Object.assign({
      title: 'Defeat Target',
      npc: null,
      count: 1,
    }, config);

    super(quest, config, player);

    this.state = {
      count: 0,
    };

    this.on('deathblow', this._targetKilled);
  }

  getProgress() {
    const percent = Math.min(100, Math.round((this.state.count / this.config.count) * 100));
    const display = `${this.config.title}: [${this.state.count}/${this.config.count}]`;
    return { percent, display };
  }

  _targetKilled(target) {
    if (target.entityReference !== this.config.npc) {
      return;
    }
    this.state.count = Math.min(this.config.count, this.state.count + 1);
    this.emit('progress', this.getProgress());
  }
}

module.exports = KillGoal;

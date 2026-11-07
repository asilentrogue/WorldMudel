'use strict';

const { QuestGoal } = require('ranvier');

class FetchGoal extends QuestGoal {
  constructor(quest, config, player) {
    config = Object.assign({
      title: 'Retrieve Item',
      item: null,
      count: 1,
      removeItem: false,
    }, config);

    super(quest, config, player);

    this.state = {
      count: 0,
    };

    this.on('get', this._getItem);
    this.on('drop', this._dropItem);
  }

  getProgress() {
    const percent = Math.min(100, Math.round((this.state.count / this.config.count) * 100));
    const display = `${this.config.title}: [${this.state.count}/${this.config.count}]`;
    return { percent, display };
  }

  _getItem(item) {
    if (item.entityReference !== this.config.item) {
      return;
    }
    this.state.count = Math.min(this.config.count, this.state.count + 1);
    this.emit('progress', this.getProgress());
  }

  _dropItem(item) {
    if (item.entityReference !== this.config.item) {
      return;
    }
    this.state.count = Math.max(0, this.state.count - 1);
    this.emit('progress', this.getProgress());
  }
}

module.exports = FetchGoal;

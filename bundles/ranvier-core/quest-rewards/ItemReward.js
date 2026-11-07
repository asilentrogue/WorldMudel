'use strict';

const { QuestReward, Broadcast } = require('ranvier');

class ItemReward extends QuestReward {
  static reward(GameState, quest, config, player) {
    if (!config.item) return;
    const areaName = config.item.split(':')[0];
    const area = GameState.AreaManager.getArea(areaName);
    if (!area) return;
    const item = GameState.ItemFactory.create(area, config.item);
    item.hydrate(GameState);
    GameState.ItemManager.add(item);
    if (!player.isInventoryFull()) {
      player.addItem(item);
      Broadcast.sayAt(player, `<bold><green>Received quest reward: ${item.name}!</green></bold>`);
    } else if (player.room) {
      player.room.addItem(item);
      Broadcast.sayAt(player, `<bold><yellow>Your inventory is full; ${item.name} was placed in the room.</yellow></bold>`);
    }
  }

  static display(GameState, quest, config, player) {
    return `Item: ${config.item}`;
  }
}

module.exports = ItemReward;

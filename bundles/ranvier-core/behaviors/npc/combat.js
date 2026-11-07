'use strict';

const { Broadcast, Damage } = require('ranvier');

module.exports = {
  listeners: {
    updateTick: state => function () {
      if (!this.isInCombat()) {
        return;
      }

      this._combatTick = (this._combatTick || 0) + 1;
      if (this._combatTick < 22) {
        return;
      }
      this._combatTick = 0;

      const target = [...this.combatants][0];
      if (!target || target.room !== this.room) {
        this.removeFromCombat();
        return;
      }

      const baseDmg = (this.level || 1) * 5 + Math.floor(Math.random() * 6);
      const armor = target.hasAttribute('armor') ? target.getAttribute('armor') : 0;
      const mitigated = Math.max(1, baseDmg - Math.floor(armor * 0.35));

      Broadcast.sayAt(target, `<red>${this.name} attacks you for <bold>${mitigated}</bold> damage!</red>`);
      Broadcast.sayAtExcept(this.room, `${this.name} attacks ${target.name} for ${mitigated} damage!`, [target]);

      const damage = new Damage('health', mitigated, this, this);
      damage.commit(target);

      if (target.hasAttribute('health') && target.getAttribute('health') <= 0) {
        target.emit('killed', this);
      } else if (target.socket && typeof target.socket.syncState === 'function') {
        target.socket.syncState();
      }
    },

    killed: state => function (killer) {
      this.removeFromCombat();
      const room = this.room;
      const sourceRoom = this.sourceRoom;
      const entityRef = this.entityReference;
      const xpGain = (this.level || 1) * 45;

      if (room) {
        Broadcast.sayAt(room, `<bold><yellow>${this.name} collapses in defeat!</yellow></bold>`);
      }

      if (killer && !killer.isNpc) {
        killer.emit('deathblow', this);
        killer.emit('experience', xpGain);

        // Drop any default items into the room
        if (room && Array.isArray(this.defaultItems) && this.defaultItems.length > 0) {
          for (const itemRef of this.defaultItems) {
            try {
              const dropItem = state.ItemFactory.create(this.area, itemRef);
              dropItem.hydrate(state);
              state.ItemManager.add(dropItem);
              room.addItem(dropItem);
              Broadcast.sayAt(room, `<cyan>${this.name} drops ${dropItem.name}!</cyan>`);
            } catch (e) {
              // ignore invalid drop ref
            }
          }
        }
      }

      state.MobManager.removeMob(this);

      // Schedule respawn after 25 seconds
      if (sourceRoom && entityRef) {
        setTimeout(() => {
          try {
            const respawned = sourceRoom.spawnNpc(state, entityRef);
            Broadcast.sayAt(sourceRoom, `<cyan>${respawned.name} materializes from the ether.</cyan>`);
          } catch (e) {
            // ignore respawn error
          }
        }, 25000);
      }
    },
  },
};

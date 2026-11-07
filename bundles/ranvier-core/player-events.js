'use strict';

const { Broadcast, Damage, Heal } = require('ranvier');

module.exports = {
  listeners: {
    commandQueued: state => function (commandIndex) {
      const command = this.commandQueue.queue[commandIndex];
      const ttr = (this.commandQueue.getTimeTilRun(commandIndex) || 0).toFixed(1);
      Broadcast.sayAt(this, `<bold><yellow>Queued</yellow> <white>${command.label}</white> (${ttr}s)</bold>`);
    },

    updateTick: state => function () {
      if (this.commandQueue.hasPending && this.commandQueue.execute()) {
        Broadcast.prompt(this);
      }

      // Passive health and energy regeneration every 4 seconds (40 ticks at 100ms)
      this._regenTick = (this._regenTick || 0) + 1;
      if (this._regenTick >= 40) {
        this._regenTick = 0;
        if (!this.isInCombat()) {
          if (this.hasAttribute('health') && this.getAttribute('health') < this.getMaxAttribute('health')) {
            const healAmt = Math.max(2, Math.floor(this.getMaxAttribute('health') * 0.05));
            const heal = new Heal('health', healAmt, this);
            heal.commit(this);
          }
          if (this.hasAttribute('energy') && this.getAttribute('energy') < this.getMaxAttribute('energy')) {
            const energyAmt = Math.max(4, Math.floor(this.getMaxAttribute('energy') * 0.08));
            const heal = new Heal('energy', energyAmt, this);
            heal.commit(this);
          }
        }
      }

      // Active combat round processing (every 2 seconds / 20 ticks)
      if (this.isInCombat()) {
        this._combatTick = (this._combatTick || 0) + 1;
        if (this._combatTick >= 20) {
          this._combatTick = 0;
          const target = [...this.combatants][0];
          if (!target || target.room !== this.room) {
            this.removeFromCombat();
            return;
          }

          const weapon = this.equipment.get('wield');
          const str = this.hasAttribute('strength') ? this.getAttribute('strength') : 12;
          const baseMin = weapon && weapon.metadata && weapon.metadata.minDamage ? weapon.metadata.minDamage : 4;
          const baseMax = weapon && weapon.metadata && weapon.metadata.maxDamage ? weapon.metadata.maxDamage : 9;
          const rawRoll = baseMin + Math.floor(Math.random() * (baseMax - baseMin + 1)) + Math.floor(str * 0.45);
          const critChance = this.hasAttribute('critical') ? this.getAttribute('critical') : 5;
          const isCrit = Math.random() * 100 < critChance;
          const finalDmg = Math.max(1, Math.floor(isCrit ? rawRoll * 1.6 : rawRoll));

          const weaponName = weapon ? weapon.name : 'fists';
          const critTag = isCrit ? ' <bold><yellow>[CRITICAL!]</yellow></bold>' : '';
          Broadcast.sayAt(
            this,
            `<green>You strike ${target.name} with your ${weaponName} for <bold>${finalDmg}</bold> damage!${critTag}</green>`
          );
          Broadcast.sayAtExcept(
            this.room,
            `${this.name} strikes ${target.name} with ${weaponName} for ${finalDmg} damage!`,
            [this, target]
          );

          const damage = new Damage('health', finalDmg, this, weapon || this);
          damage.commit(target);

          if (target.hasAttribute('health') && target.getAttribute('health') <= 0) {
            target.emit('killed', this);
          } else {
            Broadcast.prompt(this);
          }

          if (this.socket && typeof this.socket.syncState === 'function') {
            this.socket.syncState();
          }
        }
      }
    },

    experience: state => function (amount) {
      Broadcast.sayAt(this, `<bold><cyan>You gain ${amount} experience points!</cyan></bold>`);
      this.experience = (this.experience || 0) + amount;
      const needed = this.level * 100;
      if (this.experience >= needed) {
        this.emit('level');
      }
      if (this.socket && typeof this.socket.syncState === 'function') {
        this.socket.syncState();
      }
    },

    level: state => function () {
      const needed = this.level * 100;
      this.experience = Math.max(0, this.experience - needed);
      this.level += 1;

      if (this.hasAttribute('strength')) this.setAttributeBase('strength', this.getBaseAttribute('strength') + 2);
      if (this.hasAttribute('stamina')) this.setAttributeBase('stamina', this.getBaseAttribute('stamina') + 2);
      if (this.hasAttribute('agility')) this.setAttributeBase('agility', this.getBaseAttribute('agility') + 1);
      if (this.hasAttribute('intellect')) this.setAttributeBase('intellect', this.getBaseAttribute('intellect') + 1);
      if (this.hasAttribute('health')) this.setAttributeToMax('health');
      if (this.hasAttribute('energy')) this.setAttributeToMax('energy');

      Broadcast.sayAt(
        this,
        `<bold><yellow>========================================================</yellow></bold>\r\n` +
        `<bold><yellow>  LEVEL UP! You have reached Level ${this.level}!</yellow></bold>\r\n` +
        `<bold><yellow>  Your attributes have increased and vitals are restored.</yellow></bold>\r\n` +
        `<bold><yellow>========================================================</yellow></bold>`
      );
      this.save();
    },

    save: state => async function (callback) {
      await state.PlayerManager.save(this);
      if (typeof callback === 'function') {
        callback();
      }
    },

    killed: state => function (killer) {
      this.removeFromCombat();
      Broadcast.sayAt(this, `<bold><red>You have been defeated by ${killer ? killer.name : 'an unknown force'}!</red></bold>`);
      Broadcast.sayAt(this, `<cyan>Archivist Veyra pulls your spirit back to the White Sanctum of Limbo...</cyan>`);

      if (this.hasAttribute('health')) {
        this.setAttributeToMax('health');
      }
      if (this.hasAttribute('energy')) {
        this.setAttributeToMax('energy');
      }

      const startRoom = state.RoomManager.getRoom(state.Config.get('startingRoom') || 'limbo:white');
      if (startRoom && this.room !== startRoom) {
        this.moveTo(startRoom);
        state.CommandManager.get('look').execute('', this);
      }
      Broadcast.prompt(this);
      if (this.socket && typeof this.socket.syncState === 'function') {
        this.socket.syncState();
      }
    },
  },
};

'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['stats', 'sheet', 'status'],
  command: state => (args, player) => {
    const hp = player.hasAttribute('health') ? `${player.getAttribute('health')}/${player.getMaxAttribute('health')}` : '100/100';
    const energy = player.hasAttribute('energy') ? `${player.getAttribute('energy')}/${player.getMaxAttribute('energy')}` : '100/100';
    const str = player.hasAttribute('strength') ? player.getAttribute('strength') : 15;
    const agi = player.hasAttribute('agility') ? player.getAttribute('agility') : 12;
    const intel = player.hasAttribute('intellect') ? player.getAttribute('intellect') : 10;
    const sta = player.hasAttribute('stamina') ? player.getAttribute('stamina') : 12;
    const arm = player.hasAttribute('armor') ? player.getAttribute('armor') : 0;
    const crit = player.hasAttribute('critical') ? player.getAttribute('critical') : 5;
    const pClass = (player.metadata && player.metadata.class) || 'warrior';
    const nextXp = player.level * 100;

    Broadcast.sayAt(player, `<bold><yellow>Character Sheet — ${player.name}</yellow></bold> <cyan>[Level ${player.level} ${pClass.toUpperCase()}]</cyan>`);
    Broadcast.sayAt(player, Broadcast.line(60, '-', 'blue'));
    Broadcast.sayAt(player, `  <bold>Health:</bold>    <green>${hp}</green>      <bold>Energy:</bold>    <cyan>${energy}</cyan>`);
    Broadcast.sayAt(player, `  <bold>Strength:</bold>  ${str}           <bold>Agility:</bold>   ${agi}`);
    Broadcast.sayAt(player, `  <bold>Intellect:</bold> ${intel}           <bold>Stamina:</bold>   ${sta}`);
    Broadcast.sayAt(player, `  <bold>Armor:</bold>     ${arm}            <bold>Critical:</bold>  ${crit}%`);
    Broadcast.sayAt(player, `  <bold>XP:</bold>        ${player.experience || 0} / ${nextXp} XP`);
    Broadcast.sayAt(player, `  <bold>Location:</bold>  ${player.room ? player.room.title : 'Limbo'}`);
    Broadcast.sayAt(player, Broadcast.line(60, '-', 'blue'));
  },
};

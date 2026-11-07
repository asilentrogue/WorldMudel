'use strict';

const {
  WorldAudience,
  RoomAudience,
  PrivateAudience,
  PartyAudience,
} = require('ranvier');
const { Channel } = require('ranvier').Channel;

module.exports = [
  new Channel({
    name: 'chat',
    aliases: ['gossip', '.'],
    color: ['bold', 'green'],
    description: 'Broadcast a message to all adventurers across the realm.',
    audience: new WorldAudience(),
    formatter: {
      sender: function (sender, target, message, colorify) {
        return colorify(`[chat] ${sender.name}: ${message}`);
      },
      target: function (sender, target, message, colorify) {
        return colorify(`[chat] ${sender.name}: ${message}`);
      },
    },
  }),
  new Channel({
    name: 'say',
    aliases: ["'"],
    color: ['cyan'],
    description: 'Speak to everyone in your current room.',
    audience: new RoomAudience(),
    formatter: {
      sender: function (sender, target, message, colorify) {
        return colorify(`You say: '${message}'`);
      },
      target: function (sender, target, message, colorify) {
        return colorify(`${sender.name} says: '${message}'`);
      },
    },
  }),
  new Channel({
    name: 'yell',
    color: ['bold', 'yellow'],
    description: 'Shout across the realm.',
    audience: new WorldAudience(),
    formatter: {
      sender: function (sender, target, message, colorify) {
        return colorify(`You yell: '${message.toUpperCase()}!'`);
      },
      target: function (sender, target, message, colorify) {
        return colorify(`${sender.name} yells: '${message.toUpperCase()}!'`);
      },
    },
  }),
  new Channel({
    name: 'tell',
    color: ['bold', 'magenta'],
    description: 'Send a private telepathic message to another player.',
    audience: new PrivateAudience(),
    formatter: {
      sender: function (sender, target, message, colorify) {
        return colorify(`You tell ${target.name}: '${message}'`);
      },
      target: function (sender, target, message, colorify) {
        return colorify(`${sender.name} tells you: '${message}'`);
      },
    },
  }),
  new Channel({
    name: 'gtell',
    color: ['bold', 'blue'],
    description: 'Send a message to members of your party.',
    audience: new PartyAudience(),
    formatter: {
      sender: function (sender, target, message, colorify) {
        return colorify(`[Party] You: ${message}`);
      },
      target: function (sender, target, message, colorify) {
        return colorify(`[Party] ${sender.name}: ${message}`);
      },
    },
  }),
];

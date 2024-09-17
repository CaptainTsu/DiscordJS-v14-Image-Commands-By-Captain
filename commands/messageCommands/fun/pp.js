const { EmbedBuilder } = require('discord.js');
const config = require('../../../config/config.js');
const axios = require('axios');

module.exports = {
    name: 'pp',
    category: 'Fun',
    aliases: [],
    cooldown: 10, 
    usage: '<user>',
    description: 'Shows the pp size of a user.',
    memberpermissions: [], 
    botpermissions: [],
    requiredroles: [], 
    requiredchannels: [], 
    alloweduserids: [], 
    minargs: 0,
    maxargs: 1,
    nsfw: false, 
    BotOwnerOnly: false, 
    ServerOwnerOnly: false,
    DevloperTeamOnly: false,
    async execute(message, args) {

        const specialUserIds = ['565854774612983808']; //place here ids of user you want pp big

        const user = message.mentions.users.first() || message.author;

        const member = await message.guild.members.fetch(user.id);

        const name = member.displayName.split(' ')[0]; 
        const response = await axios.get(`https://api.genderize.io/?name=${encodeURIComponent(name)}`);
        const data = response.data;

        if (data.gender === 'male') { // male
            const minLength = specialUserIds.includes(user.id) ? 20 : 1;
            const maxLength = specialUserIds.includes(user.id) ? 30 : 15;

            const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

            const dickSize = '8' + '='.repeat(length) + 'D';
            const responseMessage = `**${member.displayName}'s size:**\n${dickSize}`;
            await message.channel.send({ content: responseMessage });

        } else if (data.gender === 'female') { // female
            const responseMessage = `**${member.displayName}** doesn't have a pp.`;
            await message.channel.send({ content: responseMessage });

        } else { // no idea
            const responseMessage = `I couldn't determine the gender of **${member.displayName}**.`;
            await message.channel.send({ content: responseMessage });
        }
    },
};

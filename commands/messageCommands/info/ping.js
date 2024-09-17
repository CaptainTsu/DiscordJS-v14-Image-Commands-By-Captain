const { EmbedBuilder } = require('discord.js');
const config = require('../../../config/config.js')

module.exports = {
    name: 'ping',
    category: 'Info',
    aliases: ['pong', 'latency'],
    cooldown: 30, 
    usage: '<user>',
    description: 'Ping! A simple latency command.',
    memberpermissions: [], 
    botpermissions: [],
    requiredroles: [], 
    requiredchannels: [], 
    alloweduserids: [], 
    minargs: 0,
    maxargs: 0,
    nsfw: false, 
    OwnerOnly: true, 
    ServerOwnerOnly: false,
    DevloperTeamOnly: false,
    async execute(message) {
        const sent = await message.channel.send('Pinging...');
        const embed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setColor(config.EmbedConfig.embedcolor) 
            .addFields(
                { name: 'Bot Latency', value: `${sent.createdTimestamp - message.createdTimestamp}ms`, inline: true },
                { name: 'API Latency', value: `${Math.round(message.client.ws.ping)}ms`, inline: true }
            )
            .setTimestamp();

        sent.edit({ content: null, embeds: [embed] });
    },
};

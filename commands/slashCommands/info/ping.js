const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config/config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping! A simple latency command.'),
    name: 'ping',
    category: 'Fun',
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
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setColor(config.EmbedConfig.embedcolor) 
            .addFields(
                { name: 'Bot Latency', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
                { name: 'API Latency', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

const { EmbedBuilder } = require('discord.js');
const config = require('../../../config/config.js');

module.exports = {
    name: 'uptime',
    category: 'Info',
    aliases: ['up'],
    cooldown: 10,
    usage: '',
    description: "Displays the bot's uptime.",
    memberpermissions: [], 
    botpermissions: [],
    requiredroles: [],
    requiredchannels: [],
    alloweduserids: [],
    minargs: 0,
    maxargs: 0,
    nsfw: false,
    BotOwnerOnly: false,
    ServerOwnerOnly: false,
    DevloperTeamOnly: false,
    async execute(message) {
        const uptime = message.client.uptime;

        const days = Math.floor(uptime / (24 * 60 * 60 * 1000));
        const hours = Math.floor((uptime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((uptime % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((uptime % (60 * 1000)) / 1000);

        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const embed = new EmbedBuilder()
            .setTitle("Bot's Uptime")
            .setDescription(`\`\`\`ansi\n[2;33m[2;32m[2;33m${uptimeString}[0m[2;32m[0m[2;33m[0m\`\`\``)
            .setColor(config.EmbedConfig.embedcolor);

        await message.channel.send({ embeds: [embed] });
    },
};

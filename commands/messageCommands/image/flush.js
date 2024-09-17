const { AttachmentBuilder } = require('discord.js');
const config = require('../../../config/config.js');
const path = require('path');
const cmdname = path.parse(__filename).name;

module.exports = {
    name: `${cmdname}`,
    category: 'image',
    aliases: [],
    cooldown: 10, 
    usage: `${cmdname} (user)`,
    description: `${cmdname} someone`,
    memberpermissions: [], 
    botpermissions: [],
    requiredroles: [], 
    requiredchannels: [], 
    alloweduserids: [], 
    minargs: 0,
    maxargs: 1,
    nsfw: false, 
    BotOwnerOnly: true, 
    ServerOwnerOnly: false,
    DevloperTeamOnly: false,
    async execute(message, args) {
        const endpoint = `${cmdname}`;
        const client = message.client;
        let targetUser = message.author;

        // Dynamically import node-fetch
        const fetch = (await import('node-fetch')).default;

        // Check if argument is a valid user mention
        if (message.mentions.users.size > 0) {
            targetUser = message.mentions.users.first();
        } else if (args[0]) {
            // Check if argument is a valid user ID
            const userId = args[0].replace(/[<@!>]/g, '');
            const user = await client.users.fetch(userId).catch(() => null);
            if (user) targetUser = user;
        }

        // Check if the target user is in the AvoidImageEdit list
        if (config.ImageConfig.AvoidImageEdit.includes(targetUser.id)) {
            // Check if the user executing the command is allowed to bypass the AvoidImageEdit restriction
            if (!config.ImageConfig.BypassImageEdit.includes(message.author.id)) {
                return message.reply(config.ImageConfig.ResponseForAvoid);  // Custom response from config
            }
        }

        const params = new URLSearchParams({
            image_url: targetUser.displayAvatarURL({ extension: 'png', size: 512 })
        });
        const headers = {
            'Authorization': `Bearer ${config.ImageConfig.JEYY_API_KEY}`
        };``

        try {
            // Send a loading message
            const loadingMessage = await message.reply('<a:LoadingUwu:1280897230357663754>');

            const response = await fetch(`https://api.jeyy.xyz/v2/image/${endpoint}?${params}`, { headers });
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const attachment = new AttachmentBuilder(buffer, { name: `${endpoint}.gif` });

            // Delete the loading message and send the attachment
            await loadingMessage.delete();
            await message.reply({ files: [attachment] });
        } catch (error) {
            console.error('Error:', error);
            await message.reply('An error occurred while processing the command.');
        }
    },
};

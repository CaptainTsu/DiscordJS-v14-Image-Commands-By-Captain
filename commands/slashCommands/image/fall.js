const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const config = require('../../../config/config.js');
const path = require('path');
const cmdname = path.parse(__filename).name;

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`${cmdname}`)
        .setDescription(`${cmdname} someone`)
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you want to perform the action on')
                .setRequired(false)),
    category: 'image',
    cooldown: 10, 
    usage: `${cmdname} [user]`,
    description: `${cmdname} someone`,
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
    async execute(interaction) {
        const endpoint = `${cmdname}`;
        const client = interaction.client;
        let targetUser = interaction.user; // Default to the user who invoked the command

        // Dynamically import node-fetch
        const fetch = (await import('node-fetch')).default;

        // Check if a user option was provided
        const userOption = interaction.options.getUser('user');
        if (userOption) {
            targetUser = userOption;
        }

        // Check if the target user is in the AvoidImageEdit list
        if (config.ImageConfig.AvoidImageEdit.includes(targetUser.id)) {
            // Check if the user executing the command is allowed to bypass the AvoidImageEdit restriction
            if (!config.ImageConfig.BypassImageEdit.includes(interaction.user.id)) {
                return interaction.reply(config.ImageConfig.ResponseForAvoid);  // Custom response from config
            }
        }

        const params = new URLSearchParams({
            image_url: targetUser.displayAvatarURL({ extension: 'png', size: 512 })
        });
        const headers = {
            'Authorization': `Bearer ${config.ImageConfig.JEYY_API_KEY}`
        };

        try {
            // Send a loading message
            await interaction.reply('<a:LoadingUwu:1280897230357663754>');

            const response = await fetch(`https://api.jeyy.xyz/v2/image/${endpoint}?${params}`, { headers });
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const attachment = new AttachmentBuilder(buffer, { name: `${endpoint}.gif` });

            // Send the attachment
            await interaction.editReply({ content: null, files: [attachment] });
        } catch (error) {
            console.error('Error:', error);
            await interaction.editReply('An error occurred while processing the command.');
        }
    },
};

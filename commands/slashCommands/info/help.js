const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../../config/config.js');
const textColors = require('../../../config/textcolor.js'); // Load the textcolor.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all bot commands')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to get detailed information about')
                .setRequired(false)
        ),
    name: 'help',
    category: 'Info',
    aliases: ['h'],
    cooldown: 10,
    usage: 'help (command)',
    description: 'Displays the help menu',
    memberpermissions: [],
    botpermissions: [],
    requiredroles: [],
    requiredchannels: [],
    alloweduserids: [],
    minargs: 0,
    maxargs: 0,
    nsfw: false,
    OwnerOnly: false,
    ServerOwnerOnly: false,
    DevloperTeamOnly: false,

    async execute(interaction) {
        const commandName = interaction.options.getString('command');

        const commandsPath = path.join(__dirname, '..');
        const categories = {};

        fs.readdirSync(commandsPath).forEach(category => {
            const categoryPath = path.join(commandsPath, category);
            if (fs.lstatSync(categoryPath).isDirectory()) {
                const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

                categories[category] = commandFiles.map(file => {
                    const command = require(path.join(categoryPath, file));
                    return {
                        name: command.name,
                        description: command.description || 'No description provided',
                        category: category
                    };
                });
            }
        });

        // Check if a specific command was provided
        if (commandName) {
            const lowerCommandName = commandName.toLowerCase();
            const foundCommand = Object.values(categories).flat().find(cmd => cmd.name === lowerCommandName);

            if (foundCommand) {
                const command = require(path.join(commandsPath, foundCommand.category, `${foundCommand.name}.js`));

                // Extract color configurations
                const textColor = config.TextConfig.color;
                const backgroundColor = config.TextConfig.background_color;
                const isBold = config.TextConfig.bold;
                const isUnderline = config.TextConfig.underline;

                // Get the color and style codes
                const colorCode = textColors.colors[textColor] || '';
                const backgroundColorCode = textColors.background_colors[backgroundColor] || '';
                const boldCode = isBold ? textColors.styles.bold : '';
                const underlineCode = isUnderline ? textColors.styles.underline : '';
                const resetCode = textColors.styles.reset;

                const infoMessage = `\`\`\`ansi
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Name:${resetCode} ${command.name}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Usage:${resetCode} ${command.usage || 'No usage information'}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Description:${resetCode} ${command.description || 'No description provided'}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Cooldown:${resetCode} ${command.cooldown || 0} seconds
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Category:${resetCode} ${command.category}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Aliases:${resetCode} ${command.aliases ? command.aliases.join(', ') : 'None'}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Permissions:${resetCode} ${command.memberpermissions.length > 0 ? command.memberpermissions.join(', ') : 'None'}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Bot Permissions:${resetCode} ${command.botpermissions.length > 0 ? command.botpermissions.join(', ') : 'None'}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Required Roles:${resetCode} ${command.requiredroles.length > 0 ? command.requiredroles.join(', ') : 'None'}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Required Channels:${resetCode} ${command.requiredchannels.length > 0 ? command.requiredchannels.join(', ') : 'None'}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Allowed User IDs:${resetCode} ${command.alloweduserids.length > 0 ? command.alloweduserids.join(', ') : 'None'}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Min Args:${resetCode} ${command.minargs}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Max Args:${resetCode} ${command.maxargs}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}NSFW:${resetCode} ${command.nsfw}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Owner Only:${resetCode} ${command.OwnerOnly}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Server Owner Only:${resetCode} ${command.ServerOwnerOnly}
${boldCode}${underlineCode}${backgroundColorCode}${colorCode}Developer Team Only:${resetCode} ${command.DevloperTeamOnly}
\`\`\``;

                const capitalizedCommandName = command.name.charAt(0).toUpperCase() + command.name.slice(1);
                const infoEmbed = new EmbedBuilder()
                    .setColor(config.EmbedConfig.embedcolor)
                    .setTitle(`${capitalizedCommandName} Command Info`)
                    .setDescription(infoMessage)
                    .setTimestamp();

                return interaction.reply({ embeds: [infoEmbed] });
            } else {
                return interaction.reply('Command not found.');
            }
        }

        // Default to displaying help menu
        const homeEmbed = new EmbedBuilder()
            .setColor(config.EmbedConfig.embedcolor)
            .setTitle('Help Menu')
            .setDescription('Select a category from the dropdown to view commands.');

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_menu')
            .setPlaceholder('Select a category')
            .addOptions([
                { label: 'Home', description: 'Go back to the main help page', value: 'home' },
                ...Object.keys(categories).map(category => ({
                    label: category.charAt(0).toUpperCase() + category.slice(1),
                    description: `View ${category} commands`,
                    value: category
                }))
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const reply = await interaction.reply({ embeds: [homeEmbed], components: [row], fetchReply: true });

        const collector = reply.createMessageComponentCollector({
            filter: (i) => i.customId === 'help_menu' && i.user.id === interaction.user.id,
            time: 120000,
        });

        collector.on('collect', async (menuInteraction) => {
            const selected = menuInteraction.values[0];

            if (selected === 'home') {
                await menuInteraction.update({ embeds: [homeEmbed], components: [row] });
            } else {
                const selectedEmbed = new EmbedBuilder()
                    .setColor(config.EmbedConfig.embedcolor)
                    .setTitle(`${selected.charAt(0).toUpperCase() + selected.slice(1)} Commands`)
                    .setDescription(categories[selected].map(cmd => `- \`${cmd.name}\`: ${cmd.description}`).join('\n'));

                await menuInteraction.update({ embeds: [selectedEmbed], components: [row] });
            }
        });

        collector.on('end', () => {
            const disabledRow = new ActionRowBuilder().addComponents(selectMenu.setDisabled(true));
            reply.edit({ components: [disabledRow] });
        });
    },
};

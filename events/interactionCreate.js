const { isOwner } = require('../utils/ownerCheck');
const config = require('../config/config.js')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.slashCommands.get(interaction.commandName);
        if (!command) return;

        // Owner-only check
        if (command.OwnerOnly && !isOwner(interaction.user.id)) {
            return interaction.reply({ content: config.ResponsesConfig.owneronly.reply, ephemeral: true });
        }

        // Server owner-only check
        if (command.ServerOwnerOnly && interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({ content: config.ResponsesConfig.serverowneronly.reply, ephemeral: true });
        }

        // Developer Team-only check
        function isDeveloperTeamMember(user, guild) {
            if (config.developerTeam.memberIDs.includes(user.id)) return true;
            const member = guild.members.cache.get(user.id);
            if (member && config.developerTeam.roleIDs.some(roleID => member.roles.cache.has(roleID))) {
                return true;
            }
            return false;
        }

        if (command.DeveloperTeamOnly && !isDeveloperTeamMember(interaction.user, interaction.guild)) {
            return interaction.reply({ content: config.ResponsesConfig.developerteamonly.reply, ephemeral: true });
        }

        // NSFW check
        if (command.nsfw && !interaction.channel.nsfw) {
            return interaction.reply({ content: config.ResponsesConfig.nsfw.reply, ephemeral: true });
        }

        // Permissions check
        if (command.memberpermissions.length > 0 && !interaction.member.permissions.has(command.memberpermissions)) {
            return interaction.reply({ content: config.ResponsesConfig.memberpermissions.reply, ephemeral: true });
        }

        if (command.botpermissions.length > 0 && !interaction.guild.members.me.permissions.has(command.botpermissions)) {
            return interaction.reply({ content: config.ResponsesConfig.botpermissions.reply, ephemeral: true });
        }

        // Required roles check
        if (command.requiredroles.length > 0 && !command.requiredroles.some(role => interaction.member.roles.cache.has(role))) {
            return interaction.reply({ content: config.ResponsesConfig.requiredroles.reply, ephemeral: true });
        }

        // Required channels check
        if (command.requiredchannels.length > 0 && !command.requiredchannels.includes(interaction.channel.id)) {
            return interaction.reply({ content: config.ResponsesConfig.requiredchannels.reply, ephemeral: true });
        }

        // Allowed users check
        if (command.alloweduserids.length > 0 && !command.alloweduserids.includes(interaction.user.id)) {
            return interaction.reply({ content: config.ResponsesConfig.alloweduserids.reply, ephemeral: true });
        }

        // Cooldown check
        if (!interaction.client.cooldowns) interaction.client.cooldowns = new Map();
        const now = Date.now();
        const timestamps = interaction.client.cooldowns.get(command.name) || new Map();
        const cooldownAmount = (command.cooldown || config.CooldownConfig.defaultCooldown) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more seconds before using \`${command.name}\` again.`, ephemeral: true });
            }
        }

        timestamps.set(interaction.user.id, now);
        interaction.client.cooldowns.set(command.name, timestamps);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
        }
    },
};

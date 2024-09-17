const { isOwner } = require('../utils/ownerCheck');
const ms = require('ms');
const config = require('../config/config.js')

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot || !message.content.startsWith(config.prefix)) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;


    // Owner-only check
    if (command.OwnerOnly && !isOwner(message.author.id)) {
        const replyMessage = await message.reply(config.ResponsesConfig.botowneronly.reply);
        if (config.ResponsesConfig.botowneronly.shouldAutoDelete) {
            setTimeout(() => {
                replyMessage.delete().catch(err => console.error('Failed to delete message:', err));
            }, config.ResponsesConfig.botowneronly.autoDelete * 1000);
        }
        return replyMessage;
    }

    // Server owner-only check
    if (command.ServerOwnerOnly && message.author.id !== message.guild.ownerId) {
        const replyMessage = await message.reply(config.ResponsesConfig.serverowneronly.reply);
        if (config.ResponsesConfig.serverowneronly.shouldAutoDelete) {
            setTimeout(() => {
                replyMessage.delete().catch(err => console.error('Failed to delete message:', err));
            }, config.ResponsesConfig.serverowneronly.autoDelete * 1000);
        }
        return replyMessage;
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

    if (command.DeveloperTeamOnly && !isDeveloperTeamMember(message.author, message.guild)) {
        const replyMessage = await message.reply(config.ResponsesConfig.developerteamonly.reply);
        if (config.ResponsesConfig.developerteamonly.shouldAutoDelete) {
            setTimeout(() => {
                replyMessage.delete().catch(err => console.error('Failed to delete message:', err));
            }, config.ResponsesConfig.developerteamonly.autoDelete * 1000);
        }
        return replyMessage;
    }

    // NSFW check
    if (command.nsfw && !message.channel.nsfw) {
        const replyMessage = await message.reply(config.ResponsesConfig.nsfw.reply);
        if (config.ResponsesConfig.nsfw.shouldAutoDelete) {
            setTimeout(() => {
                replyMessage.delete().catch(err => console.error('Failed to delete message:', err));
            }, config.ResponsesConfig.nsfw.autoDelete * 1000);
        }
        return replyMessage;
    }

    // Permissions check
    if (command.memberpermissions.length > 0 && !message.member.permissions.has(command.memberpermissions)) {
        const replyMessage = await message.reply(config.ResponsesConfig.memberpermissions.reply);
        if (config.ResponsesConfig.memberpermissions.shouldAutoDelete) {
            setTimeout(() => {
                replyMessage.delete().catch(err => console.error('Failed to delete message:', err));
            }, config.ResponsesConfig.memberpermissions.autoDelete * 1000);
        }
        return replyMessage;
    }

    if (command.botpermissions.length > 0 && !message.guild.me.permissions.has(command.botpermissions)) {
        const replyMessage = await message.reply(config.ResponsesConfig.botpermissions.reply);
        if (config.ResponsesConfig.botpermissions.shouldAutoDelete) {
            setTimeout(() => {
                replyMessage.delete().catch(err => console.error('Failed to delete message:', err));
            }, config.ResponsesConfig.botpermissions.autoDelete * 1000);
        }
        return replyMessage;
    }

    // Required roles check
    if (command.requiredroles.length > 0 && !command.requiredroles.some(role => message.member.roles.cache.has(role))) {
        const replyMessage = await message.reply(config.ResponsesConfig.requiredroles.reply);
        if (config.ResponsesConfig.requiredroles.shouldAutoDelete) {
            setTimeout(() => {
                replyMessage.delete().catch(err => console.error('Failed to delete message:', err));
            }, config.ResponsesConfig.requiredroles.autoDelete * 1000);
        }
        return replyMessage;
    }

    // Required channels check
    if (command.requiredchannels.length > 0 && !command.requiredchannels.includes(message.channel.id)) {
        const replyMessage = await message.reply(config.ResponsesConfig.requiredchannels.reply);
        if (config.ResponsesConfig.requiredchannels.shouldAutoDelete) {
            setTimeout(() => {
                replyMessage.delete().catch(err => console.error('Failed to delete message:', err));
            }, config.ResponsesConfig.requiredchannels.autoDelete * 1000);
        }
        return replyMessage;
    }

    // Allowed users check
    if (command.alloweduserids.length > 0 && !command.alloweduserids.includes(message.author.id)) {
        const replyMessage = await message.reply(config.ResponsesConfig.alloweduserids.reply);
        if (config.ResponsesConfig.alloweduserids.shouldAutoDelete) {
            setTimeout(() => {
                replyMessage.delete().catch(err => console.error('Failed to delete message:', err));
            }, config.ResponsesConfig.alloweduserids.autoDelete * 1000);
        }
        return replyMessage;
    }

        // Argument length check
        if (args.length < command.minargs || args.length > command.maxargs) {
            return message.reply(`Invalid arguments. Usage: \`${config.prefix}${command.name} ${command.usage}\``);
        }

        // Cooldown check
        if (!message.client.cooldowns) message.client.cooldowns = new Map();
        const now = Date.now();
        const timestamps = message.client.cooldowns.get(command.name) || new Map();
        const cooldownAmount = (command.cooldown || config.CooldownConfig.defaultCooldown) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const replyMessage = await message.reply(`Please wait ${timeLeft.toFixed(1)} more seconds before using \`${command.name}\` again.`);
                setTimeout(() => {
                  replyMessage.delete().catch(err => console.error('Failed to delete message:', err));
                }, config.CooldownConfig.autoDeleteCooldownMsg * 1000); 
                return replyMessage
            }
        }

        timestamps.set(message.author.id, now);
        message.client.cooldowns.set(command.name, timestamps);

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};

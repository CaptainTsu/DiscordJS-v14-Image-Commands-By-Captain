/**
 * Checks if the member has the required permissions.
 * @param {GuildMember} member - The member to check permissions for.
 * @param {Array<string>} requiredPermissions - The permissions required to use the command.
 * @returns {boolean} - Returns true if the member has all required permissions.
 */
function checkMemberPermissions(member, requiredPermissions = []) {
    if (!requiredPermissions.length) return true;
    return member.permissions.has(requiredPermissions);
}

/**
 * Checks if the bot has the required permissions.
 * @param {GuildMember} bot - The bot's guild member object.
 * @param {Array<string>} requiredPermissions - The permissions required for the bot to execute the command.
 * @returns {boolean} - Returns true if the bot has all required permissions.
 */
function checkBotPermissions(bot, requiredPermissions = []) {
    if (!requiredPermissions.length) return true;
    return bot.permissions.has(requiredPermissions);
}

/**
 * Checks if the member has the required roles.
 * @param {GuildMember} member - The member to check roles for.
 * @param {Array<string>} requiredRoles - The roles required to use the command.
 * @returns {boolean} - Returns true if the member has at least one of the required roles.
 */
function checkRequiredRoles(member, requiredRoles = []) {
    if (!requiredRoles.length) return true;
    return requiredRoles.some(roleId => member.roles.cache.has(roleId));
}

/**
 * Checks if the command is being run in a required channel.
 * @param {TextChannel} channel - The channel the command is being run in.
 * @param {Array<string>} requiredChannels - The channels where the command can be used.
 * @returns {boolean} - Returns true if the command is run in one of the required channels.
 */
function checkRequiredChannels(channel, requiredChannels = []) {
    if (!requiredChannels.length) return true;
    return requiredChannels.includes(channel.id);
}

/**
 * Checks if the user is allowed to use the command.
 * @param {User} user - The user attempting to use the command.
 * @param {Array<string>} allowedUserIds - The users allowed to use the command.
 * @returns {boolean} - Returns true if the user is in the list of allowed users.
 */
function checkAllowedUsers(user, allowedUserIds = []) {
    if (!allowedUserIds.length) return true;
    return allowedUserIds.includes(user.id);
}

/**
 * Checks if the command is being run in an NSFW channel.
 * @param {TextChannel} channel - The channel the command is being run in.
 * @param {boolean} nsfw - Whether the command is NSFW.
 * @returns {boolean} - Returns true if the command is run in an NSFW channel, false otherwise.
 */
function checkNSFW(channel, nsfw = false) {
    if (!nsfw) return true;
    return channel.nsfw;
}

module.exports = {
    checkMemberPermissions,
    checkBotPermissions,
    checkRequiredRoles,
    checkRequiredChannels,
    checkAllowedUsers,
    checkNSFW,
};

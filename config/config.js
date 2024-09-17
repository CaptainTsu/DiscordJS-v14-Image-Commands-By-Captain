
module.exports = {

// General Configs
    prefix: `$`, //Add a prefix for message commands, or leave it blank to disable message commands.
    token: ``, //bot token
    ownerID: ``, //your id (cannot add multiple)
    guildId: ``, // Enter a guild ID for guild-specific commands, or leave it blank to load slash commands globally.

    developerTeam: {
        memberIDs: [], // add the user IDs of the developer team (can add multiple)
        roleIDs: [],   // add the role IDs of the developer team (can add multiple)
    },

// Bot Embed Configs
    EmbedConfig: {
        embedcolor: `#9b59b6`, //default embed color 
    },

// Cooldown Configs
    CooldownConfig: {
        defaultCooldown: 5, //default cooldown for commands (it's 5 seconds here)
        autoDeleteCooldownMsg: 10 //auto delete the response which the bot says "you're on cooldown" (it's 10 seconds here)
    },

// Text Config (Used in help (command))
    TextConfig: {
        color: 'white', //white, teal, pink, light_blue, gold, yellowish_green, red, dark_gray (leave blank for normal)
        background_color: '', //cream_white, light_gray60, blurple, light_gray55, gray45, gray40, rust_brown, blueish_black (leave blank for normal)
        bold: true, // Toggle bold text color
        underline: false, // Toggle bold text color
    },

// Responses Config
    ResponsesConfig: {
        botowneronly: {
            reply: `This command is restricted to the bot owner.`,
            autoDelete: 10, // in seconds
            shouldAutoDelete: true
        },
        serverowneronly: {
            reply: `This command is restricted to the server owner.`,
            autoDelete: 10, // in seconds
            shouldAutoDelete: true
        },
        developerteamonly: {
            reply: `This command is restricted to the developer team.`,
            autoDelete: 10, // in seconds
            shouldAutoDelete: true
        },
        nsfw: {
            reply: `This command can only be used in NSFW channels.`,
            autoDelete: 10, // in seconds
            shouldAutoDelete: true
        },
        memberpermissions: {
            reply: `You don't have the necessary permissions to use this command.`,
            autoDelete: 10, // in seconds
            shouldAutoDelete: true
        },
        botpermissions: {
            reply: `I don't have the necessary permissions to execute this command.`,
            autoDelete: 10, // in seconds
            shouldAutoDelete: true
        },
        requiredroles: {
            reply: `You don't have the required role(s) to use this command.`,
            autoDelete: 10, // in seconds
            shouldAutoDelete: true
        },
        requiredchannels: {
            reply: `This command can only be used in specific channels.`,
            autoDelete: 10, // in seconds
            shouldAutoDelete: true
        },
        alloweduserids: {
            reply: `You are not allowed to use this command.`,
            autoDelete: 10, // in seconds
            shouldAutoDelete: true
        }
    }
    
}

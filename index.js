const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config/config.js')
const fs = require('fs');
const CommandHandler = require('./utils/commandHandler');
const path = require('path');
const chalk = require('chalk');
(async () => {
    const boxen = (await import('boxen')).default;
})();

// Initialize the bot client with the required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

// Load commands and slash commands
new CommandHandler(client);

// Load event files and set event handlers
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const eventCount = eventFiles.length;
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Use this to delete all slash commands for a guild
/*
client.once('ready', async () => {
    const guild = client.guilds.cache.get('729564498591088647'); // Replace with your guild ID
    if (!guild) {
        console.error('Guild not found!');
        return;
    }

    const commands = await guild.commands.fetch();
    commands.forEach(async (cmd) => {
        await cmd.delete();
        console.log(`Deleted command: ${cmd.name}`);
    });

    console.log('All commands deleted.');
    client.destroy();
});
*/


// Log in to Discord
client.login(config.token).catch(error => {
    const logStatus = require('./events/ready');
    logStatus.execute(client, error); // Pass the error to the logging function
});

module.exports = client;

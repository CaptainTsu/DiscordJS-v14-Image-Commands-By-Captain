const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const getCommandFiles = (dir) => {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const res = path.resolve(dir, item.name);
        if (item.isDirectory()) {
            files.push(...getCommandFiles(res)); // Recursive call
        } else if (item.isFile() && item.name.endsWith('.js')) {
            files.push(res);
        }
    }

    return files;
};

module.exports = {
    name: 'ready',
    once: true,
    async execute(client, error) {
        const boxen = (await import('boxen')).default;

        const titleColors = {
            magenta: chalk.bold.bgMagenta.black,
            yellow: chalk.bold.bgYellow.black,
            green: chalk.bold.bgGreen.black,
            red: chalk.bold.bgRed.black,
        };

        const detailColor = chalk.white;
        const highlightColor = chalk.cyanBright;
        const separatorColor = chalk.gray;

        const createBox = (message, borderColor) => {
            return boxen(message, {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: borderColor,
            });
        };

        // Check if there was a login error
        if (error) {
            const errorMessage = `
${titleColors.red('═'.repeat(50))}
${titleColors.red(' Error Logging In ')}
${titleColors.red('═'.repeat(50))}
${detailColor(`Error: ${highlightColor(error.message)}`)}
${separatorColor('─'.repeat(50))}
${detailColor(`Timestamp: ${highlightColor(new Date().toLocaleString())}`)}
${titleColors.red('═'.repeat(50))}
`;
            console.log(createBox(errorMessage, 'red'));
            return; // Exit early if there's an error
        }

        // Get command files from directories
        const messageCommandFiles = getCommandFiles(path.resolve(__dirname, '../commands/messageCommands'));
        const slashCommandFiles = getCommandFiles(path.resolve(__dirname, '../commands/slashCommands'));

        const commandStatuses = messageCommandFiles.map(file => {
            const { name, category } = require(file);
            const fileName = path.basename(file);
            if (name && category) {
                return `${fileName} -> ✅`;
            } else {
                const missingFields = [];
                if (!name) missingFields.push('name');
                if (!category) missingFields.push('category');
                return `${fileName} -> ❌ ${missingFields.join(', ')} field(s) missing.`;
            }
        });

        const slashCommandStatuses = slashCommandFiles.map(file => {
            const { data: { name }, category } = require(file);
            const fileName = path.basename(file);
            if (name && category) {
                return `${fileName} -> ✅`;
            } else {
                const missingFields = [];
                if (!name) missingFields.push('name');
                if (!category) missingFields.push('category');
                return `${fileName} -> ❌ ${missingFields.join(', ')} field(s) missing.`;
            }
        });

        const eventFiles = fs.readdirSync(path.resolve(__dirname, '../events')).filter(file => file.endsWith('.js'));
        const eventCount = eventFiles.length;

        const eventStatuses = eventFiles.map(file => `${file} -> ✅`);

        // Summary log message
        const summaryLogMessage = `
${titleColors.magenta('═'.repeat(50))}
${titleColors.magenta(' Commands, Slash Commands, and Events ')}
${titleColors.magenta('═'.repeat(50))}

${detailColor('Commands')}
${commandStatuses.length > 0 
    ? commandStatuses.map(status => `${separatorColor('─')} ${status}`).join('\n') 
    : `${separatorColor('─')} No command files found.`}

${detailColor('Slash Commands')}
${slashCommandStatuses.length > 0 
    ? slashCommandStatuses.map(status => `${separatorColor('─')} ${status}`).join('\n') 
    : `${separatorColor('─')} No slash command files found.`}

${detailColor('Events')}
${eventStatuses.map(status => `${separatorColor('─')} ${status}`).join('\n')}
${titleColors.magenta('═'.repeat(50))}
`;

        // Commands loaded message
        const commandsLogMessage = `
${titleColors.yellow('═'.repeat(30))}
${titleColors.yellow(' Commands Loaded ')}
${titleColors.yellow('═'.repeat(30))}
${detailColor(`Total Commands: ${highlightColor(messageCommandFiles.length)}`)}
${detailColor(`Slash Commands: ${highlightColor(slashCommandFiles.length)}`)}
${separatorColor('─'.repeat(30))}
${detailColor(`Events Loaded: ${highlightColor(eventCount)}`)}
${titleColors.yellow('═'.repeat(30))}
`;

        // Bot logged in message
        const botLogMessage = `
${titleColors.green('═'.repeat(50))}
${titleColors.green(' Bot Logged In ')}
${titleColors.green('═'.repeat(50))}
${detailColor(`Bot Name: ${highlightColor(client.user.tag)}`)}
${separatorColor('─'.repeat(50))}
${detailColor(`Server Count: ${highlightColor(client.guilds.cache.size)}`)}
${detailColor(`User Count: ${highlightColor(client.users.cache.size)}`)}
${separatorColor('─'.repeat(50))}
${detailColor(`Timestamp: ${highlightColor(new Date().toLocaleString())}`)}
${titleColors.green('═'.repeat(50))}
`;

        // Log the styled messages to the console
        console.log(createBox(summaryLogMessage, 'magenta'));
        console.log(createBox(commandsLogMessage, 'yellow'));
        console.log(createBox(botLogMessage, 'green'));
    },
};

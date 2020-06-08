/**
 * This section governs the connection and configuration to twitch.tv
 *
 */
const fs = require('fs');
const tmi = require('tmi.js');
const env = require('custom-env').env();
const setModule = require('./set');
const streakModule = require('./streak');
const countModule = require('./count');
const textRecogModule = require('./text-recognition.js');
const frameProcessingModule = require('./frame-processing.js');
const Discord = require('discord.js');

// Define configuration options
const opts = {
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: [
        process.env.CHANNEL_NAME
    ]
};

//Used for The set functions
let set = setModule.createSet();
// console.log(set); //useful for debugging

//used for the streak functions
let streak = streakModule.createStreak();
streak.setVictor("No Current Victor");
streak.setWins(0);

//Used for text recognition
let textRecog = textRecogModule.createTextRecognition();

//Used for processing frames of the stream
let frameProcessing = frameProcessingModule.createFrameProcessing();

//Used for counting. Typically a death counter
let count = countModule.createCount();

//Used for the !arena command
let arena = {
    id : ""
};

//used for the !join or !passcode commands
let pass = {
    code : ""
};

let marioLevelList = [];
let addMarioLevels = true;

let singlesSmashList = [];
let addSinglesPlayers = true;

// Create a twitch client with our options
const twitchClient = new tmi.client(opts);

// Register our event handlers (defined below)
twitchClient.on('message', twitchOnMessageHandler);
twitchClient.on('connected', onConnectedHandler);
// Connect to Twitch:
twitchClient.connect();

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Successfully Connected to ${addr}:${port}`);
}

//Set Up discord client
const discordClient = new Discord.Client();

discordClient.once('ready', () => {
    console.log('Connected to Discord');
});

//Read in commands
discordClient.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    discordClient.commands.set(command.name, command);
}

//Useful for debugging. In real use, use !elitehelp
// console.log(discordClient.commands);


//Log in to discord
discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

discordClient.on('message', discordOnMessageHandler);


/**
 * DISCORD CHAT SECTION
 *
 * This section scans a private channel in my discord server.
 *
 * These commands require moderator or admin priviledges
 *
 */
function discordOnMessageHandler(message) {

    try {
        //Useful for debugging
        // console.log(message);
        // console.log(message.channel.id);

        //Ensure that the command prefix is specified
        //Ensure that the bot is not calling itself
        //Ensure that the command is in the proper channel
        if (!message.content.startsWith('!') || message.author.bot
            || !message.channel.id === process.env.DISCORD_COMMAND_CHANNEL_ID) return;

        //Twitch Target; This allows the bot to write in stream chat
        const target = '#watherum';

        // Remove whitespace from chat message
        const args = message.content.slice(1).split(/ +/);
        const command = args.shift().toLowerCase().trim();

        if (!discordClient.commands.has(command)) return;

        try {
            console.log(args);
            discordClient.commands.get(command).execute(discordClient, message, twitchClient, target,
                set, streak, arena, pass, count,
                textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
                marioLevelList, addMarioLevels, args);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }



    } catch (exception) {
        console.log(exception);
    }
}


/**
 * TWITCH CHAT SECTION
 *
 * This scans twitch chat for commands that will be used by anyone.
 *
 */
// Called every time a message comes in
function twitchOnMessageHandler(target, context, msg, self) {

    try {
        if (self) {
            return;
        } // Ignore messages from the bot

        //Following Line is for debug purposes
        // console.log(context);
        // console.log(target);

        // Remove whitespace from chat message
        const commandInput = msg.trim();

        // If the command is known, let's execute it

        //20 sided dice command
        if (commandInput === '!help') {
            let help = 'Commands are : \n' +
                '!arena | Get the ArenaID\n' +
                '!join | Join the singles set queue, get the arenaID and passcode\n' +
                '!showqueue | See the status of the singles set queue\n' +
                '!add | add a level to the Mario Maker level list \n' +
                '!levelqueue | see the status of the Mario Maker level queue\n'
            ;
            twitchClient.say(target, help);
            console.log(`* Executed ${commandInput} command`);
        }

        if (commandInput === '!arena') {
            let chatResponse = 'The arena id is ' + arena.id;
            if (isEmpty(arena.id) || arena.id === "nj") {
                chatResponse = 'The arena is not currently joinable'
            }

            twitchClient.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }

        if (commandInput === '!join') {

            const userWhoIsJoining = context.username;
            let chatResponse = 'Ive added you to the queue ' + userWhoIsJoining + '! The arenaID is ' +
                arena.id + ' and the passcode is ' + pass.code;
            if (addSinglesPlayers) {
                singlesSmashList.push(userWhoIsJoining);
            } else {
                chatResponse = 'The queue is currently closed. Please enjoy the stream!';
            }

            twitchClient.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }

        if (commandInput.includes('!showqueue')) {
            let response = "";
            for (competitor in singlesSmashList) {
                response = response + singlesSmashList[competitor] + ", ";

            }
            twitchClient.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }

        if (commandInput.includes('!add')) {
            let chatResponse = 'Ive added your level to the queue!';
            const splitInput = commandInput.split(" ");

            if (addMarioLevels) {
                addMarioLevels.push(splitInput[1]);
            } else {
                chatResponse = 'The queue is currently closed. Please enjoy the stream!';
            }

            twitchClient.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }

        if (commandInput.includes('!levelqueue')) {
            let chatResponse = 'There are ' + marioLevelList.length + ' people in the queue';
            twitchClient.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }

        // Record to log, useful for debugging
        // console.log(convertEpochToHumanDate(context['tmi-sent-ts']) + " - " + context['username'] + " : " +msg);
    } catch (exception) {
        console.log(exception);
    }

}

//Determine if a string is empty
function isEmpty(str) {
    return (!str || 0 === str.length);
}

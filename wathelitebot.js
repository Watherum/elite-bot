/**
 * This section governs the connection and configuration to twitch.tv
 *
 */
const tmi = require('tmi.js');
const env = require('custom-env').env();
const setModule = require('./set');
const streakModule = require('./streak');
const fileSystem = require('./file');
const textRecogModule = require('./text-recognition.js');
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

let writer = fileSystem.createWriter();

//Used for The set functions
let set = setModule.createSet();
// console.log(set); //useful for debugging

//used for the streak functions
let streak = streakModule.createStreak();

//Used for text recognition
let textRecog = textRecogModule.createTextRecognition();

//Used for the !arena command
let arena = "";

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
    //Useful for debugging
    // console.log(message);
    // console.log(message.channel.id);

    //Ensure that the command prefix is specified
    //Ensure that the bot is not calling itself
    //Ensure that the command is in the proper channel
    if (!message.content.startsWith('!') || message.author.bot
    || !message.channel.id == process.env.DISCORD_COMMAND_CHANNEL_ID) return;

    //Twitch Target; This allows the bot to write in stream chat
    const target = '#watherum';

    // Remove whitespace from chat message
    const commandInput = message.content.trim();


    if (commandInput.includes('!elitehelp')) {
        let help =
            'GENERAL COMMANDS \n' +
            '-----------------\n' +
            '!elitehelp | Return a list of commands. No arguments to this command\n' +
            '!editarena | Sets the arena for people to join e.g.(!editarena ABCDE). the arugment nj will let people know they cant join\n' +
            '!warning | Sends a message detailing a time in minutes in the future when the stream ends ' +
            'e.g.(!warning 30)\n' +
            '!savestream | Saves a flv file of my stream to my computer locally. No arguments to this command \n\n' +

            'STREAK COMMANDS \n' +
            '----------------\n' +
            '!initstreak | Writes a file used on stream. Sets the name and wins of the player e.g.(!initstreak Watherum,1)\n' +
            '!setstreakwins | Change the wins of the victor to a certain number e.g.(!setstreakwins 5)\n' +
            '!sw | Increment the wins of the victor. No arguments to this command\n' +
            '!sl | Decrement the wins of the victor. No arguments to this command\n' +
            '!clearstreak | clears the streak and the files on stream. No arguments to this command\n\n' +

            'SET COMMANDS \n' +
            '-------------\n' +
            '!initset | Initialize the set files e.g.(!initSet bestOfNumberOfMatches,c1name,c2name)\n' +
            '!c1w | Increment the wins for the 1st competitor. No arguments to this command\n' +
            '!c2w | Increment the wins for the 2nd competitor. No arguments to this command\n' +
            '!clearset | Clears the set files. No arguments to this command\n\n' +

            'The following commands are for manually editing set data after a mistake and are rarely used\n' +
            '!setc1 | Sets the 1st competitor. e.g.(!setc1 Wath)\n' +
            '!setc2 | Sets the 2nd competitor. e.g.(!setc2 Amiibo)\n' +
            '!bestof | Sets the number of matches the competitors will play at max e.g.(!bestof 5)\n' +
            '!c1l | Decrements the wins of the 1st competitor. No arguments to this command\n' +
            '!c2l | Decrements the wins of the 2nd competitor. No arguments to this command\n';
        message.channel.send(help);
    }



    //30 Minute Warning Command. This command is privileged
    if (commandInput.includes('!warning')) {
        const splitInput = commandInput.split(" ");
        if (splitInput[1] !== null) {
            const chatResponse = timeWarning(splitInput[1]);
            twitchClient.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }
    }

    //Streak commands
    if (commandInput.includes('!initstreak')) {
        const splitInput = commandInput.split(" ");
        if (splitInput[1] !== null) {
            const splitArgs = splitInput[1].split(",");
            streak.setVictor(splitArgs[0]);
            streak.setWins(splitArgs[1]);
            const chatResponse = streak.victor.trim() + " is now on a streak!";
            twitchClient.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }
    }

    if  (commandInput.includes('!setstreakwins')) {
        const splitInput = commandInput.split(" ");
        if (splitInput[1] !== null) {
            streak.setWins(splitInput[1]);
            const chatResponse = streak.victor.trim() + " streak has been updated";
            twitchClient.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }
    }

    if (commandInput.includes('!sw')) {
        streak.incrementWins();
        const chatResponse = streak.victor.trim() + "'s streak has been updated!";
        twitchClient.say(target, chatResponse);
        console.log(`* Executed ${commandInput} command`);
    }

    if (commandInput.includes('!sl')) {
        streak.decrementWins();
        const chatResponse = streak.victor.trim() + "'s streak has been updated!";
        twitchClient.say(target, chatResponse);
        console.log(`* Executed ${commandInput} command`);
    }

    if (commandInput.includes('!clearstreak')) {
        streak.resetStreak();
        const chatResponse = "The streak has been reset";
        twitchClient.say(target, chatResponse);
        console.log(`* Executed ${commandInput} command`);
    }


    // edit arena command. This command is privileged
    if (commandInput.includes('!editarena')) {
        const splitInput = commandInput.split(" ");
        if (splitInput[1] !== null) {
            editArena(splitInput[1]);
            let chatResponse = "Arena ID updated! Use !arena to get the ID";
            if (splitInput[1] === 'nj' || isEmpty(arena)) {
                chatResponse = "The arena is currently not joinable";
            }

            twitchClient.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }
    }

    if (commandInput === '!savestream') {
        textRecog.createStreamFile();
        message.channel.send('The stream flv file has been created');
        console.log(`* Executed ${commandInput} command`);
    }


    if (commandInput === '!textrecog') {
        textRecog.createStreamFile();
        textRecog.parseTextFromStream();
        twitchClient.say(target, `Executed the test, text recognition`);
        console.log(`* Executed ${commandInput} command`);
    }

    //Initialize the entire set at once
    if (commandInput.includes('!initset')) { //!initSet 3,c1name,c2name
        let chatResponse = "Malformed commamnd. Ex. !initSet bestofnumber,c1name,c2name";
        const splitInput = commandInput.split(" ");
        if (splitInput[1] !== null) {
            let params = splitInput[1].split(",");
            if (params[0] !== null && params[1] !== null && params[2] !== null) {
                set.setUpBestOf(params[0]);
                set.setCompOneUserName(params[1].trim());
                set.setCompTwoUserName(params[2].trim());
                chatResponse = "This is a best of " + set.bestOf + ". Competitors need to get " + set.winCondition + " wins. "
                    + set.compOneUserName.trim() + " & " + set.compTwoUserName.trim() + " good luck!";
            }
            twitchClient.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }
    }


    //The following section relates to the sets
    if (commandInput.includes('!setc1')) {
        const splitInput = commandInput.split(" ");
        if (splitInput[1] !== null) {
            set.setCompOneUserName(splitInput[1]);
            const chatResponse = "Set the first competitor as " + set.compOneUserName.trim();
            twitchClient.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }
    }

    //Sets the name of the second competitor
    if (commandInput.includes('!setc2')) {
        const splitInput = commandInput.split(" ");
        if (splitInput[1] !== null) {
            set.setCompTwoUserName(splitInput[1]);
            const chatResponse = "Set the second competitor as " + set.compTwoUserName.trim();
            twitchClient.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }
    }

    //Set the best of limit and win conditions
    if (commandInput.includes('!bestof')) {
        const splitInput = commandInput.split(" ");
        if (splitInput[1] !== null) {
            set.setUpBestOf(splitInput[1]);
            const chatResponse = "This is a best of " + set.bestOf +
                ". Competitors need to get " + set.winCondition + " wins. Good luck!";
            twitchClient.say(target, chatResponse);

            if (set.compOneUserName === "") {
                twitchClient.say(target, "The first competitors name is not set");
            }

            if (set.compTwoUserName === "") {
                twitchClient.say(target, "The second competitors name is not set");
            }

            console.log(`* Executed ${commandInput} command`);
        }
    }

    //Manually cleared the set
    if (commandInput.includes('!clearset')) {
        hanldeSetCompletion();
        const chatResponse = "The set has been cleared";
        twitchClient.say(target, chatResponse);
        console.log(`* Executed ${commandInput} command`);
    }

    //Increment the first competitors wins
    if (commandInput.includes('!c1w')) {
        let setCompleted = set.incrementCompOneWins();
        let chatResponse = set.compOneUserName + " now has " + set.compOneWins + " win(s)!";
        if (setCompleted) {
            chatResponse = "The set is over! The winner is " + set.winner.trim() + " !";
            hanldeSetCompletion();
        }
        twitchClient.say(target, chatResponse);
        console.log(`* Executed ${commandInput} command`);
    }

    //Increment the second competitors wins
    if (commandInput.includes('!c2w')) {
        let setCompleted = set.incrementCompTwoWins();
        let chatResponse = set.compTwoUserName + " now has " + set.compTwoWins + " win(s)!";
        if (setCompleted) {
            chatResponse = "The set is over! The winner is " + set.winner.trim() + " !";
            hanldeSetCompletion();
        }
        twitchClient.say(target, chatResponse);
        console.log(`* Executed ${commandInput} command`);
    }

    //Decrement the first competitors wins
    if (commandInput.includes('!c1l')) {
        let setCompleted = set.decrementCompOneWins();
        let chatResponse = set.compOneUserName + " now has " + set.compOneWins + " win(s).";
        if (setCompleted) {
            chatResponse = "The set is over! The winner is " + set.winner + " !";
            hanldeSetCompletion();
        }
        twitchClient.say(target, chatResponse);
        console.log(`* Executed ${commandInput} command`);
    }

    //Decrement the second competitors wins
    if (commandInput.includes('!c2l')) {
        let setCompleted = set.decrementCompTwoWins();
        let chatResponse = set.compTwoUserName + " now has " + set.compTwoWins + " win(s).";
        if (setCompleted) {
            chatResponse = "The set is over! The winner is " + set.winner + "!";
            hanldeSetCompletion();
        }
        twitchClient.say(target, chatResponse);
        console.log(`* Executed ${commandInput} command`);
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
        '!d20 \n' + '!d6 \n' + '!judge \n' + '!arena \n';
        twitchClient.say(target, help);
        console.log(`* Executed ${commandInput} command`);
    }

    //20 sided dice command
    if (commandInput === '!d20') {
        const num = rollDice20(commandInput);
        twitchClient.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandInput} command`);
    }

    // 6 sided dice command
    if (commandInput === '!dice') {
        const num = rollDice6();
        twitchClient.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandInput} command`);
    }

    //20 sided dice command
    if (commandInput === '!judge') {
        const num = rollDice9(commandInput);
        twitchClient.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandInput} command`);
    }

    if (commandInput === '!arena') {
        let chatResponse = 'The arena id is ' + arena;
        if (isEmpty(arena)) {
            chatResponse = 'The arena is not currently joinable'
        }

        twitchClient.say(target, chatResponse);
        console.log(`* Executed ${commandInput} command`);
    }

    // Record to log, useful for debugging
    // console.log(convertEpochToHumanDate(context['tmi-sent-ts']) + " - " + context['username'] + " : " +msg);

}


/**
 * Helper Method Section
 */
function convertEpochToHumanDate(epochDate) {
    return new Date(epochDate * 1000);
}


/**
 * The following section is the implementation of the command methods
 *
 */
// Function called when the "dice" command is issued
function rollDice20() {
    const sides = 20;
    return Math.floor(Math.random() * sides) + 1;
}

// Function called when the "dice" command is issued
function rollDice6() {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}

// Function called when the "dice" command is issued
function rollDice9() {
    const sides = 9;
    return Math.floor(Math.random() * sides) + 1;
}

//Function called when the editarena command is issued
function editArena(arenaID) {
    // return "!editcommand !arena " + arenaID;
    // This is for updating the command in streamlabs cloudbot through chat. This is not ideal
    arena = arenaID;
}

//Function called when the warning command is issued
function timeWarning(minutes) {
    let minsFromNow = new Date();
    minsFromNow = new Date(minsFromNow.getTime() + minutes * 60000);
    let formattedTime = minsFromNow.toString();
    let splitTime = formattedTime.split(" ");
    formattedTime = splitTime[4] + " EST";
    return "The stream will be ending in roughly " + minutes
        + " minutes from now. That is approximately " +
        formattedTime;
}

//Handles the clean up after a competitor wins the set
function hanldeSetCompletion() {
    writer.logEntireSet(set);
    set.clearSet();
}

//Determine if a string is empty
function isEmpty(str) {
    return (!str || 0 === str.length);
}


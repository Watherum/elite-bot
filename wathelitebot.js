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

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Successfully Connected to ${addr}:${port}`);
}


/**
 * This is the meat of the chat bot. This scans every time a message is sent
 *
 */
// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) {
        return;
    } // Ignore messages from the bot

    //Following Line is for debug purposes
    // console.log(context);

    // See their permissions for privileged commands
    let hasBadges = false;
    try {
        console.log("Badges exist " + context.badges.moderator); //useful for debugging
        hasBadges = true;
    } catch (exception) {
        //Do nothing. This means the user has no badges
    }

    // Remove whitespace from chat message
    const commandInput = msg.trim();

    // If the command is known, let's execute it

    //20 sided dice command
    if (commandInput === '!d20') {
        const num = rollDice20(commandInput);
        client.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandInput} command`);
    }

    // 6 sided dice command
    if (commandInput === '!dice') {
        const num = rollDice6();
        client.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandInput} command`);
    }

    if (commandInput === '!arena') {
        client.say(target, `The arena id is ${arena}`);
        console.log(`* Executed ${commandInput} command`);
    }

    //Privileged Command Section
    if (hasBadges && (context.badges.broadcaster === '1' || context.badges.moderator === '1')) {

        //30 Minute Warning Command. This command is privileged
        if (commandInput.includes('!warning')) {
            const splitInput = commandInput.split(" ");
            if (splitInput[1] !== null) {
                const chatResponse = timeWarning(splitInput[1]);
                client.say(target, chatResponse);
                console.log(`* Executed ${commandInput} command`);
            }
        }

        //Streak commands
        if (commandInput.includes('!initStreak')) {
            const splitInput = commandInput.split(" ");
            if (splitInput[1] !== null) {
                streak.setVictor(splitInput[1]);
                streak.incrementWins();
                const chatResponse = streak.victor + " is now on a streak!";
                client.say(target, chatResponse);
                console.log(`* Executed ${commandInput} command`);
            }
        }

        if (commandInput.includes('!sw')) {
            streak.incrementWins();
            const chatResponse = streak.victor + " streak has been updated!";
            client.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }

        if (commandInput.includes('!sl')) {
            streak.decrementWins();
            const chatResponse = streak.victor + " streak has been updated!";
            client.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }

        if (commandInput.includes('!clearStreak')) {
            streak.resetStreak();
            const chatResponse = "The streak has been reset";
            client.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }


        // edit arena command. This command is privileged
        if (commandInput.includes('!editarena')) {
            const splitInput = commandInput.split(" ");
            if (splitInput[1] !== null) {
                editArena(splitInput[1]);
                const chatResponse = "Arena updated!";
                client.say(target, chatResponse);
                console.log(`* Executed ${commandInput} command`);
            }
        }

        if (commandInput === '!test') {
            textRecog.createStreamFile();
            textRecog.parseTextFromStream();
            client.say(target, `Executed the test`);
            console.log(`* Executed ${commandInput} command`);
        }

        //Initialize the entire set at once
        if (commandInput.includes('!initSet')) { //!initSet 3,c1name,c2name
            let chatResponse = "Malformed commamnd. Ex. !initSet bestofnumber,c1name,c2name";
            const splitInput = commandInput.split(" ");
            if (splitInput[1] !== null) {
                let params = splitInput[1].split(",");
                if (params[0] !== null && params[1] !== null && params[2] !== null) {
                    set.setUpBestOf(params[0]);
                    set.setCompOneUserName(params[1].trim());
                    set.setCompTwoUserName(params[2].trim());
                    chatResponse = "This is a best of " + set.bestOf + ". Competitors need to get " + set.winCondition + " wins. "
                        + set.compOneUserName + " & " + set.compTwoUserName + " good luck!";
                }
                client.say(target, chatResponse);
                console.log(`* Executed ${commandInput} command`);
            }
        }


        //The following section relates to the sets
        if (commandInput.includes('!setc1')) {
            const splitInput = commandInput.split(" ");
            if (splitInput[1] !== null) {
                set.setCompOneUserName(splitInput[1]);
                const chatResponse = "Set the first competitor as " + set.compOneUserName;
                client.say(target, chatResponse);
                console.log(`* Executed ${commandInput} command`);
            }
        }

        //Sets the name of the second competitor
        if (commandInput.includes('!setc2')) {
            const splitInput = commandInput.split(" ");
            if (splitInput[1] !== null) {
                set.setCompTwoUserName(splitInput[1]);
                const chatResponse = "Set the second competitor as " + set.compTwoUserName;
                client.say(target, chatResponse);
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
                client.say(target, chatResponse);

                if (set.compOneUserName === "") {
                    client.say(target, "The first competitors name is not set");
                }

                if (set.compTwoUserName === "") {
                    client.say(target, "The second competitors name is not set");
                }

                console.log(`* Executed ${commandInput} command`);
            }
        }

        //Manually cleared the set
        if (commandInput.includes('!clearset')) {
            hanldeSetCompletion();
            const chatResponse = "The set has been cleared";
            client.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }

        //Increment the first competitors wins
        if (commandInput.includes('!c1w')) {
            let setCompleted = set.incrementCompOneWins();
            let chatResponse = set.compOneUserName + " now has " + set.compOneWins + " win(s)!";
            if (setCompleted) {
                chatResponse = "The set is over! The winner is " + set.winner + " !";
                hanldeSetCompletion();
            }
            client.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }

        //Increment the second competitors wins
        if (commandInput.includes('!c2w')) {
            let setCompleted = set.incrementCompTwoWins();
            let chatResponse = set.compTwoUserName + " now has " + set.compTwoWins + " win(s)!";
            if (setCompleted) {
                chatResponse = "The set is over! The winner is " + set.winner + " !";
                hanldeSetCompletion();
            }
            client.say(target, chatResponse);
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
            client.say(target, chatResponse);
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
            client.say(target, chatResponse);
            console.log(`* Executed ${commandInput} command`);
        }

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


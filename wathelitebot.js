/**
 * This section governs the connection and configuration to twitch.tv
 *
 */
const tmi = require('tmi.js');
require('custom-env').env();

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

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Successfully Connected to ${addr}:${port}`);
}


/**
 * This is the meat of the chat bot. This scans every time a message is sent
 *
 */
// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  //Following Line is for debug purposes
  // console.log(context);

  //See their permissions for privileged commands
  let hasBadges = false;
  try {
    console.log("Badges exist " + context.badges.moderator);
    hasBadges = true;
  }
  catch (exception) {
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

  //Privileged Command Section
  if (  hasBadges && (context.badges.broadcaster === '1' || context.badges.moderator === '1') ) {

    // edit arena command. This command is privileged
    if ( commandInput.includes('!editarena') ) {
      const splitInput = commandInput.split(" ");
      if (splitInput[1] !== null) {
        const chatResponse = editArena(splitInput[1]);
        client.say(target, chatResponse);
        console.log(`* Executed ${commandInput} command`);
      }
    }

    //30 Minute Warning Command. This command is privileged
    if (commandInput.includes('!warning')) {
      const splitInput = commandInput.split(" ");
      if (splitInput[1] !== null) {
        const chatResponse = timeWarning(splitInput[1]);
        client.say(target, chatResponse);
        console.log(`* Executed ${commandInput} command`);
      }
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
function rollDice20 () {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}

// Function called when the "dice" command is issued
function rollDice6 () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

//Function called when the editarena command is issued
function editArena (arenaID) {
  return "!editcommand !arena " + arenaID;
}

//Function called when the warning command is issued
function timeWarning(minutes) {
  let minsFromNow = new Date();
  minsFromNow = new Date(minsFromNow.getTime() + minutes*60000);
  let formattedTime = minsFromNow.toString();
  let splitTime = formattedTime.split(" ");
  formattedTime = splitTime[4] + " EST";
  return "The stream will be ending in roughly " + minutes
      + " minutes from now. That is approximately " +
      formattedTime;
}


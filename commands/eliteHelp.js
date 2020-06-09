module.exports = {
    name: 'elitehelp',
    description: 'Gives the Streamer and Mods useful info about other commands',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        let generalCommands =
            '-----------------\n' +
            'GENERAL COMMANDS \n' +
            '-----------------\n' +
            '!elitehelp | Return a list of commands. No arguments to this command\n' +
            '!editarena | Sets the arena for people to join e.g.(!editarena ABCDE). the arugment nj will let people know they cant join\n' +
            '!warning | Sends a message detailing a time in minutes in the future when the stream ends ' +
            'e.g.(!warning 30)\n' +
            '!savestream | Saves a flv file of my stream to my computer locally. No arguments to this command \n' +
            '!clearstreamingchannel | SHOULD remove all messages in the streaming channel. Use with EXTREME CAUTION!'
            '!editpass | sets the passcode / password for the arena or lobby\n\n'
        ;

        let streakCommands =
            '----------------\n' +
            'STREAK COMMANDS \n' +
            '----------------\n' +
            '!initstreak | Writes a file used on stream. Sets the name and wins of the player e.g.(!initstreak Watherum,1)\n' +
            '!sw | Increment the wins of the victor. No arguments to this command\n' +
            '!sl | Decrement the wins of the victor. No arguments to this command\n' +
            '!calckoth | Generates the leaderboard from the streak log and write it to discord' +
            '!logstreak | logs the current streak to the streak log' +
            '!clearstreak | clears the streak and the files on stream. No arguments to this command\n\n'
        ;

        let setCommands =
            '-------------\n' +
            'SET COMMANDS \n' +
            '-------------\n' +
            '!initset | Initialize the set files for a best of e.g.(!initSet bestOfNumberOfMatches,c1name,c2name)\n' +
            '!initfirst2 | Initialize the set files for a first to e.g.(!initfirst2 firstToNumberOfMatches,c1name,c2name)\n' +
            '!c1w | Increment the wins for the 1st competitor. No arguments to this command\n' +
            '!c2w | Increment the wins for the 2nd competitor. No arguments to this command\n' +
            '!clearset | Clears the set files. No arguments to this command\n\n' +
            '!c1l | Decrements the wins of the 1st competitor. No arguments to this command\n' +
            '!c2l | Decrements the wins of the 2nd competitor. No arguments to this command\n\n'
        ;

        let smashSinglesCommands =
            '------------------------------\n' +
            'SMASH BROS SINGLES COMMANDS \n' +
            '------------------------------\n' +
            '!opensingles | Opens the queue, allows people to enter the list \n' +
            '!closesingles | Closes the list, no one else can join after this point \n' +
            '!singlespopwath | Pops a person from the queue and creates a new set e.g.(!singlespopwath 5)\n' +
            '!mjoin | manually add a user to the singles set queue\n' +
            '!removecomp |  remove a user from the singles set queue. Best used in combo with !showqueue\n' +
            '!showqeueue | prints the current order of people in the queue\n\n'
        ;

        let marioLevelCommands =
            '----------------------\n' +
            'MARIO LEVEL COMMANDS \n' +
            '----------------------\n' +
            '!levelpop | Removes the top level id from the list, this one is played next \n' +
            '!openlevels | Opens the queue, and allows people to add ids to the list \n' +
            '!closelevels | Closes the queue, no one else can enter levels after this point \n\n'
        ;

        let countCommands =
            '-------------------\n' +
            'COUNT COMMANDS \n' +
            '-------------------\n' +
            '!ic | Increments the number of the count \n' +
            '!dc | Decrements the number of the count \n' +
            '!ic | Increments the number of the count \n' +
            '!resetcount | Reset the number and info of the count \n' +
            '!setcount | Sets the number of the count \n' +
            '!setinfo | Sets the info of the count \n\n';

        message.channel.send(generalCommands);
        message.channel.send(streakCommands);
        message.channel.send(setCommands);
        message.channel.send(smashSinglesCommands);
        message.channel.send(marioLevelCommands);
        message.channel.send(countCommands);

        console.log('Executed elitehelp command');
    },
};
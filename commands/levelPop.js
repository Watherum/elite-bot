module.exports = {
    name: 'levelpop',
    description: 'Pops a level from the queue to be played',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        let nextLevelID = marioLevelList.shift();
        let response = nextLevelID + ' is next!';
        message.channel.send(response);
        twitchClient.say(target, response);
        console.log(`* Executed levelpop command`);
    },
};
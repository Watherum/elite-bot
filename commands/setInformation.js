module.exports = {
    name: 'setinfo',
    description: 'resets the number and info in the count object',
    execute(database, discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        count.setInformation(args[0]);
        console.log(`* Executed setinfo command`);
    },
};
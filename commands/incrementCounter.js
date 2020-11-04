module.exports = {
    name: 'ic',
    description: 'Increments the number in the count object',
    execute(database, discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        count.incrementNumber();
        console.log(`* Executed ic command`);
    },
};
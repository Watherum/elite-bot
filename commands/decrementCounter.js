module.exports = {
    name: 'dc',
    description: 'Decrements the number in the count object',
    execute(database, discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        count.decrementNumber();
        console.log(`* Executed dc command`);
    },
};
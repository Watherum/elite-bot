module.exports = {
    name: 'resetcount',
    description: 'resets the number and info in the count object',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        count.resetCount();
        console.log(`* Executed resetcount command`);
    },
};
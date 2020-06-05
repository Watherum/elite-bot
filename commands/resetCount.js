module.exports = {
    name: 'resetcount',
    description: 'resets the number and info in the count object',
    execute(message, twitchClient, target, set, streak, arena, pass, count,
            textRecog, singlesSmashList, addSinglesPlayers, marioLevelList, addMarioLevels, args) {
        count.resetCount();
        console.log(`* Executed resetcount command`);
    },
};
module.exports = {
    name: 'ic',
    description: 'Increments the number in the count object',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        count.incrementNumber();
        console.log(`* Executed ic command`);
    },
};
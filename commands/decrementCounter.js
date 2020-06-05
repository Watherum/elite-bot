module.exports = {
    name: 'dc',
    description: 'Decrements the number in the count object',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        count.decrementNumber();
        console.log(`* Executed dc command`);
    },
};
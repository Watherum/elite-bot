module.exports = {
    name: 'setcount',
    description: 'sets the number in the count object',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        count.setCountNumber(args[0]);
        console.log(`* Executed setcount command`);
    },
};
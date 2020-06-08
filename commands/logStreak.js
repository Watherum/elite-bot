module.exports = {
    name: 'logstreak',
    description: 'Logs the previous streak in the open arena before the new streak',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        streak.logStreak(streak);
        console.log(`* Executed logstreak command`);
    },
};
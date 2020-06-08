module.exports = {
    name: 'sw',
    description: 'Updates the streak win count for the victor',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        streak.incrementWins();
        const chatResponse = streak.victor.trim() + "'s streak has been updated!";
        // twitchClient.say(target, chatResponse);
        console.log(`* Executed sw command`);
    },
};
const env = require('custom-env').env();
module.exports = {
    name: 'calckoth',
    description: 'Calculates the King of the Hill for the Open Arena',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        streak.logStreak(streak);

        const chatResponse = streak.calculateKingOfTheHill();
        discordClient.channels.get(process.env.DISCORD_OPEN_ARENA_LEADERBOARD_STREAK_CHANNEL_ID).send(chatResponse);

        const chatResponse2 = streak.calculateKingOfTheHillWins();
        discordClient.channels.get(process.env.DISCORD_OPEN_ARENA_LEADERBOARD_WINS_CHANNEL_ID).send(chatResponse2);

        twitchClient.say(target, "The leaderboard is available in the !discord");
        console.log(`* Executed calckoth command`);
    },
};
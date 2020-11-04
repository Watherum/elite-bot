const env = require('custom-env').env();
module.exports = {
    name: 'calcstats',
    description: 'Calculates the leaderboards and updates seasonal rankings for competitors in open arenas',
    execute(database, discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        //Save the current active streak
        streak.logStreak(streak);

        //Save leaderboards to discord
        const streakLeaderboard = streak.calculateKingOfTheHill();
        const streakResponse = streak.streakLeaderBoardChatResponse(streakLeaderboard);
        discordClient.channels.get(process.env.DISCORD_OPEN_ARENA_LEADERBOARD_STREAK_CHANNEL_ID).send(streakResponse);

        const winsLeaderboard = streak.calculateKingOfTheHillWins();
        const winsResponse = streak.winsLeaderboardChatResponse(winsLeaderboard);
        discordClient.channels.get(process.env.DISCORD_OPEN_ARENA_LEADERBOARD_WINS_CHANNEL_ID).send(winsResponse);

        //Save leaderboards to database
        database.handleLeaderBoardRecords(streakLeaderboard, winsLeaderboard);

        //Update season rankings in the database and print them to discord
        (async () => {
            if (process.env.SEASON_ENABLED.toLowerCase() === "true") {
                await database.updateSeasonRecords(streakLeaderboard, winsLeaderboard);
                let seasonChart = await database.getSeasonRecordChart();
                discordClient.channels.get(process.env.DISCORD_SEASON_RANKINGS_CHANNEL_ID).send(seasonChart);
            }
        })();

        twitchClient.say(target, "The leaderboards are available in the !discord");
        console.log(`* Executed calckoth command`);
    },
};
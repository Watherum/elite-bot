const env = require('custom-env').env();
module.exports = {
    name: 'calckoth',
    description: 'Calculates the King of the Hill for the Open Arena',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        const chatResponse = streak.calculateKingOfTheHill();
        twitchClient.say(target, "The leaderboard is available in the !discord");
        // message.channel.send(chatResponse);
        discordClient.channels.get(process.env.DISCORD_OPEN_ARENA_LEADERBOARD_CHANNEL_ID).send(chatResponse);
        console.log(`* Executed calckoth command`);
    },
};
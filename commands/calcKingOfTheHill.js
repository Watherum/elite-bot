module.exports = {
    name: 'calckoth',
    description: 'Calculates the King of the Hill for the Open Arena',
    execute(message, twitchClient, target, set, streak, arena, pass, count,
            textRecog, singlesSmashList, addSinglesPlayers, marioLevelList, addMarioLevels, args) {
        const chatResponse = streak.calculateKingOfTheHill();
        // twitchClient.say(target, chatResponse);
        message.channel.send(chatResponse);
        console.log(`* Executed calckoth command`);
    },
};
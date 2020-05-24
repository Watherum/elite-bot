module.exports = {
    name: 'showqueue',
    description: 'Shows the current queue of competitors for the set',
    execute(message,  twitchClient, target, set, streak, arena, pass, textRecog,
            singlesSmashList, addSinglesPlayers, marioLevelList, addMarioLevels, args) {
        let response = "";
        for (competitor in singlesSmashList) {
            response = response + singlesSmashList[competitor] + ", ";

        }
        message.channel.send(response);
        console.log(`* Executed showqueue command`);
    },
};
module.exports = {
    name: 'closesingles',
    description: 'Closes the singles queue so people cant join',
    execute(message,  twitchClient, target, set, streak, arena, pass, textRecog,
            singlesSmashList, addSinglesPlayers, marioLevelList, addMarioLevels, args) {
        addSinglesPlayers = false;
        let response = 'Singles queue is now closed';
        twitchClient.say(target, response);
        console.log(`* Executed closesingles command`);
    },
};
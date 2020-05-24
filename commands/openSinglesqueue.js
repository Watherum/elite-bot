module.exports = {
    name: 'opensingles',
    description: 'Open the singles queue for people to join',
    execute(message,  twitchClient, target, set, streak, arena, pass, textRecog,
            singlesSmashList, addSinglesPlayers, marioLevelList, addMarioLevels, args) {
        addSinglesPlayers = true;
        let response = 'Singles queue is now open!';
        twitchClient.say(target, response);
        console.log(`* Executed opensingles command`);
    },
};
module.exports = {
    name: 'openlevels',
    description: 'Opens the mario level queue for user levels',
    execute(message, twitchClient, target, set, streak, arena, pass, count,
            textRecog, singlesSmashList, addSinglesPlayers, marioLevelList, addMarioLevels, args) {
        addMarioLevels = true;
        let response = 'Level queue is now open!';
        twitchClient.say(target, response);
        console.log(`* Executed openlevels command`);
    },
};
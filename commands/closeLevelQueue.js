module.exports = {
    name: 'closelevels',
    description: 'Closes the mario level queue for user levels',
    execute(message, twitchClient, target, set, streak, arena, pass, count,
            textRecog, singlesSmashList, addSinglesPlayers, marioLevelList, addMarioLevels, args) {
        addMarioLevels = true;
        let response = 'Level queue is now closed!';
        twitchClient.say(target, response);
        console.log(`* Executed closelevels command`);
    },
};
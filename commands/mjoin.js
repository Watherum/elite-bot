module.exports = {
    name: 'mjoin',
    description: 'Manually adds a competitor to the list of competitors for a set',
    execute(message, twitchClient, target, set, streak, arena, pass, count,
            textRecog, singlesSmashList, addSinglesPlayers, marioLevelList, addMarioLevels, args) {

        let chatResponse = 'Ive manually added ' + args[0] + ' to the queue!';
        if (addSinglesPlayers) {
            singlesSmashList.push(args[0]);
        }

        twitchClient.say(target, chatResponse);
        console.log(`* Executed mjoin command`);
    },
};
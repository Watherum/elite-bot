module.exports = {
    name: 'mjoin',
    description: 'Manually adds a competitor to the list of competitors for a set',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {

        let chatResponse = 'Ive manually added ' + args[0] + ' to the queue!';
        if (addSinglesPlayers) {
            singlesSmashList.push(args[0]);
        }

        twitchClient.say(target, chatResponse);
        console.log(`* Executed mjoin command`);
    },
};
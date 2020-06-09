module.exports = {
    name: 'initfirst2',
    description: 'populates the data in the set for the competitors',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        let chatResponse = "Malformed commamnd. Ex. !initfirst2 firsrtToNumber c1name c2name";
        if (args[0] !== null && args[1] !== null && args[2] !== null) {
            set.setUpFirstTo(args[0]);
            set.setCompOneUserName(args[1].trim());
            set.setCompTwoUserName(args[2].trim());
            chatResponse = "This is a first to " + set.firstTo + ". Competitors need to get " + set.winCondition + " wins. "
                + set.compOneUserName.trim() + " & " + set.compTwoUserName.trim() + " good luck!";
        }
        twitchClient.say(target, chatResponse);
        console.log(`* Executed initfirst2 command`);
    },
};
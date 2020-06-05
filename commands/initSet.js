module.exports = {
    name: 'initset',
    description: 'populates the data in the set for the competitors',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        let chatResponse = "Malformed commamnd. Ex. !initSet bestofnumber c1name c2name";
            if (args[0] !== null && args[1] !== null && args[2] !== null) {
                set.setUpBestOf(args[0]);
                set.setCompOneUserName(args[1].trim());
                set.setCompTwoUserName(args[2].trim());
                chatResponse = "This is a best of " + set.bestOf + ". Competitors need to get " + set.winCondition + " wins. "
                    + set.compOneUserName.trim() + " & " + set.compTwoUserName.trim() + " good luck!";
            }
            twitchClient.say(target, chatResponse);
            console.log(`* Executed initset command`);
    },
};
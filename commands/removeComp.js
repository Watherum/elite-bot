module.exports = {
    name: 'removecomp',
    description: 'Removes a competitor from the queue',
    execute(message,  twitchClient, target, set, streak, arena, pass, textRecog,
            singlesSmashList, addSinglesPlayers, marioLevelList, addMarioLevels, args) {
        for (var i = 0; i < singlesSmashList.length; i++) {
            if (singlesSmashList[i] === args[0]) {
                singlesSmashList.splice(i, 1);
            }
        }
        message.channel.send("Removed " + args[0] + " from the queue");
        console.log(`* Executed removecomp command`);
    },
};
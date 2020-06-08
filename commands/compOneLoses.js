module.exports = {
    name: 'c1l',
    description: 'Updates the win count for comp. 1 in the set',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        let setCompleted = set.decrementCompOneWins();
        let chatResponse = set.compOneUserName + " now has " + set.compOneWins + " win(s)!";
        if (setCompleted) {
            chatResponse = "The set is over! The winner is " + set.winner.trim() + " !";
        }
        // message.channel.send(chatResponse);
        twitchClient.say(target, chatResponse);
        console.log(`* Executed c1l command`);
    },
};
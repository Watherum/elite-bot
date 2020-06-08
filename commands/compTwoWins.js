module.exports = {
    name: 'c2w',
    description: 'Updates the win count for comp. 2 in the set',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        let setCompleted = set.incrementCompTwoWins();
        let chatResponse = set.compTwoUserName + " now has " + set.compTwoWins + " win(s)!";
        if (setCompleted) {
            chatResponse = "The set is over! The winner is " + set.winner.trim() + " !";
        }
        // message.channel.send(chatResponse);
        twitchClient.say(target, chatResponse);
        console.log(`* Executed c2w command`);
    },
};
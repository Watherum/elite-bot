module.exports = {
    name: 'c2l',
    description: 'Updates the win count for comp. 2 in the set',
    execute(message,  twitchClient, target, set, streak, arena, pass, textRecog,
            singlesSmashList, addSinglesPlayers, marioLevelList, addMarioLevels, args) {
        let setCompleted = set.decrementCompTwoWins();
        let chatResponse = set.compTwoUserName + " now has " + set.compTwoWins + " win(s)!";
        if (setCompleted) {
            chatResponse = "The set is over! The winner is " + set.winner.trim() + " !";
        }
        // message.channel.send(chatResponse);
        twitchClient.say(target, chatResponse);
        console.log(`* Executed c2l command`);
    },
};
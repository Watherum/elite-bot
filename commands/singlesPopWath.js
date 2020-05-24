module.exports = {
    name: 'singlespopwath',
    description: 'Initiates a set with Watherum as Comp. 1 and someone from the queue as Comp. 2',
    execute(message, twitchClient, target, set, streak, arena, pass, textRecog,
            singlesSmashList, addSinglesPlayers, marioLevelList, addMarioLevels, args) {

        console.log('inside command');

        let nextPlayer = singlesSmashList.shift();
        singlesSmashList.push(nextPlayer);
        let response = nextPlayer + ' is now up!';

        set.clearSet(set);
        set.setUpBestOf(args[0]);
        set.setCompOneUserName('Watherum');
        set.setCompTwoUserName(nextPlayer);

        message.channel.send(response);
        twitchClient.say(target, response);
        console.log(`* Executed singlespopwath command`);
    },
};
module.exports = {
    name: 'editpass',
    description: 'Edits the pass variable which chat uses to access the lobby',
    execute(message,  twitchClient, target, set, streak, arena, pass, textRecog,
            singlesSmashList, addSinglesPlayers, marioLevelList, addMarioLevels, args) {
        if (args[0] !== null) {
            pass = (args[0]);
            let chatResponse = "passcode updated! Use !passcode";
            if (args[0] === 'nj' || isEmpty(pass)) {
                chatResponse = "The arena/lobby is currently not joinable";
            }
            twitchClient.say(target, chatResponse);
            message.channel.send(chatResponse);
            console.log(`* Executed editpass command`);

            function isEmpty(str) {
                return (!str || 0 === str.length);
            }
        }
    },
};
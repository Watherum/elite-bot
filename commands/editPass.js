module.exports = {
    name: 'editpass',
    description: 'Edits the pass variable which chat uses to access the lobby',
    execute(database, discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        if (args[0] !== null) {
            pass.code = (args[0]);
            let chatResponse = "passcode updated! Use !passcode";
            if (args[0] === 'nj' || isEmpty(pass.code)) {
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
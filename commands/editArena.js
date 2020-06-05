module.exports = {
    name: 'editarena',
    description: 'Edits the arena variable which chat uses to find the arena',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        arena.id = args[0];
        let chatResponse = "Arena ID updated! Use !arena to get the ID";
        if (args[0] === 'nj' || isEmpty(arena.id)) {
            chatResponse = "The arena is currently not joinable";
        }
        twitchClient.say(target, chatResponse);
        console.log(`* Executed editarena command`);

        function isEmpty(str) {
            return (!str || 0 === str.length);
        }
    },
};
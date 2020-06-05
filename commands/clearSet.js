module.exports = {
    name: 'clearset',
    description: 'Clears the data in the set files. Writes to the set log if the set is complete',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        set.clearSet(set);
        const chatResponse = "The set has been cleared";
        message.channel.send(chatResponse);
        console.log(`* Executed clearset command`);
    },
};
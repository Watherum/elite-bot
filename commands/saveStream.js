module.exports = {
    name: 'savestream',
    description: 'saves the current stream into an flv file',
    execute(database, discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {
        frameProcessing.createStreamFile();
        message.channel.send('The stream flv file has been created');
        console.log(`* Executed savestream command`);
    },
};
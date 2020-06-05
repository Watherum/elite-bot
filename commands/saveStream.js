module.exports = {
    name: 'savestream',
    description: 'saves the current stream into an flv file',
    execute(message, twitchClient, target, set, streak, arena, pass, count,
            textRecog, singlesSmashList, addSinglesPlayers, marioLevelList, addMarioLevels, args) {
        textRecog.createStreamFile();
        message.channel.send('The stream flv file has been created');
        console.log(`* Executed savestream command`);
    },
};
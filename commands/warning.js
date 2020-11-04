module.exports = {
    name: 'warning',
    description: 'Sends a warning to the chat about when the stream will end',
    execute(database, discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, frameProcessing, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {

        const chatResponse = timeWarning(args[0]);
        twitchClient.say(target, chatResponse);
        console.log(`* Executed warning command`);

        //Function called when the warning command is issued
        function timeWarning(minutes) {
            let minsFromNow = new Date();
            minsFromNow = new Date(minsFromNow.getTime() + minutes * 60000);
            let formattedTime = minsFromNow.toString();
            let splitTime = formattedTime.split(" ");
            formattedTime = splitTime[4] + " EST";
            return "The stream will be ending in roughly " + minutes
                + " minutes from now. That is approximately " +
                formattedTime;
        }

        function convertEpochToHumanDate(epochDate) {
            return new Date(epochDate * 1000);
        }
    },
};
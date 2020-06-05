module.exports = {
    name: 'clearstreamingchannel',
    description: 'Clears the streaming channel in discord',
    execute(discordClient, message, twitchClient, target,
            set, streak, arena, pass, count,
            textRecog, singlesSmashList, addSinglesPlayers,
            marioLevelList, addMarioLevels, args) {

        asyncCall();

        async function asyncCall() {
            let fetched;
            do {
                fetched = await message.channel.fetchMessages({limit: 100});
                console.log("fetched " + fetched.size);
                await message.channel.bulkDelete(fetched);
            }
            while (fetched.size >= 2);
        }

        console.log(`* Executed clearstreamingchannel command`);
    },
};


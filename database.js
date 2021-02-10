const env = require('custom-env').env();
const { Pool } = require('pg');

database = function() {

     this.pool = new Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
        max: 20
    });

    this.pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    });

    /**
     * Creates the date that will be inserted into the leaderboard_dates table
     * @returns {string}
     */
    this.getDate = function() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        return today
    };

    /**
     * Ensures the return of a competitors information from the database. By retrieving or creating it
     * @param competitor
     * @returns {*}
     */
    this.getOrCreateCompetitor = async function (competitorName) {
        let data = await this.pool
            .query('Select * from elitebot.stats.competitors where competitor ilike $1;', [competitorName])
            .catch(err => console.error('Error executing query', err.stack));
        if (data.rows[0] === undefined) {
            data = await this.insertCompetitor(competitorName);
            return data;
        }
        return data.rows[0];
    };

    /**
     * Inserts a competitor into the database
     * @param competitor
     * @returns {*}
     */
    this.insertCompetitor = async function (competitorName) {
        let data = await this.pool
            .query('INSERT INTO elitebot.stats.competitors(competitor) values ($1) RETURNING *', [competitorName])
            .catch(err => console.error('Error executing query', err.stack));
        return data.rows[0];
    };

    /**
     * Ensures proper acquisition of the the leaderboard date id from the database by retrieving or creating it
     * @returns {Promise<*|HTMLTableRowElement|string>}
     */
    this.getorCreateLeaderBoardDate = async function () {
        let data = await this.pool
            .query('SELECT id from elitebot.stats.leaderboard_dates where datetime ilike $1;', [this.getDate()])
            .catch(err => console.error('Error executing query', err.stack));
        if (data.rows[0] === undefined) {
            data = await this.insertLeaderBoardDate();
            return data;
        }
        return data.rows[0];
    };

    /**
     * Inserts the leaderboard date into the database
     * @returns {*}
     */
    this.insertLeaderBoardDate = async function () {
        let data = await this.pool
            .query('INSERT INTO elitebot.stats.leaderboard_dates(datetime) values ($1) RETURNING id', [this.getDate()])
            .catch(err => console.error('Error executing query', err.stack));
        return data.rows[0];
    };


    /**
     * Cycles thru the leaderboards and updates competitors records properly
     * @param streakLeaderboard
     * @param winsLeaderboard
     * @returns {Promise<void>}
     */
    this.updateSeasonRecords = async function(streakLeaderboard, winsLeaderboard) {

        //Key is the competitors name and the value is either the streak or total wins
        for (const [key, value] of streakLeaderboard.entries()) {
            let competitor = await this.getOrCreateCompetitor(key);
            let newPoints = ( parseInt(value) * parseInt(process.env.STREAK_MODIFIER) )
                +  ( parseInt(winsLeaderboard.get(key) ) * parseInt(process.env.WIN_MODIFIER) );
            let currentSeasonRecord = await this.getCompetitorSeasonRecord(competitor.id);
            if (currentSeasonRecord === undefined) {
                //Insert season record
                await this.insertSeasonRecord(competitor.id, newPoints);
            }
            else {
                await this.updateSeasonRecord(competitor.id, parseInt(currentSeasonRecord.points) + newPoints);
            }
        }
    }

    /**
     * Updates an individual competitors season record
     * @param competitorID
     * @param points
     * @returns {Promise<*|HTMLTableRowElement|string>}
     */
    this.updateSeasonRecord = async function(competitorID, points) {
        let data = await this.pool
            .query('update elitebot.stats.season_leaderboards set points = $3 where season_number = $1 and competitor_id = $2;', [process.env.SEASON_NUMBER, competitorID, points])
            .catch(err => console.error('Error executing query', err.stack));
        return data.rows[0];
    }

    /**
     * Inserts a new competitors season record
     * @param competitorID
     * @param points
     * @returns {Promise<*|HTMLTableRowElement|string>}
     */
    this.insertSeasonRecord = async function(competitorID, points) {
        let data = await this.pool
            .query('INSERT INTO elitebot.stats.season_leaderboards(season_number, competitor_id, points) VALUES ($1, $2, $3);', [process.env.SEASON_NUMBER, competitorID, points])
            .catch(err => console.error('Error executing query', err.stack));
        return data.rows[0];
    }

    /**
     * Retrieves a single competitors season record from the database
     * @param competitorID
     * @returns {Promise<*|HTMLTableRowElement|string>}
     */
    this.getCompetitorSeasonRecord = async function(competitorID) {
        let data = await this.pool
            .query('SELECT competitor_id, points from elitebot.stats.season_leaderboards where season_number = $1 and competitor_id = $2;', [process.env.SEASON_NUMBER, competitorID])
            .catch(err => console.error('Error executing query', err.stack));
        return data.rows[0];
    }

    /**
     * Returns a pretty text chart of the current season standings
     * @returns {Promise<[]>}
     */
    this.getSeasonRecordChart = async function () {
        let data = await this.pool
            .query('Select c.competitor, l.points from elitebot.stats.season_leaderboards l, elitebot.stats.competitors c where season_number = $1 and l.competitor_id = c.id order by points asc', [process.env.SEASON_NUMBER])
            .catch(err => console.error('Error executing query', err.stack));

        let prettySeasonChart = [];
        prettySeasonChart.push("-----------------------------------------------")
        data.rows.forEach(data => prettySeasonChart.push(data.competitor + " - Points: " + data.points));
        prettySeasonChart.push("-----------------------------------------------")
        prettySeasonChart.push("|                    Season " + process.env.SEASON_NUMBER + " Standings                 |")
        prettySeasonChart.push("-----------------------------------------------")
        prettySeasonChart.reverse();

        return prettySeasonChart;
    }

    /**
     *
     * @param streakLeaderboard
     * @param winsLeaderboard
     * @returns {Promise<void>}
     */
    this.handleLeaderBoardRecords = async function (streakLeaderboard, winsLeaderboard) {
        try {
            //For both leaderbaords, the key is the competitor name.
            //The value is either the total wins or the streak number
            let datetime = await this.getorCreateLeaderBoardDate();

            for (const [key, value] of streakLeaderboard.entries()) {
                let competitor = await this.getOrCreateCompetitor(key);
                this.insertStreakRecord(competitor.id, value, datetime.id);

                let wins = parseInt( winsLeaderboard.get(key) );
                await this.insertWinRecord(competitor.id, wins, datetime.id);
            }

        }
        catch (err) {
            console.log("Error writing leaderboard data " + err);
        }

    }

    /**
     * Inserts a single record from the streak leaderboard map into the database
     * @returns {*}
     */
    this.insertStreakRecord = async function (competitorID, streak, datetimeID) {
        let data = await this.pool
            .query('INSERT INTO elitebot.stats.arena_streak_leaderboards(competitor_id, streak, datetime_id) VALUES ($1,$2,$3);', [competitorID, streak, datetimeID])
            .catch(err => console.error('Error executing query', err.stack));
        return data.rows[0];
    };

    /**
     * Inserts a single record from the win leaderboard map into the database
     * @returns {*}
     */
    this.insertWinRecord = async function (competitorID, wins, datetimeID) {
        let data = await this.pool
            .query('INSERT INTO elitebot.stats.arena_wins_leaderboards(competitor_id, wins, datetime_id) VALUES ($1,$2,$3);', [competitorID, wins, datetimeID])
            .catch(err => console.error('Error executing query', err.stack));
        return data.rows[0];
    };
}

module.exports = {
    connectToDatabase : function () {
        return new database();
    }
};
/**
 * A simplistic database connection manager.
 * 
 * @param {mongoose} mongoose 
 */
function dbManager(mongoose) {
    function openDbConnection(req, res, next) {
        console.debug('Opening database connection');
        mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, dbName: 'fcc_exercise_tracker' })
            .then(function () {
                console.debug('Connected to database');
                if (next) next();
            }, function (err) {
                console.error('Failed to connet to the database: ', err);
                if (next) next();
            });
    }
    
    function closeDbConnection(req, res, next) {
        console.debug('Closing database connection');
        mongoose.connection.close();
        if (next) next();
    }

    return {
        open: openDbConnection,
        close: closeDbConnection
    };
}

module.exports = dbManager;

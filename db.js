function dbManager(mongoose) {
    function openDbConnection(req, res, next) {
        console.debug('Opening database connection');
        mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, dbName: 'exercise_db' })
            .then(function () {
                console.debug('Connected to database');
                next();
            }, function (err) {
                console.error('Failed to connet to the database: ', err);
                next();
            });
    }
    
    function closeDbConnection(req, res, next) {
        console.debug('Closing database connection');
        mongoose.connection.close();
        next();
    }

    return {
        open: openDbConnection,
        close: closeDbConnection
    };
}

module.exports = dbManager;

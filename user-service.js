const ServiceHelper = require('./service-response').ServiceHelper;
const serviceHelper = new ServiceHelper();
const [User, Exercise] = require('./models');
const { isValidDate } = require('./utils');

class UserService {
    createUser(data, callback) {
        if (!data.username) {
            callback(illegal(['username']));
        }
        this.findUser(data.username, function(err, result) {
            if (err) return err;
            if (result) {
                console.debug('User found: ', result);
                return callback(serviceHelper.duplicate({
                    entity: 'user',
                    username: data.username
                }));
            }
            const user = new User(data);
            return user.save(function (saveErr, saved) {
                if (saveErr) return callback(serviceHelper.error(saveErr));
                return callback(serviceHelper.ok(saved));
            });
        });
    }

    findUser(by, cb) {
        function userSearch(error, user) {
            if (error) return cb(serviceHelper.error(error), null);
            return cb(null, serviceHelper.ok(user));
        }

        if (by.hasOwnProperty('_id')) {
            User.findById(by._id, userSearch);
        } else {
            User.findOne(by, userSearch);
        }
    }

    addExercise(exercise, cb) {
        this.findUser({
            _id: exercise.userId
        }, function(searchErr, user) {
            if (searchErr) return cb(serviceHelper.error(searchErr));
            if (!user) {
                return cb(serviceHelper.notFound({
                    entity: 'user',
                    userId: userId
                }));
            }
            const model = new Exercise(exercise);
            return model.save(function(saveErr, savedExercise) {
                if (saveErr) return cb(serviceHelper.error(saveErr));
                return cb(serviceHelper.ok(savedExercise));
            });
        });
    }

    loadLogs(log, cb) {
        console.log('Loading logs: ', log);
        this.findUser({
            _id: log.userId
        }, function(searchErr, user) {
            console.log('User found');
            if (searchErr) return cb(serviceHelper.error(searchErr));
            if (!user) {
                return cb(serviceHelper.notFound({
                    entity: 'user',
                    userId: log.userId
                }));
            }
            const q = Exercise.find({
                userId: log.userId
            });
            let date = new Date(log.from);
            if (isValidDate(date)) {
                console.log('valid fromDate:', date);
                q.where('date').gte(date);
            }
            date = new Date(log.to);
            if (isValidDate(date)) {
                console.log('valid toDate:', date);
                q.where('date').lte(date);
            }
            
            const limit = parseInt(log.limit);
            if (!Number.isNaN(limit)) {
                q.limit(limit);
            }
            console.log('limit: ', limit);
            return q.exec(function(err, result) {
                if (err) return cb(serviceHelper.error(err));
                console.log('Found exercises:', result);
                return cb(serviceHelper.ok(result));
            });
        });
    }
}

module.exports = new UserService;

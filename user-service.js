const ServiceHelper = require('./service-response').ServiceHelper;
const serviceHelper = new ServiceHelper();
const [User, Exercise] = require('./models');

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
            if (searchErr) return cb(searchErr, null);
            if (!user) {
                return cb(serviceHelper.notFound({
                    entity: 'user',
                    userId: userId
                }));
            }
            const model = new Exercise(exercise);
            return model.save(function(saveErr, savedExercise) {
                if (saveErr) return cb(serviceHelper.error(saveErr), null);
                return cb(serviceHelper.ok(savedExercise));
            });
        });
    }
}

module.exports = new UserService;

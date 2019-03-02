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

    findUser(userName, cb) {
        User.findOne({ username: userName }, function (findErr, result) {
            if (findErr) return cb(serviceHelper.error(findErr), null);
            return cb(findErr, result);
        });
    }
}

module.exports = new UserService;

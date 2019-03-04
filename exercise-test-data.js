require('dotenv').config();
const mongoose = require('mongoose');
const [User, Exercise] = require('./models');
const dbManager = require('./db')(mongoose);

const userNames = ['john', 'jane', 'paula'];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createExercises(u) {
    console.log('Creating exercise for ', u);
    const exerciseNum = randomInt(2, 10);
    console.log(`Creating ${exerciseNum} exercises`);
    const exercises = [];

    for (let i = 0; i < exerciseNum; i++) {
        const data = {
            userId: u._id,
            description: `${u.username} exercise description`,
            duration: randomInt(5, 120),
            date: new Date(randomInt(2017, 2019), randomInt(0, 11), randomInt(1, 28))
        };
        console.log('Generated exercise: ', data);
        exercises.push(new Exercise(data));
    }
    return exercises;
}

function createUsers(done) {
    console.log('Creating users');
    const users = [];

    for (let i = 0; i < userNames.length; i++) {
        const data = new User({
            username: userNames[i]
        });
        users.push(data);
    }

    User.insertMany(users, function (e, users) {
        if (e) {
            console.error('Failed to create user', e);
        } else {
            const docs = [];
            users.forEach((u, i, a) => {
                docs.push(...createExercises(u));
            });
            Exercise.insertMany(docs, function(err, exercises) {
                if (err) return done(err);
                console.log('Saved exercises:', exercises);
                return done();
            });
        }
    });
}

dbManager.open(null, null, function() {
    createUsers(function(err) {
        if (err) {
            console.error('Operation failed:', err);
            return User.deleteMany({}, function(err) {
                if (err) {
                    console.error('Failed to delete users', err);
                    return;
                }
                Exercise.deleteMany({}, function(err) {
                    if (err) console.error('Failed to delete exercises', err);
                    dbManager.close();
                });
            });
        } else {
            dbManager.close();
        }
    });
});

const express = require('express');
const router = express.Router();
const userService = require('./user-service');
const HttpResponse = require('./http-response');

router.post('/new-user', function (req, res) {
    console.debug('Trying to create a new user');
    userService.createUser({
        username: req.body.username
    }, function (response) {
        return new HttpResponse(res, response).buildResponse();
    });
});

router.post('/add', function (req, res) {
    console.debug('Trying to add an exercise: ', req.body, req.params);
    userService.addExercise(req.body.exercise,
        function (response) {
            return new HttpResponse(res, response).buildResponse();
        });
})

router.get('/log', function (req, res) {

});

module.exports = router;

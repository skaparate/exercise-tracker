const express = require('express');
const router = express.Router();
const userService = require('./user-service');
const HttpResponse = require('./http-response');

router.post('/new-user', function (req, res) {
    console.debug('Trying to create a new user', req.body, res.params);
    userService.createUser({
        username: req.body.username
    }, function (response) {
        return new HttpResponse(res, response).buildResponse();
    });
});

router.post('/add', function (req, res) {
    console.debug('Trying to add an exercise: ', req.body, req.params);
    userService.addExercise(req.body,
        function (response) {
            return new HttpResponse(res, response).buildResponse();
        });
})

router.get('/log', function (req, res) {
    console.log('Querying exercise data', req.body, req.params, req.query);
    const query = {
        userId: req.query.userId,
        from: req.query.from,
        to: req.query.to,
        limit: req.query.limit,
        page: req.query.page
    };
    return userService.loadLogs(query,
        function(response) {
            return new HttpResponse(res, response).buildResponse();
        });
});

module.exports = router;

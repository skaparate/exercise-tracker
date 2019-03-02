const express = require('express');
const router = express.Router();
const userService = require('./user-service');
const HttpResponse = require('./http-response');

router.post('/new-user', function(req, res) {
    console.debug('Trying to create a new user');
    userService.createUser({
        username: req.body.username
    }, function(response) {
        return new HttpResponse(res, response).buildResponse();
    });
});

router.post('/add', function(req, res) {

})

router.get('/log', function(req, res) {

});

module.exports = router;

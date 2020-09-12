const express = require("express");
const router = express.Router();
const userService = require("./user-service");
const HttpResponse = require("./http-response");

router.get("/users", async (req, res) => {
  const list = await userService.listUsers();
  res.json(list);
});

router.post("/new-user", async (req, res) => {
  console.debug("Trying to create a new user", req.body, res.params);
  const result = await userService.createUser({
    username: req.body.username
  });
  return new HttpResponse(res, result).buildResponse();
});

router.post("/add", async (req, res) => {
  console.debug("Trying to add an exercise: ", req.body, req.params);
  const result = await userService.addExercise(req.body);
  return new HttpResponse(res, result).buildResponse();
});

router.get("/log", async (req, res) => {
  console.log("Querying exercise data", req.body, req.params, req.query);
  const { userId, from, to, limit, page } = req.query;
  const result = await userService.loadLogs({
    userId,
    from,
    to,
    limit,
    page
  });
  return new HttpResponse(res, result).buildResponse();
});

module.exports = router;

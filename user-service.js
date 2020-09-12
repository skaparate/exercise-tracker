const ServiceHelper = require("./service-response").ServiceHelper;
const serviceHelper = new ServiceHelper();
const [User, Exercise] = require("./models");
const { isValidDate } = require("./utils");

class UserService {
  async listUsers() {
    try {
      return await User.find({});
    } catch (e) {
      console.error("Failed to retrieve user list:", e);
    }
    return [];
  }

  async createUser(data, callback) {
    console.log("Creating user: ", data);
    if (!data.username) {
      return serviceHelper.illegal(["username"]);
    }

    try {
      const result = await this.findUser({ username: data.username });

      if (result._data) {
        console.debug("User found: ", result);
        return callback(
          serviceHelper.duplicate({
            entity: "user",
            username: data.username
          })
        );
      }
      console.log("Building user model");
      let user = new User(data);
      user = await user.save();
      return serviceHelper.ok(user);
    } catch (e) {
      console.error("Failed to add user:", e);
      return serviceHelper.error(e);
    }
  }

  async findUser(by) {
    console.debug('findUser:', by);
    let user;

    try {
      if (by.hasOwnProperty("_id")) {
        user = await User.findById(by._id);
      } else {
        user = await User.findOne(by);
      }
      console.debug("Found user:", user);
      return serviceHelper.ok(user);
    } catch (e) {
      return serviceHelper.error(e);
    }
  }

  async addExercise(exercise) {
    console.debug("addExercise:", exercise);

    try {
      const user = await this.findUser({
        _id: exercise.userId
      });

      if (!user._data) {
        return serviceHelper.notFound({
          entity: "user",
          userId: exercise.userId
        });
      }

      if (!exercise.date) {
        exercise.date = new Date();
      }

      const model = new Exercise(exercise);
      const {_id, duration, description, date, username} = await model.save();
      return serviceHelper.ok({
        _id: user._data._id,
        duration,
        description,
        date: date.toDateString(),
        username: user._data.username,
      });
    } catch (e) {
      console.error("Could not add exercise:", e);
      return serviceHelper.error(e);
    }
  }

  async loadLogs(log, cb) {
    console.log("Loading logs: ", log);
    const user = await this.findUser({
      _id: log.userId
    });
    console.log("User found:", user);

    if (!user._data) {
      return;
      serviceHelper.notFound({
        entity: "user",
        userId: log.userId
      });
    }
    const q = Exercise.find(
      {
        userId: log.userId
      },
      {
        _id: 0,
        __v: 0
      }
    );
    let date = new Date(log.from);

    if (isValidDate(date)) {
      console.log("valid fromDate:", date);
      q.where("date").gte(date);
    }

    date = new Date(log.to);

    if (isValidDate(date)) {
      console.log("valid toDate:", date);
      q.where("date").lte(date);
    }

    const limit = parseInt(log.limit);
    console.log("limit: ", limit);

    q.setOptions({
      limit: limit
    });

    try {
      const result = await q.exec();
      console.log("Found exercises:", result);
      return serviceHelper.ok({
        _id: user._data._id,
        username: user._data.username,
        log: result
      });
    } catch (e) {
      console.error("Could not retrieve exercise list:", e);
      return serviceHelper.error(e);
    }
  }
}

module.exports = new UserService();

const express = require("express");
const timelines = require("../routes/timelines");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");
var cors = require("cors");

module.exports = function(app) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/timeline", timelines);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};

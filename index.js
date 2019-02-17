const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const timelines = require("./routes/timelines");
const users = require("./routes/users");

const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost/faceclone-api")
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use("/api/timeline", timelines);
app.use("/api/users", users);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));

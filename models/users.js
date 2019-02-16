const mongoose = require("mongoose");
const Joi = require("joi");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  })
);

function validateUser(timeline) {
  const schema = {
    name: Joi.string().required()
  };

  return Joi.validate(timeline, schema);
}

exports.User = User;
exports.validate = validateUser;

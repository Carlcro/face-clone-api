const mongoose = require("mongoose");
const Joi = require("joi");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      maxlength: 50
    },
    email: {
      type: String,
      unique: true,
      maxlength: 50,
      minlength: 5
    },
    password: {
      type: String,
      maxlength: 1024,
      minlength: 5
    }
  })
);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .required()
      .max(50),
    email: Joi.string()
      .required()
      .max(50)
      .email(),
    password: Joi.string()
      .required()
      .min(5)
      .max(255)
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;

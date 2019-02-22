const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    maxlength: 50,
    minlength: 5,
    lowercase: true
  },
  password: {
    type: String,
    maxlength: 1024,
    minlength: 5
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, name: this.name },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

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

const mongoose = require("mongoose");
const Joi = require("joi");
const { commentSchema } = require("./comments");

const Timeline = mongoose.model(
  "Timeline",
  new mongoose.Schema({
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    timeStamp: {
      type: Date,
      default: Date.now
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    comments: [
      {
        type: commentSchema
      }
    ],
    body: {
      type: String,
      required: true
    }
  })
);

function validateTimeline(timeline) {
  const schema = {
    authorId: Joi.objectId().required(),
    timeStamp: Joi.string(),
    likes: Joi.array(),
    body: Joi.string().required()
  };

  return Joi.validate(timeline, schema);
}

function validateLike(like) {
  const schema = {
    userId: Joi.string().required()
  };

  return Joi.validate(like, schema);
}

exports.Timeline = Timeline;
exports.validate = validateTimeline;
exports.validateLike = validateLike;

const mongoose = require("mongoose");
const Joi = require("joi");

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
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users"
    },
    body: {
      type: String,
      required: true
    }
  })
);

function validateTimeline(timeline) {
  const schema = {
    authorId: Joi.string().required(),
    timeStamp: Joi.string(),
    likes: Joi.array(),
    body: Joi.string().required()
  };

  return Joi.validate(timeline, schema);
}

exports.Timeline = Timeline;
exports.validate = validateTimeline;

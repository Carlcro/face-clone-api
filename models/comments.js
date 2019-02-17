const mongoose = require("mongoose");
const Joi = require("joi");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  timeStamp: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    required: true,
    maxlength: 255
  }
});

const Comment = mongoose.model("Comment", commentSchema);

function validateComment(comment) {
  const schema = {
    authorId: Joi.objectId().required(),
    content: Joi.string().max(255)
  };

  return Joi.validate(comment, schema);
}

exports.commentSchema = commentSchema;
exports.Comment = Comment;
exports.validateComment = validateComment;

const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { Timeline, validate, validateLike } = require("../models/timelines");
const { validateComment } = require("../models/comments");
const _ = require("lodash");

router.get("/", async (req, res) => {
  const timeline = await Timeline.find()
    .sort("-timestamp")
    .populate("author", "name")
    .populate("comments.userId", "name")
    .populate("likes", "name");

  res.send(timeline);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let timeline = new Timeline({
    author: req.user,
    body: req.body.body
  });
  timeline = await timeline.save();

  res.send(timeline);
});

router.put("/like/:id", auth, async (req, res) => {
  let timeline = {};

  if (req.body.liked) {
    timeline = await Timeline.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
      .populate("comments.userId", "name")
      .populate("author", "name")
      .populate("likes", "name");
  } else {
    timeline = await Timeline.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
      .populate("comments.userId", "name")
      .populate("author", "name")
      .populate("likes", "name");
  }

  if (!timeline)
    return res
      .status(404)
      .send("The timeline with the given ID was not found.");

  res.send(timeline);
});

router.put("/comment/:id", auth, async (req, res) => {
  const { error } = validateComment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const timeline = await Timeline.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        comments: {
          userId: req.user._id,
          content: req.body.content
        }
      }
    },
    { new: true }
  )
    .populate("comments.userId", "name")
    .populate("author", "name")
    .populate("likes", "name");

  if (!timeline)
    return res
      .status(404)
      .send("The timeline with the given ID was not found.");

  const result = _.pick(timeline, ["_id", "body", "timeStamp"]);

  res.send(timeline);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const timeline = await Timeline.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.name },
    {
      new: true
    }
  );

  if (!timeline)
    return res
      .status(404)
      .send("The timeline with the given ID was not found.");

  res.send(timeline);
});

router.delete("/:id", async (req, res) => {
  const timeline = await Timeline.findByIdAndRemove(req.params.id);

  if (!timeline)
    return res
      .status(404)
      .send("The timeline with the given ID was not found.");

  res.send(timeline);
});

router.get("/:id", async (req, res) => {
  const timeline = await Timeline.findById(req.params.id)
    .populate("author", "name")
    .populate("likes", "name")
    .populate("comments.userId", "name");

  if (!timeline)
    return res
      .status(404)
      .send("The timeline with the given ID was not found.");

  res.send(timeline);
});

module.exports = router;

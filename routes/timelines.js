const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { Timeline, validate, validateLike } = require("../models/timelines");
const { validateComment } = require("../models/comments");

router.get("/", async (req, res) => {
  const timeline = await Timeline.find().sort("-timestamp");
  res.send(timeline);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let timeline = new Timeline({
    author: req.body.authorId,
    body: req.body.body
  });
  timeline = await timeline.save();

  res.send(timeline);
});

router.put("/like/:id", async (req, res) => {
  const { error } = validateLike(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const timeline = await Timeline.findByIdAndUpdate(
    req.params.id,
    { $push: { likes: req.body.userId } },
    { new: true }
  );

  if (!timeline)
    return res
      .status(404)
      .send("The timeline with the given ID was not found.");

  res.send(timeline);
});

router.put("/comment/:id", async (req, res) => {
  const { error } = validateComment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const timeline = await Timeline.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        comments: {
          userId: req.body.authorId,
          content: req.body.content
        }
      }
    },
    { new: true }
  );

  if (!timeline)
    return res
      .status(404)
      .send("The timeline with the given ID was not found.");

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

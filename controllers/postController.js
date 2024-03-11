const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");

exports.allPosts = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find()
    .populate("author")
    .populate("comments")
    .exec();
  res.json(allPosts);
});

exports.singlePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId)
    .populate("author")
    .populate("comments")
    .exec();
  if (!post) {
    res.status(404).json({ msg: `No post with id ${req.params.postId}` });
  } else {
    res.json(post);
  }
});

exports.createPost = [
  body("title", "Title must not be empty").trim().isLength({ min: 3 }).escape(),
  body("text", "Text must not be empty").trim().isLength({ min: 3 }).escape(),
  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean value"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array(), data: req.body });
    }
    const post = new Post({
      title: req.body.title,
      text: req.body.text,
      author: req.user._id,
      published: req.body.published === undefined ? false : req.body.published,
    });
    const result = await post.save();
    res.status(201).json(result);
  }),
];

// TODO: see if user is admin
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.postId);
  if (!post) {
    res.status(404).json({ error: `No post with id ${req.params.postId}` });
  } else {
    const deletedComments = await Comment.deleteMany({
      postId: req.params.postId,
    });
    res.status(200).json({
      message: `Post with id ${req.params.postId} deleted successfully`,
      comments: deletedComments,
    });
  }
});

exports.updatePost = [
  body("title", "Title must not be empty and at least 3 characters long")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("text", "Text must not be empty and at least 3 characters long")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean value"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    let update = { timestamp: Date.now() };
    if (req.body.title) update.title = req.body.title;
    if (req.body.text) update.text = req.body.text;
    if (req.body.published !== null) update.published = req.body.published;
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      Post.findByIdAndUpdate(req.params.postId, update, { new: true })
        .then((result) => res.json(result))
        .catch((err) => res.json(err));
    }
  }),
];

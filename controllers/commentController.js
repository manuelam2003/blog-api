const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Comment = require("../models/comment");
const Post = require("../models/post");

exports.allComments = asyncHandler(async (req, res, next) => {
  const allComments = await Comment.find({});
  if (!allComments) {
    res.status(404).json({ msg: "No comments" });
  }
  res.json(allComments);
});

exports.singleComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId).exec();

  if (!comment) {
    res
      .status(404)
      .json({ error: `No comment with id ${req.params.commentId}` });
  } else {
    res.json(comment);
  }
});

exports.allCommentsOnPost = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("author", { username: 1 })
    .exec();
  res.json(comments);
});

exports.createComment = [
  body("text", "Text must not be empty and at least 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const comment = new Comment({
      text: req.body.text,
      author: req.user._id,
      post: req.params.postId,
    });
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      const result = await comment.save();
      await Post.findOneAndUpdate(
        { _id: req.params.postId },
        { $push: { comments: comment } }
      );
      res.status(201).json(result);
    }
  }),
];

exports.deleteSingleComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.commentId);
  if (!comment) {
    res.status(404).json({ msg: `No comment with id ${req.params.commentId}` });
  } else {
    const deletedComment = await Post.findOneAndUpdate(
      { _id: req.params.postId },
      { $pull: { comments: req.params.commentId } }
    );
    return res.status(200).json({
      message: `Deleted comment with id ${req.params.commentId} and removed from ${req.params.postId}`,
      comment: comment,
      deletedComment,
    });
  }
});

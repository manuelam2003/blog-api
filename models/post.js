const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("../models/comment");

const PostSchema = new Schema({
  title: { type: String, required: true, minLength: 3 },
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  published: { type: Boolean, default: false },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("Post", PostSchema);

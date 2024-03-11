const express = require("express");
const router = express.Router();
const passport = require("passport");

const auth_controller = require("../controllers/authController");
const user_controller = require("../controllers/userController");
const post_controller = require("../controllers/postController");
const comment_controller = require("../controllers/commentController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json("hola");
});

router.post(
  "/users",
  passport.authenticate("jwt", { session: false }),
  user_controller.create_user
);

// * AUTH METHODS

router.post("/login", auth_controller.login);

router.get("/login-get", auth_controller.login_get);

// * POSTS METHODS

router.get("/posts", post_controller.allPosts);

router.get("/posts/:postId", post_controller.singlePost);

router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  post_controller.createPost
);

router.put(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  post_controller.updatePost
);

router.delete(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  post_controller.deletePost
);

// * COMMENT METHODS

router.get("/comments", comment_controller.allComments);

router.get("/comments/:commentId", comment_controller.singleComment);

router.get("/posts/:postId/comments", comment_controller.allCommentsOnPost);

router.post(
  "/posts/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  comment_controller.createComment
);

router.delete(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  comment_controller.deleteSingleComment
);

router.put(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  comment_controller.updateSingleComment
);

module.exports = router;

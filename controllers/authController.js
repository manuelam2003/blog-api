const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/passport");

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user) res.status(401).json({ message: "Invalid email" });

  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const token = generateToken(user);
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

exports.login_get = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: "eduardo@gmail.com" });
  const token = generateToken(user);
  res.json({ token });
});

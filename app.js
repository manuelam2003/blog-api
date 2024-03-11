const express = require("express");
require("dotenv").config();
require("./helpers/passport");
const passport = require("passport");
const createError = require("http-errors");

const apiRouter = require("./routes/api");
const app = express();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// * Only for sessions
// https://stackoverflow.com/questions/46644366/what-is-passport-initialize-nodejs-express
app.use(passport.initialize());

app.use("/api", apiRouter);

app.use(function (req, res, next) {
  next(createError(404));
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).json(err.message);
});

module.exports = app;

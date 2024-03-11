const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY, // Replace with your own secret key
    },
    async (payload, done) => {
      try {
        // Find the user associated with the token
        const user = await User.findById(payload.sub);
        // If user doesn't exist, handle it
        if (!user) {
          return done(null, false);
        }
        // Otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
exports.generateToken = (user) => {
  const payload = {
    sub: user._id,
  };
  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "15m" }); // Replace with your own secret key and expiration time
};

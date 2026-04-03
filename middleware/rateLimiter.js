const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10mins
  max: 100,
  message: {
    success: false,
    message: "Too many requestes , please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter
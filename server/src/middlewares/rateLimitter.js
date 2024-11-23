const rateLimitter = require('express-rate-limit');

const limiter = rateLimitter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
    legacyHeaders: false,
    standardHeaders: true
});

module.exports = limiter;
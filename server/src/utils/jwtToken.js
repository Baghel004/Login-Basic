const jwt = require("jsonwebtoken");

function generateToken(tokenData, secretKey, ExpireTime){
    return jwt.sign(tokenData, secretKey, {expiresIn: ExpireTime});
}

module.exports = generateToken;
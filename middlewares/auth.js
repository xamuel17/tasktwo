const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function generateAccessToken(username) {
    return jwt.sign({ data: username }, JWT_SECRET, {
        expiresIn: "1h",
    });
}






async function verifyToken(authToken) {

    const token = authToken && authToken.split(' ')[1]
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            ignoreExpiration: false
        });
        console.log(decoded.data);
        username = decoded.data;
        const user = await User.findOne({ username });
        return user.id;

    } catch (error) {
        return null;
    }

}


function convertAccessToken(token) {
    // //  return jwt.decode(token, { header: true });

    // // get the decoded payload ignoring signature, no secretOrPrivateKey needed
    // var decoded = jwt.decode(token);

    // // get the decoded payload and header
    // var decoded = jwt.decode(token, { complete: true });
    // console.log(decoded);
    // //  console.log(decoded.payload)


    return
    const decoded = jwt.verify(token, JWT_SECRET);
}
module.exports = {
    authenticateToken,
    generateAccessToken,
    convertAccessToken,
    verifyToken,
};
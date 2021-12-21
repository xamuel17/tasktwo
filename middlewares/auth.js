const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");
const moment = require('moment');
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

async function generateAccessToken(user) {


    const payload = {
        id: user.id,
        email: user.email,
        username: user.username
    }
    const jwtId = uuidv4();

    //specify a secret key for jwt generation
    const token = jwt.sign(payload, JWT_SECRET, {
        //expires after 1 hour
        expiresIn: "1h",

        //jwt id
        jwtid: jwtId,

        //subject
        subject: user.id.toString() //The subject should be the userId or primary key
    })


    return token;
}





async function generateRefreshAccessToken(user) {


    const payload = {
        id: user.id,
        email: user.email,
        username: user.username
    }
    const jwtId = uuidv4();

    //specify a secret key for jwt generation
    const token = jwt.sign(payload, JWT_SECRET, {
        //expires after 1 hour
        expiresIn: "10h",

        //jwt id
        jwtid: jwtId,

        //subject
        subject: user.id.toString() //The subject should be the userId or primary key
    })

    const data = {
        token: token,
        jwtId: jwtId

    }
    return data;
}




















async function verifyToken(authToken) {

    const token = authToken && authToken.split(' ')[1]
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            ignoreExpiration: false
        });
        username = decoded.username;
        const user = await User.findOne({ username });
        return user.id;

    } catch (error) {
        return null;
    }

}



async function generateRefreshTokenForUserAndToken(userId, jwtId) {
    //create  a new record of refresh token
    const token = new Token();
    token.user_id = userId;
    token.jwtId = jwtId;
    token.expire_at = moment().add(10, "d").toDate();

    //store refresh token
    // await Token.save(token);
    // return token.id;

    const new_token = new Token({
        user_id: userId,
        jwtId: jwtId,
        expire_at: moment().add(10, "d").toDate()
    });

    await new_token.save();

    return new_token.jwtId;
}




function getJwtId(token) {
    const decodedToken = jwt.decode(token);
    return decodedToken["jti"];
}






async function isRefreshTokenLinkedToken(refreshToken, jwtId) {


    if (!refreshToken) {
        return false;
    }


    if (refreshToken.jwtId !== jwtId) {
        return false;
    } else {
        return true;
    }
}


async function isRefreshTokenExpired(Token) {

    if (moment().isAfter(Token.expiryDate)) {
        return true;
    } else {
        return false;
    }

}


async function isRefreshTokenUsedInvalidated(Token) {

    return Token.used || Token.invalidated;

}


async function getJwtPayloadValueByKey(token, key) {
    const decodedToken = jwt.decode(token);
    return decodedToken[key];
}



function isTokenValid(token) {
    try {
        jwt.verify(token, JWT_SECRET, {
            ignoreExpiration: false
        });



        return true;

    } catch (error) {
        return false;
    }

}




async function refreshToken(body, callback) {

    const token = body.token;
    const myRefreshToken = body.refreshToken;
    try {

        // check if the jwt token is valid
        if (!this.isTokenValid(token)) {
            throw new Error("JWT is not valid");
        }

        //check if the refresh token exists and is linked to that jwt token
        const jwtId = this.getJwtId(token);
        const userId = this.getJwtPayloadValueByKey(token, "id");
        const user = await User.findOne({ id: userId });

        //check if the user exists

        if (!user) {
            throw new Error("User doesn't exist");
        }
        // fetch refresh token from db
        const refreshToken = await Token.findOne({
            jwtId: myRefreshToken
        });


        if (!await this.isRefreshTokenLinkedToken(refreshToken, jwtId)) {
            throw new Error("Token doesn't match with refresh token");
        }

        //if the jwt token has already expired
        if (await this.isRefreshTokenExpired(refreshToken)) {
            throw new Error("Refreh Token has Expired");
        }

        //check if the refresh token was used
        if (await this.isRefreshTokenUsedInvalidated(refreshToken)) {
            throw new Error("Refresh token has been used or invalidated");

        }

        //generate a fresh pair of token and refresh token
        const tokenResults = await this.generateRefreshAccessToken(user);

        //check ig the refresh token is validated
        refreshToken.used = true;
        const tok = new Token(refreshToken);
        await tok.save(function(err, response) {
            if (err) {
                return callback({
                    message: error.message,
                });
            } else {


                const data = {
                    token: tokenResults.token,
                    refreshToken: tokenResults.jwtId,
                    user: user,

                }
                console.log(data);
                return callback(null, data);
            }
        });

    } catch (error) {
        return callback({
            message: error.message,
        });
    }
}


module.exports = {
    authenticateToken,
    generateAccessToken,
    verifyToken,
    generateRefreshTokenForUserAndToken,
    getJwtId,
    getJwtPayloadValueByKey,
    isRefreshTokenUsedInvalidated,
    isRefreshTokenExpired,
    refreshToken,
    isRefreshTokenLinkedToken,
    isTokenValid,
    generateRefreshAccessToken

};
const mongoose = require("mongoose");
const config = require("../config/auth.config");
const { v4: uuidv4 } = require('uuid');

const RefreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    expiryDate: Date,
});

RefreshTokenSchema.statics.createToken = async function(user) {
    let expired_at = new Date();

    expiredAt.setSeconds(
        expired_at.getSeconds() + config.jwtRefreshExpiration
    );

    let _token = uuidv4();

    let _object = new this({
        token: _token,
        user: user._id,
        expiryDate: expired_at.getTime(),
    });

    console.log(_object);

    let refreshToken = await _object.save();

    return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
}

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

module.exports = RefreshToken;
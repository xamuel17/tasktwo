const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const Users = require("./user.model")
const TokenSchema = new Schema({

    id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    jwtId: {
        type: String,
        required: true,
    },
    used: {
        type: Boolean,

    },
    invalidated: {
        type: Boolean,

    },

    user_id: {
        type: String,

        references: {
            // This is a reference to another model
            model: Users,

            // This is the column name of the referenced model
            key: 'user_id'
        }
    },

    expire_at: {
        type: Date,

    },

    create_at: {
        type: Date,
        default: Date.now(),
    },
    update_at: {
        type: Date,
        required: false,

    },
});

/**
 *  Here we are creating and setting an id property and 
    removing _id, __v, and the password hash which we do not need 
    to send back to the client.
 */
TokenSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;

    },
});


const Token = mongoose.model("token", TokenSchema);
module.exports = Token;
const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const Users = require("./user.model")
const TodoSchema = new Schema({

    id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    task: {
        type: String,
        required: true,
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

    description: {
        type: String,
        required: true,
        unique: true,
    },

    create_at: {
        type: Date,
        default: Date.now(),
    },
});

/**
 *  Here we are creating and setting an id property and 
    removing _id, __v, and the password hash which we do not need 
    to send back to the client.
 */
TodoSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;

    },
});


const Todo = mongoose.model("todo", TodoSchema);
module.exports = Todo;
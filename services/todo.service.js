const Todo = require("../models/todo.model");
const User = require("../models/user.model");
const auth = require("../middlewares/auth")

async function allTodos(headers, callback) {
    const token = headers['authorization'];
    const id = await auth.verifyToken(token);
    const todos = await Todo.find({ user_id: id });

    if (todos != null) {

        return callback(null, todos);

    } else {

        return callback({
            message: "No todo found!",
        });
    }
}

async function saveTodo(headers, params, callback) {

    if (params.task === undefined || params.description === undefined) {
        console.log(params.username);
        return callback({
            message: "Task & Description Is Required",
        });
    }

    const token = headers['authorization'];
    const userId = await auth.verifyToken(token);
    params.user_id = userId;
    const todo = new Todo(params);
    todo
        .save()
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function updateTodo(headers, params, callback) {
    const token = headers['authorization'];
    const userId = await auth.verifyToken(token);
    params.user_id = userId;



    if (params.task === undefined || params.description === undefined) {
        console.log(params.username);
        return callback({
            message: "Task & Description Is Required",
        });
    }

    const filter = {
        _id: params.id,
        user_id: params.user_id
    };

    const update = { task: params.task, description: params.description };

    // `doc` is the document _before_ `update` was applied
    await Todo.findOneAndUpdate(filter, update);
    const todo = await Todo.findOne(filter);
    if (todo != null) {

        return callback(null, todo);

    } else {

        return callback({
            message: "No todo found!",
        });
    }

}

async function deleteTodo(headers, id, callback) {

    const todo = await Todo.findById(id);
    const token = headers['authorization'];
    const userId = await auth.verifyToken(token);
    await Todo.deleteOne(todo).then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });

}

module.exports = {
    allTodos,
    saveTodo,
    deleteTodo,
    updateTodo

};
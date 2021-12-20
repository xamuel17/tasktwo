const bcrypt = require("bcryptjs");
const todoService = require("../services/todo.service");

/**
 * 1. To secure the password, we are using the bcryptjs, It stores the hashed password in the database.
 * 2. In the SignIn API, we are checking whether the assigned and retrieved passwords are the same or not using the bcrypt.compare() method.
 * 3. In the SignIn API, we set the JWT token expiration time. Token will be expired within the defined duration.
 */
exports.getallTodos = (req, res, next) => {


    todoService.allTodos(req.headers, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "success",
            data: results,
        });
    });
};




exports.saveTodo = (req, res, next) => {

    todoService.saveTodo(req.headers, req.body, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "success",
            data: results,
        });
    });
};


exports.deleteTodo = (req, res, next) => {
    const todoId = req.params['id'];
    todoService.deleteTodo(req.headers, todoId, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "success",
            data: results,
        });
    });
};
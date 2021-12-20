const todoController = require("../controllers/todo.controller");

const express = require("express");
const router = express.Router();

router.get("/todos", todoController.getallTodos);
router.post("/todo", todoController.saveTodo);
router.delete("/todo/:id", todoController.deleteTodo);
module.exports = router;
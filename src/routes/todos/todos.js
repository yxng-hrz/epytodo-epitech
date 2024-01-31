const express = require("express");
const todo = require('./todos.query.js');
const router = express.Router();

router.get("/", (req , res) => {
    todo.getTodos(res);
});

router.get("/:id", (req , res) => {
    todo.getTodoWithId(res, req.params.id);
});

router.post("/", (req , res) => {
    let title = req.body.title;
    let description = req.body.description;
    let due_time = req.body.due_time;
    let user_id = req.body.user_id;
    let status = req.body.status;

    if (!title || !description || !due_time || !user_id || !status)
        return res.status(401).send({ msg: 'Invalid Credentials' });
    todo.createTodo(res, title, description, due_time, user_id, status);
});

router.put("/:id", (req , res) => {
    let title = req.body.title;
    let description = req.body.description;
    let due_time = req.body.due_time;
    let user_id = req.body.user_id;
    let status = req.body.status;

    if (!title || !description || !due_time || !user_id || !status)
        return res.status(401).send({ msg: 'Invalid Credentials' });
    todo.changeTodoWithId(res, req.params.id, title, description, due_time, user_id, status);
});

router.delete("/:id", (req , res) => {
    todo.rmTodoWithId(res, req.params.id);
});

module.exports = router;

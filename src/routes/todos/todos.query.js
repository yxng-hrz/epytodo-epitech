const connection = require('../../config/db');
const todo = require('express').Router();

todo.getTodos = (res) => {
    connection.query('SELECT CAST(`id` AS VARCHAR(10)) AS `id`, `title`, `description`, DATE_FORMAT(`created_at`, "%Y-%m-%d %H:%i:%S") AS `created_at`, DATE_FORMAT(`due_time`, "%Y-%m-%d %H:%i:%S") AS `due_time`, CAST(`user_id` AS VARCHAR(10)) AS `user_id`, `status` FROM `todo`', (error, results, fields) => {
        if (error)
            return res.status(500).json({ msg: 'Internal server error' });
        res.status(200).json(results || []);
    });
};

todo.getTodoWithId = (res, todo_id) => {
    connection.query('SELECT CAST(`id` AS INT) AS `id`, `title`, `description`, DATE_FORMAT(`created_at`, "%Y-%m-%d %H:%i:%S") AS `created_at`, DATE_FORMAT(`due_time`, "%Y-%m-%d %H:%i:%S") AS `due_time`, CAST(`user_id` AS INTEGER) AS `user_id`, `status` FROM `todo` WHERE `id` = ?', [todo_id], (error, results, fields) => {
        if (error)
            return res.status(500).json({ msg: 'Internal server error' });
        if (results.length < 1) {
            return res.status(404).json({ msg: 'Not found' });
        }
        res.status(200).json(results[0]);
    });
};

todo.createTodo = (res, title, desc, due_time, user_id, status) => {
    connection.query('INSERT INTO `todo` (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)', [title, desc, due_time, status, user_id], (error, results, fields) => {
        if (error)
            return res.status(500).json({ msg: 'Internal server error' });
        connection.query('SELECT `title`, `description`, DATE_FORMAT(`due_time`, "%Y-%m-%d %H:%i:%S") AS `due_time`, CAST(`user_id` AS VARCHAR(10)) AS `user_id`, `status` FROM `todo` WHERE `id` = ?', [results.insertId], (err, results, f) => {
            if (err)
                return res.status(500).json({ msg: 'Internal server error' });
            res.status(201).json(results[0]);
        });
    });
};

todo.changeTodoWithId = (res, todo_id, title, description, due_time, user_id, status) => {
    connection.query('UPDATE `todo` SET title = ?, description = ?, due_time = ?, status = ?, user_id = ? WHERE id = ?', [title, description, due_time, status, user_id, todo_id], (error, results, fields) => {
        if (error)
            return res.status(500).json({ msg: 'Intenal server error' });
        connection.query('SELECT title, description, DATE_FORMAT(`due_time`, "%Y-%m-%d %H:%i:%S") AS `due_time`, CAST(`user_id` AS VARCHAR(10)) AS `user_id`, status FROM `todo` WHERE `id` = ?', [todo_id], (err, re, f) => {
            if (err)
                return res.status(500).json({ msg: 'Internal server error' });
            if (re.length < 1) {
                return res.status(404).json({ msg: 'Not found' });
            }
            res.status(200).json(re[0]);
        });
    });
};

todo.rmTodoWithId = (res, todo_id) => {
    connection.query('DELETE FROM `todo` WHERE id = ?', [todo_id], (error, results, fields) => {
        if (error)
            return res.status(500).json({ msg: 'Internal server error' });
        res.status(200).json({ msg: `Successfully deleted record number: ${todo_id}` });
    });
};


module.exports = todo;

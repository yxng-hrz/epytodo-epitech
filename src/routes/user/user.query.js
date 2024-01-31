const connection = require('../../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('express').Router();

const signToken = (email, firstname, password) => {
    const playload = {email, firstname, password};
    const secretKey = 'secret_key';
    return jwt.sign(
        playload,
        secretKey,
        { expiresIn: '24h' }
    );
};

user.registration = (res, email, name, firstname, password) => {
    const hash = bcrypt.hashSync(password, 10);
    connection.query('INSERT INTO `user` (email, password, name, firstname) VALUES (?, ?, ?, ?)', [email, hash, name, firstname], (error, results, fields) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ msg: 'Account already exists' });
            }
            return res.status(500).json({ msg: 'Internal server error' });
        }
        const token = signToken(email, firstname, password);
        res.status(201).json({ token });
    });
};

user.login = (res, email, password) => {
    connection.query('SELECT * FROM `user` WHERE `email` = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: 'Internal server error' });
        }
        if (results.length !== 1) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
        bcrypt.compare(password, results[0].password, (err, valid) => {
            if (err) {
                return res.status(500).json({ msg: 'Internal server error' });
            }
            if (!valid) {
                return res.status(401).json({ msg: 'Invalid Credentials'});
            }
            const token = signToken(results[0].id);
            res.status(200).json({ token });
        });
    });
};

user.getUsers = (res) => {
    connection.query('SELECT CAST(`id` AS VARCHAR(10)) AS `id`, `email`, `password`, DATE_FORMAT(`created_at`, "%Y-%m-%d %H:%i:%S") AS `created_at`, `firstname`, `name` FROM `user`', (error, results, fields) => {
        if (error)
            return res.status(500).json({ msg: 'Internal server error' });
        res.status(200).json(results || []);
    });
};

user.getTodosWithUser = (res, user_id) => {
    connection.query('SELECT CAST(`id` AS VARCHAR(10)) AS `id`, `title`, `description`, DATE_FORMAT(`created_at`, "%Y-%m-%d %H:%i:%S") AS `created_at`, DATE_FORMAT(`due_time`, "%Y-%m-%d %H:%i:%S") AS `due_time`, CAST(`user_id` AS VARCHAR(10)) AS `user_id`, `status` FROM `todo` INNER JOIN user WHERE todo.user_id = ?', [user_id], (error, results, fields) => {
        if (error)
            return res.status(500).json({ msg: 'Internal server error' });
        res.status(200).json(results || []);
    });
};

user.getUserWithid = (res, user_id) => {
    connection.query('SELECT CAST(`id` AS VARCHAR(10)) AS `id`, `email`, `password`, DATE_FORMAT(`created_at`, "%Y-%m-%d %H:%i:%S") AS `created_at`, `firstname`, `name` FROM `user` WHERE `id` = ?', [user_id], (error, results, fields) => {
        if (error)
            return res.status(500).json({ msg: 'Internal server error' });
        if (results.length < 1) {
            return res.status(404).json({ msg: 'Not found' });
        }
        res.status(200).json(results[0]);
    });
};

user.getUserWithMail = (res, email) => {
    connection.query('SELECT CAST(`id` AS VARCHAR(10)) AS `id`, `email`, `password`, DATE_FORMAT(`created_at`, "%Y-%m-%d %H:%i:%S") AS `created_at`, `firstname`, `name` FROM `user` WHERE `email` = ?', [email], (error, results, fields) => {
        if (error)
            return res.status(500).json({ msg: 'Internal server error' });
        if (results.length < 1) {
            return res.status(404).json({ msg: 'Not found' });
        }
        res.status(200).json(results[0]);
    });
};

user.changeUserWithid = (res, user_id, email, password, firstname, name) => {
    const hash = bcrypt.hashSync(password, 10);
    connection.query('UPDATE user SET email = ?, password = ?, firstname = ?, name = ? WHERE id = ?', [email, hash, firstname, name, user_id], (error, results, fields) => {
        if (error)
            return res.status(500).json({ msg: 'Internal server error' });
        connection.query('SELECT CAST(`id` AS VARCHAR(10)) AS `id`, `email`, `password`, DATE_FORMAT(`created_at`, "%Y-%m-%d %H:%i:%S") AS `created_at`, `firstname`, `name` FROM `user` WHERE `id` = ?', [user_id], (error, results, fields) => {
            if (error)
                return res.status(500).json({ msg: 'Internal server error' });
            if (results.length < 1) {
                return res.status(404).json({ msg: 'Not found' });
            }
            res.status(200).json(results[0]);
        });
    });
};

user.rmUserWithid = (res, user_id) => {
    connection.query('DELETE FROM `user` WHERE `id` = ?', [user_id], (error, results, fields) => {
        if (error)
            return res.status(500).json({ msg: 'Internal server error' });
        res.status(200).json({ msg: `Successfully deleted record number: ${user_id}` });
    });
};

module.exports = user;

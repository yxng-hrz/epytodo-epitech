const express = require("express");
const user = require('./user.query.js');
const routerUser = express.Router();
const routerUsers = express.Router();

routerUser.get("/", (req , res) => {
    user.getUsers(res);
});

routerUser.get("/todos", (req , res) => {
    user.getTodosWithUser(res, req.userID.id);
});

routerUsers.get("/:idOrEmail", (req , res) => {
    if (isNaN(req.params.idOrEmail))
        user.getUserWithMail(res, req.params.idOrEmail);
    else
        user.getUserWithid(res, req.params.idOrEmail);
});

routerUsers.put("/:id", (req , res) => {
    let email = req.body.email;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let name = req.body.name;

    if (!email || !password || !firstname || !name)
        return res.status(401).send({ msg: 'Invalid Credentials' });
    user.changeUserWithid(res, req.params.id, email, password, firstname, name);
});

routerUsers.delete("/:id", (req , res) => {
    user.rmUserWithid(res, req.params.id);
});

module.exports = { routerUser, routerUsers };

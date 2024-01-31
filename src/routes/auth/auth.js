const express = require("express");
const user = require('../user/user.query.js');
const router = express.Router();

router.post("/register", (req , res) => {
    let email = req.body.email;
    let name = req.body.name;
    let firstname = req.body.firstname;
    let password = req.body.password;

    if (!email || !name || !firstname || !password)
        return res.status(400).send({ msg : 'Bad parameter' });
    user.registration(res, email, name, firstname, password);
});

router.post("/login", (req , res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password)
        return res.status(400).send({ msg: 'Invalid Credentials' });
    user.login(res, email, password);
});

module.exports = router;

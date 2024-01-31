const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
dotenv.config();

// const auth = require('./middleware/auth');

const authRoutes = require('./routes/auth/auth');
const { routerUser, routerUsers } = require('./routes/user/user');
const todosRoutes = require('./routes/todos/todos');
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.get("/" , (req , res) => {
    res.status(200).send(`Hello World ! ${PORT}`);
});

app.use('/', authRoutes);
app.use('/user', /*auth,*/ routerUser);
app.use('/users', /*auth,*/ routerUsers);
app.use('/todos', /*auth,*/ todosRoutes);

app.listen (PORT, () => {
    console.log (`App listening at http://localhost:${PORT}`);
});

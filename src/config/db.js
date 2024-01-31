let mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'local',
    database: 'epytodo'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database!');
        throw err;
    }
    console.log('Successfully connected to the database!');
});

module.exports = connection;

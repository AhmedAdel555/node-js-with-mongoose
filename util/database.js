const mysql = require('mysql2')

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'node-project',
    password:'Ahmed3ff72',
});

module.exports = pool.promise();
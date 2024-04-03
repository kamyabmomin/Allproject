
var mysql = require('mysql2');
exports.con =  mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "job_app_29"
}).promise()
const mysql = require('mysql')

const pool = mysql.createPool({
    "user" : "root",
    "password" : "root",
    "database" : "rifa",
    "host" : "localhost", 
    "port" : 3306
});

exports.pool = pool

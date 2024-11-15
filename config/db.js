require('dotenv').config();
const mysql = require('mysql2');
const { CONFIG } = require('./config');

// Create a connection pool
module.exports.pool = mysql.createPool({
    host: CONFIG.db_host,
    user: CONFIG.db_user,
    password: CONFIG.db_password, 
    database: CONFIG.db_name,
    port: CONFIG.db_port,
});



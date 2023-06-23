// import the 'dotenv' module and load environment variables from the '.env' file
require('dotenv').config();

// import the 'mysql' module
const mysql = require('mysql');

// created pool to avoid connection loss errors
// creates a MySQL connection pool with the specified configuration to my database
const config = mysql.createPool({
    host: "atp.fhstp.ac.at",
    port: 8007,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "cc221043",
});

// get a connection from the connection pool and release it
config.getConnection(function(err, connection) {
    if (err) throw err;
    connection.release();
});

// export the 'config' object
module.exports = { config };

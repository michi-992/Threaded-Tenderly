require('dotenv').config();
const mysql = require('mysql');

const config = mysql.createConnection({
    host: "atp.fhstp.ac.at",
    port: 8007,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'cc221043'
});

config.connect(function (err) {
    if (err) {
        console.log("MySQL Connection Error:", err);
        handleConnectionError(err); // Call the error handler function
    } else {
        console.log("Connected to database.");
    }
});

config.on('error', function (err) {
    console.log("MySQL Connection Error:", err);
});

module.exports = { config };

require('dotenv').config();
const mysql = require('mysql');

const config = mysql.createConnection({
    host: "atp.fhstp.ac.at",
    port: 8007,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'cc221043'
});

config.connect(function(err) {
    if (err) {
        console.log('nope');
    };
    console.log("Connected to database.");
});

module.exports = {config};
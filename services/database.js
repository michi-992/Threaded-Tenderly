require('dotenv').config();
const mysql = require('mysql');

const config = mysql.createPool({
    host: "atp.fhstp.ac.at",
    port: 8007,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "cc221043",
});

config.getConnection(function(err, connection) {
    if (err) throw err;     // throw is similar to console.log
    connection.release()
});


// config.connect(function (err) {
//     if (err) {
//         console.log("MySQL Connection Error:", err);
//     } else {
//         console.log("Connected to database.");
//     }
// });

// config.on('error', function (err) {
//     console.log("MySQL Connection Error:", err);
// });

module.exports = { config };

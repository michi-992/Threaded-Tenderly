const db = require('../services/database.js').config;
const bcrypt = require('bcrypt');

let getUsers = () => new Promise((resolve, reject) => {
    db.query("SELECT * FROM ccl2_users", function (err, users, fields) {
        if (err) {
            reject(err)
        } else {
            resolve(users)
        }
    })
})


let createUser = (userData) => new Promise(async (resolve, reject) => {
    userData.password = await bcrypt.hash(userData.password, 10);
    const sql = "INSERT INTO ccl2_users SET " +
        "name = " + db.escape(userData.name) +
        ", surname = " + db.escape(userData.surname) +
        ", username = " + db.escape(userData.username) +
        ", email = " + db.escape(userData.email) +
        ", craft = " + db.escape(userData.craft) +
        ", incentive = " + db.escape(userData.incentive) +
        ", password = " + db.escape(userData.password);


    db.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            reject(err);
        }
        const userId = result.insertId;
        userData.id = userId;
        resolve(userData);
    })
})

module.exports = {
    getUsers,
    createUser,
}
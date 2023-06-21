const db = require('../services/database.js').config;
const bcrypt = require('bcrypt');
const fs = require("fs");

let getUsers = () => new Promise((resolve, reject) => {
    db.query("SELECT * FROM ccl2_users", function (err, users, fields) {
        if (err) {
            reject(err)
        } else {
            resolve(users)
        }
    })
})

let getUserByID = (userID) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM ccl2_users WHERE id=?', [userID], function (err, users, fields) {
        if (err) {
            reject(err)
        }
        resolve(users[0]);
    })
});


let createUser = (userData) => new Promise(async (resolve, reject) => {
    try {
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
                console.log(error)
                reject(err);
            }
            const userId = result.insertId;
            userData.id = userId;
            resolve(userData);
        })
    } catch (error) {
        console.log(error)
    }
})

let updateUser = (userData, id) => new Promise(async (resolve, reject) => {
    let sql = "UPDATE ccl2_users SET " +
        "name = " + db.escape(userData.name) +
        ", surname = " + db.escape(userData.surname) +
        ", username = " + db.escape(userData.username) +
        ", email = " + db.escape(userData.email) +
        ", craft = " + db.escape(userData.craft) +
        ", incentive = " + db.escape(userData.incentive);

    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
        sql += ", password = " + db.escape(userData.password);
    }

    sql += "WHERE id = " + id;

    db.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            reject(err);
        }
        resolve(userData);
    })
})

let deleteUser = (id) => new Promise((resolve, reject) => {
    db.query('SELECT picture FROM ccl2_products WHERE userID=?', [id], function(err, pictures) {
        if (err) {
            reject(err)
        }
        pictures.forEach(pictureRow => {
            const pictureUUID = pictureRow.picture;
            const filepath = `./public/uploads/${pictureUUID}.jpg`;
            fs.unlinkSync(filepath);
        })
        resolve(id);
    })

    db.query('DELETE FROM ccl2_users WHERE id=?', [id], function (err, result) {
        if (err) {
            reject(err)
        }
        resolve(id);
    })
});

module.exports = {
    getUsers,
    getUserByID,
    createUser,
    updateUser,
    deleteUser
}
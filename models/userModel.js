// all modules needed, required here
const db = require('../services/database.js').config;
const bcrypt = require('bcrypt');
const fs = require("fs");

//used for getting all users
let getUsers = () => new Promise((resolve, reject) => {
    // selects all users from datatable
    db.query("SELECT * FROM ccl2_users", function (err, users, fields) {
        if (err) {
            reject(err)
        } else {
            resolve(users)
        }
    })
})

// used for getting one user based on id
let getUserByID = (userID) => new Promise((resolve, reject) => {
    // selecting user from database based on id
    db.query('SELECT * FROM ccl2_users WHERE id=?', [userID], function (err, users, fields) {
        if (err) {
            reject(err)
        }
        resolve(users[0]);
    })
});

// used for creating users
let createUser = (userData) => new Promise(async (resolve, reject) => {
    // first password is hashed and then an entry in the datatable is created
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
            reject(err);
        }
        const userId = result.insertId;
        userData.id = userId;
        resolve(userData);
    })
})

// used for updating a user
let updateUser = (userData, id) => new Promise(async (resolve, reject) => {
    // updates the user data based on the (new) inputs
    let sql = "UPDATE ccl2_users SET " +
        "name = " + db.escape(userData.name) +
        ", surname = " + db.escape(userData.surname) +
        ", username = " + db.escape(userData.username) +
        ", email = " + db.escape(userData.email) +
        ", craft = " + db.escape(userData.craft) +
        ", incentive = " + db.escape(userData.incentive);

    if (userData.password) {
        // if there is a new password input, it hashes it and adds it to the sql statement
        userData.password = await bcrypt.hash(userData.password, 10);
        sql += ", password = " + db.escape(userData.password);
    }

    sql += "WHERE id = " + id;

    db.query(sql, function (err, result, fields) {
        if (err) {
            reject(err);
        }
        resolve(userData);
    })
})

// used for deleting a user
let deleteUser = (id) => new Promise((resolve, reject) => {
    // selects all products associated with a user and deletes them
    db.query('SELECT picture FROM ccl2_products WHERE userID=?', [id], function (err, pictures) {
        if (err) {
            reject(err)
        }
        // gets all product pictures associated with one user and unlinks them
        pictures.forEach(pictureRow => {
            const pictureUUID = pictureRow.picture;
            const filepath = `./public/uploads/${pictureUUID}.jpg`;
            console.log(filepath);
            fs.unlinkSync(filepath);
        })
        resolve(id);
    })

    // deletes entry based on user id
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
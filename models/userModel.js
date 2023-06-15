const db = require('../services/database.js').config;

let createUser = (userData) => new Promise(async (resolve, reject) => {
    // userData.password = await bcrypt.hash(userData.password, 10);
    const sql = "INSERT INTO users2 SET " +
        "name = " + db.escape(userData.name) +
        ", surname = " + db.escape(userData.surname) +
        ", email = " + db.escape(userData.email) +
        ", craft = " + db.escape(userData.craft) +
        ", incentive = " + db.escape(userData.incentive) +
        ", info = " + db.escape(userData.info) +
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
    createUser,
}
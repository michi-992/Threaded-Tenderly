const db = require("../services/database").config;

let getBookmarkedProducts = (userID) => new Promise((resolve, reject) => {
    let sql = `
    SELECT ccl2_products.*, ccl2_users.email, COUNT(ccl2_bookmarks.product_id) AS isBookmarked
    FROM ccl2_products
    JOIN ccl2_users ON ccl2_products.userID = ccl2_users.id
    LEFT JOIN ccl2_bookmarks ON ccl2_products.id = ccl2_bookmarks.product_id AND ccl2_bookmarks.user_id = ?`;

    sql += ' WHERE ccl2_bookmarks.user_id IS NOT NULL'; // Filter products that have a bookmark entry

    sql += ' GROUP BY ccl2_products.id';

    db.query(sql, [userID], function (err, products, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(products);
        }
    });
});
let isProductBookmarked = (userId, productId) => new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) AS count FROM ccl2_bookmarks WHERE user_id = ? AND product_id = ?';
    db.query(sql, [userId, productId], function (err, results) {
        if (err) {
            reject(err);
        } else {
            resolve(results[0].count > 0);
        }
    });
});


let addBookmark = (userId, productId) => new Promise((resolve, reject) => {
    const sql = 'INSERT INTO ccl2_bookmarks (user_id, product_id) VALUES (?, ?)';
    db.query(sql, [userId, productId], function (err, results) {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

let removeBookmark = (userId, productId) => new Promise((resolve, reject) => {
    const sql = 'DELETE FROM ccl2_bookmarks WHERE user_id = ? AND product_id = ?';
    db.query(sql, [userId, productId], function (err, results) {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

module.exports = {
    getBookmarkedProducts,
    isProductBookmarked,
    addBookmark,
    removeBookmark
}
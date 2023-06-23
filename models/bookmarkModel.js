// requiring database service
const db = require("../services/database").config;

// I use promises to be able to use resolve and reject so I can communicate with the controller functions better

// used for get all bookmarked products of a user
let getBookmarkedProducts = (userID) => new Promise((resolve, reject) => {
    // sql call for getting all bookmarked products based on the requesting userID (which is passed to the function as a parameter)
    // it gets all product data, the seller's email, and the count (whether or not it is bookmarked), first joins on the user id and then on product id to get back the products
    let sql = `
    SELECT ccl2_products.*, ccl2_users.email, COUNT(ccl2_bookmarks.product_id) AS isBookmarked
    FROM ccl2_products
    JOIN ccl2_users ON ccl2_products.userID = ccl2_users.id
    LEFT JOIN ccl2_bookmarks ON ccl2_products.id = ccl2_bookmarks.product_id AND ccl2_bookmarks.user_id = ?`;

    sql += ' WHERE ccl2_bookmarks.user_id IS NOT NULL'; // filter products that have a bookmark entry

    sql += ' GROUP BY ccl2_products.id'; // groups the response based on the product id (to get back all products as entities)

    // Execute the SQL query using the 'db.query()' method, user
    db.query(sql, [userID], function (err, products, fields) {
        if (err) {
            reject(err); // If an error occurs, reject the Promise with the error
        } else {
            resolve(products); // If successful, resolve the Promise with the retrieved products
        }
    });
});

// checks if product is bookmarked
let isProductBookmarked = (userId, productId) => new Promise((resolve, reject) => {
    // counts the instances in the bookmark db table where the parameters userId and productId  match the values of user_id and product_id
    const sql = 'SELECT COUNT(*) AS count FROM ccl2_bookmarks WHERE user_id = ? AND product_id = ?';
    db.query(sql, [userId, productId], function (err, results) {
        if (err) {
            reject(err);
        } else {
            resolve(results[0].count > 0);
        }
    });
});

// used for adding a bookmark
let addBookmark = (userId, productId) => new Promise((resolve, reject) => {
    // an entry is created in the bookmark table with productId and userId as values for product_id and user_id
    const sql = 'INSERT INTO ccl2_bookmarks (user_id, product_id) VALUES (?, ?)';
    db.query(sql, [userId, productId], function (err, results) {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

// used for removing a bookmark
let removeBookmark = (userId, productId) => new Promise((resolve, reject) => {
    // an entry is deleted in the bookmark table where product_id and user_id have the values of productId and userId
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
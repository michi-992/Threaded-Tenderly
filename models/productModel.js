// requiring all modules used here
const bcrypt = require("bcrypt");
const db = require('../services/database.js').config;
const fs = require("fs");
const uuid = require("uuid");

// I use promises to be able to use resolve and reject so I can communicate with the controller functions better.

// used for getting all products
let getProducts = (article = '', userId) => new Promise((resolve, reject) => {
    // the sql statement for getting all products and the seller's email as well as if they were bookmarked by the current user
    let sql = `
    SELECT ccl2_products.*, ccl2_users.email, COUNT(ccl2_bookmarks.product_id) AS isBookmarked
    FROM ccl2_products
    JOIN ccl2_users ON ccl2_products.userID = ccl2_users.id
    LEFT JOIN ccl2_bookmarks ON ccl2_products.id = ccl2_bookmarks.product_id AND ccl2_bookmarks.user_id = ?`;

    const params = [userId];

    // dependent on if an article (the filter on marketplace) was chosen
    if (article) {
        sql += " WHERE article = ?";
        params.push(article);
    }

    sql += ' GROUP BY ccl2_products.id';

    db.query(sql, params, function (err, products, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(products);
        }
    });
});

// used for getting a product based on a product id
let getProductByProductID = (productID, userID) => new Promise((resolve, reject) => {
    let values = []; // empty array to declare datatype
    let sql;
    if (userID) {
        // if there is a current user, it not only retrieves the product information it also checks if there is an existing bookmark
        values = [userID, productID];
        sql = 'SELECT ccl2_products.*, ccl2_users.username, ccl2_users.email, COUNT(CASE WHEN ccl2_bookmarks.user_id = ? THEN 1 END) AS isBookmarked FROM ccl2_products JOIN ccl2_users ON ccl2_products.userID = ccl2_users.id LEFT JOIN ccl2_bookmarks ON ccl2_products.id = ccl2_bookmarks.product_id WHERE ccl2_products.id = ?;';
    } else {
        // if there is no user it only retrieves the product inromation
        values = [productID];
        sql = 'SELECT ccl2_products.*, ccl2_users.username, ccl2_users.email, 0 AS isBookmarked FROM ccl2_products JOIN ccl2_users ON ccl2_products.userID = ccl2_users.id WHERE ccl2_products.id = ?;';
    }

    db.query(sql, values, function (err, result, fields) {
        if (err) {
            reject(err);
        } else {
            const product = result[0]; // first product should also only be the only one
            resolve(product);
        }
    });
});

// used to get products based on a user id
let getProductsByUserID = (userID) => new Promise((resolve, reject) => {
    // selects all products from a user that is the current user
    db.query('SELECT * FROM ccl2_products WHERE userID=?', [userID], function (err, products, fields) {
        if (err) {
            reject(err)
        } else {
            resolve(products);
        }
    })
})

// used for saving pictures on server
const uploadPictureLogic = async (productPicture) => {
    try {
        // a file is passed as the parameter, then a new uuid is created, the file is renamed and moved to /public/uploads
        const picture = productPicture;
        const pictureUUID = uuid.v4();
        const pictureName = `${pictureUUID}.jpg`;
        const filepath = `./public/uploads/${pictureName}`;

        await picture.mv(filepath);
        // returns the picture uuid to be saved in the database
        return pictureUUID;
    } catch (err) {
        throw err;
    }
};

// used for creating products
let createProduct = (productData, pictureData, currentUser) => new Promise(async (resolve, reject) => {
    // a new uuid is created to be able to save it in the datsbase
    const pictureUUID = await uploadPictureLogic(pictureData);

    // the individual inputs of before and after the decimal are put together to created a decimal number to save in the database
    const digitsBeforeDec = productData.priceBeforeDec;
    const digitsAfterDec = productData.priceAfterDec;
    const decimalNumber = parseFloat(`${digitsBeforeDec}.${digitsAfterDec}`);

    // product is inserted into the corresponding table
    const sql = "INSERT INTO ccl2_products SET " +
        "productName = " + db.escape(productData.productName) +
        ", userID = " + db.escape(currentUser.id) +
        ", article = " + db.escape(productData.article) +
        ", description = " + db.escape(productData.description) +
        ", productCraft = " + db.escape(productData.craft) +
        ", season = " + db.escape(productData.season) +
        ", material = " + db.escape(productData.material) +
        ", sizing = " + db.escape(productData.sizing) +
        ", price = " + db.escape(decimalNumber) +
        ", picture = " + db.escape(pictureUUID) +
        ", color = " + db.escape(productData.color);


    db.query(sql, function (err, result, fields) {
        if (err) {
            reject(err);
        }
        resolve(result);
    })
})

// used for updating products
let updateProduct = (productData, productID, pictureData) => new Promise(async (resolve, reject) => {
    // price is converted to decimal again
    const digitsBeforeDec = productData.priceBeforeDec;
    const digitsAfterDec = productData.priceAfterDec;
    const decimalNumber = parseFloat(`${digitsBeforeDec}.${digitsAfterDec}`);

    // entry in datatable gets updated
    let sql = "UPDATE ccl2_products SET " +
        "productName = " + db.escape(productData.productName) +
        ", article = " + db.escape(productData.article) +
        ", description = " + db.escape(productData.description) +
        ", productCraft = " + db.escape(productData.craft) +
        ", season = " + db.escape(productData.season) +
        ", material = " + db.escape(productData.material) +
        ", sizing = " + db.escape(productData.sizing) +
        ", price = " + db.escape(decimalNumber) +
        ", color = " + db.escape(productData.color);

    // if the user updated the picture, it unlinks the old picture and moves the new one to the folder
    if (pictureData) {
        const product = await getProductByProductID(productID);
        const pictureName = product.picture;
        const filepath = `./public/uploads/${pictureName}.jpg`;
        fs.unlinkSync(filepath);
        const pictureUUID = await uploadPictureLogic(pictureData);
        // if there is a file upload it adds the uuid to the sql statement
        sql += ", picture = " + db.escape(pictureUUID);
    }

    sql += "WHERE id = " + productID;

    db.query(sql, function (err, result, fields) {
        if (err) {
            reject(err);
        }
        resolve(productData);
    })
})

// used for deleting products
let deleteProduct = (id) => new Promise((resolve, reject) => {
    //  retrieves the picture uuid from the product entry to be able to unlink the file from the server
    db.query('SELECT picture FROM ccl2_products WHERE id=?', [id], function (err, result) {
        if (err) {
            reject(err)
        }
        const pictureUUID = result[0].picture;
        const filepath = `./public/uploads/${pictureUUID}.jpg`;
        fs.unlinkSync(filepath);
        resolve(id);
    })

    // deletes entry from datatable
    db.query('DELETE FROM ccl2_products WHERE id=?', [id], function (err, result) {
        if (err) {
            reject(err)
        }
        resolve(id);
    })
});


module.exports = {
    getProducts,
    getProductByProductID,
    getProductsByUserID,
    createProduct,
    updateProduct,
    deleteProduct
}
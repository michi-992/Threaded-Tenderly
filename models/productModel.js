const bcrypt = require("bcrypt");
const db = require('../services/database.js').config;
const fs = require("fs");
const uuid = require("uuid");

let getProducts = (article = '') => new Promise((resolve, reject) => {
    const sql = `
    SELECT ccl2_products.*, ccl2_users.email
    FROM ccl2_products
    JOIN ccl2_users ON ccl2_products.userID = ccl2_users.id`;
    // let query = "SELECT * FROM ccl2_products";
    // let values = [];
    //
    // if (article) {
    //     query += " WHERE article = ?";
    //     values = [article];
    // }
    //
    // db.query(query, values, function (err, products, fields) {
    //     if (err) {
    //         reject(err);
    //     } else {
    //         resolve(products);
    //     }
    // });
    db.query(sql, function (err, products, fields) {
        if (err) {
            reject(err)
        } else {
            resolve(products);
        }
    })
})

let getProductByProductID = (productID) => new Promise((resolve, reject) => {
    const sql = `
    SELECT ccl2_products.*, ccl2_users.username, ccl2_users.email
    FROM ccl2_products
    JOIN ccl2_users ON ccl2_products.userID = ccl2_users.id
    WHERE ccl2_products.id = ?;
  `;
    db.query(sql, [productID], function (err, result, fields) {
        if (err) {
            reject(err);
        } else {
            const product = result[0];
            resolve(product);
        }
    });
});

let getProductsByUserID = (userID) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM ccl2_products WHERE userID=?', [userID], function (err, products, fields) {
        if (err) {
            reject(err)
        } else {
            resolve(products);
        }
    })
})


const uploadPictureLogic = async (productPicture) => {
    try {
        const picture = productPicture;
        const pictureUUID = uuid.v4();
        const pictureName = `${pictureUUID}.jpg`;
        const filepath = `./public/uploads/${pictureName}`;

        await picture.mv(filepath);
        return pictureUUID;

    } catch (err) {
        throw err;
    }
};


let createProduct = (productData, pictureData, currentUser) => new Promise(async (resolve, reject) => {

    const pictureUUID = await uploadPictureLogic(pictureData);

    const digitsBeforeDec = productData.priceBeforeDec;
    const digitsAfterDec = productData.priceAfterDec;

    const decimalNumber = parseFloat(`${digitsBeforeDec}.${digitsAfterDec}`);

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
            console.log(err);
            reject(err);
        }
        resolve(result);
    })
})

let updateProduct = (productData, productID, pictureData) => new Promise(async (resolve, reject) => {

    const digitsBeforeDec = productData.priceBeforeDec;
    const digitsAfterDec = productData.priceAfterDec;
    const decimalNumber = parseFloat(`${digitsBeforeDec}.${digitsAfterDec}`);

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


    if (pictureData) {
        const product = await getProductByProductID(productID);
        const pictureName = product.picture;
        const filepath = `./public/uploads/${pictureName}.jpg`;
        fs.unlinkSync(filepath);
        const pictureUUID = await uploadPictureLogic(pictureData);
        sql += ", picture = " + db.escape(pictureUUID);
    }

    sql += "WHERE id = " + productID;

    db.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            reject(err);
        }
        resolve(productData);
    })
})

let deleteProduct = (id) => new Promise((resolve, reject) => {
    db.query('SELECT picture FROM ccl2_products WHERE id=?', [id], function (err, result) {
        if (err) {
            reject(err)
        }

        const pictureUUID = result[0].picture;
        const filepath = `./public/uploads/${pictureUUID}.jpg`;
        fs.unlinkSync(filepath);
        resolve(id);
    })

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
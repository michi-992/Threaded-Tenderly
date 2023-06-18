const bcrypt = require("bcrypt");
const db = require('../services/database.js').config;
const fs = require("fs");
const uuid = require("uuid");

let getProducts = () => new Promise((resolve, reject) => {
    db.query("SELECT * FROM ccl2_products", function (err, products, fields) {
        if (err) {
            reject(err)
        } else {
            resolve(products);
        }
    })
})

let getProductByProductID = (productID) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM ccl2_products WHERE id=?', [productID], function (err, product, fields) {
        if (err) {
            reject(err)
        } else {
            resolve(product[0]);
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


module.exports = {
    getProducts,
    getProductByProductID,
    createProduct,
}
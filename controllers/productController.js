const productModel = require('../models/productModel');
const fs = require("fs");
const userModel = require("../models/userModel");


// I use currentUser in my functions to talk about the logged in user
// it is handled that no product specific routes can be accessed from other users, even if they are logged in the authentication middleware (meaning the req.params.userId and req.currentUser.id are the same)
async function getProducts(req, res, next) {
    try {
        const currentUser = req.currentUser; // currentUser needed to be passed for (at least) the header in the view
        const currentUserID = req.currentUser ? currentUser.id : '';
        const article = '';
        const products = await productModel.getProducts(article, currentUserID);

        res.render('marketplace', {products, currentUser, article });
    } catch (err) {
        next(err);
    }
}

async function filterProducts(req, res, next) {
    try {
        const currentUser = req.currentUser; // currentUser needed to be passed for (at least) the header in the view
        const article = req.query.article; // Get the article from the query parameter
        const currentUserID = currentUser ? currentUser.id : '';
        const filteredProducts = await productModel.getProducts(article, currentUserID); // Pass the article to the model function
        res.render('marketplace', { products: filteredProducts, currentUser, article });
    } catch (err) {
        next(err);
    }
}


async function getProductByProductID(req, res, next) {
    try {
        const currentUser = req.currentUser; // currentUser needed to be passed for (at least) the header in the view
        let currentUserID = currentUser ? currentUser.id : '';

        const productID = req.params.productID
        const product = await productModel.getProductByProductID(productID, currentUserID);
        res.render('product', {product, currentUser})
    } catch (err) {
        next(err);
    }
}

async function getProductsByUserID(req, res, next) {
    try {
        const currentUser = req.currentUser;  // currentUser needed to be passed for (at least) the header in the view
        const products = await productModel.getProductsByUserID(currentUser.id);
        res.render('userProducts', {currentUser, products});
    } catch (err) {
        next(err);
    }
}

async function createProduct(req, res, next) {
    try {
        const currentUser = req.currentUser; // currentUser needed to be passed for (at least) the header in the view
        const productData = req.body;
        const pictureData = req.files.picture;
        const userID = req.params.userID;
        if(productData.craft === undefined) {
            productData.craft = '';
        }
        if(productData.season === undefined) {
            productData.season = '';
        }


        await productModel.createProduct(productData, pictureData, currentUser);
        res.redirect(`/profile/${userID}/myproducts`);
    } catch (err) {
        next(err);
    }
}

async function editProduct(req, res, next) {
    try {
        const currentUser = req.currentUser; // currentUser needed to be passed for (at least) the header in the view
        const userID = parseInt(req.params.userID);
        const productID = parseInt(req.params.productID)
        const currentUserID = parseInt(req.currentUser.id);
        const product = await productModel.getProductByProductID(productID, currentUser.id);

        const digitsBeforeDecimal = Math.floor(product.price);
        const digitsAfterDecimal = Math.floor((product.price - digitsBeforeDecimal) * 100);
        product.digitsAfterDecimal = digitsAfterDecimal;
        product.digitsBeforeDecimal = digitsBeforeDecimal;


        res.render('editProduct', {product, productID, currentUser, userID})

    } catch(err) {
        next(err);
    }
}

async function updateProduct(req, res, next) {
    try {
        const productID = parseInt(req.params.productID);
        const userID = parseInt(req.params.userID); // used once to showcase req.currentUser.id and req.params.userId are the same
        let pictureData;
        const productData = req.body;
        if(productData.craft === undefined) {
            productData.craft = '';
        }
        if(productData.season === undefined) {
            productData.season = '';
        }

        if (!req.files) {
            pictureData = null;
        } else {
            pictureData = req.files.picture
        }

        await productModel.updateProduct(productData, productID, pictureData);
        res.redirect(`/profile/${userID}/myproducts`);
    } catch (err) {
        next(err);
    }
}

async function deleteProduct(req, res, next) {
    productModel.deleteProduct(parseInt(req.params.productID))
        .then(() => { // already handled in the userProducts.ejs file, just for completion purposes
            const currentUser = req.currentUser; // currentUser needed for id for redirect
            let currentUserID = currentUser ? currentUser.id : '';
            res.redirect(`/profile/${currentUserID}/myproducts`);
        }).catch((err) => {
        next(err);
    })
}

module.exports = {
    getProducts,
    filterProducts,
    getProductByProductID,
    getProductsByUserID,
    createProduct,
    editProduct,
    updateProduct,
    deleteProduct
}
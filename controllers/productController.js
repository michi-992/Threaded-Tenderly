const productModel = require('../models/productModel');
const fs = require("fs");
const userModel = require("../models/userModel");

async function getProducts(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const products = await productModel.getProducts();
        res.render('marketplace', {products, currentUser});
    } catch (error) {
        next(err);
    }
}

async function getProductByProductID(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const productID = req.params.productID
        const product = await productModel.getProductByProductID(productID);
        res.render('product', {product, currentUser})
    } catch (error) {
        console.log(error);
        res.status(404)
        next(err);
    }
}

async function getProductsByUserID(req, res, next) {
    try {
        console.log('hello');
        const currentUser = req.currentUser;
        const products = await productModel.getProductsByUserID(currentUser.id);
        res.render('userProducts', {currentUser, products});
    } catch (err) {
        next(err);
    }
}

async function createProduct(req, res, next) {
    try {
        const productData = req.body;
        const pictureData = req.files.picture;
        const userID = req.params.userID;


        const currentUser = req.currentUser;
        await productModel.createProduct(productData, pictureData, currentUser);
        res.redirect(`/profile/${userID}/myproducts`);
    } catch (error) {
        console.log(error)
        res.status(404)
        next(err);
    }
}

async function editProduct(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const userID = parseInt(req.params.userID);
        const productID = parseInt(req.params.productID)
        const currentUserID = parseInt(req.currentUser.id);
        const product = await productModel.getProductByProductID(productID);

        const digitsBeforeDecimal = Math.floor(product.price);
        const digitsAfterDecimal = Math.floor((product.price - digitsBeforeDecimal) * 100);
        product.digitsAfterDecimal = digitsAfterDecimal;
        product.digitsBeforeDecimal = digitsBeforeDecimal;


        res.render('editProduct', {product, productID, currentUser, userID})

    } catch
        (error) {
        res.status(404)
        next(err);
    }
}

async function updateProduct(req, res, next) {
    try {
        const productID = parseInt(req.params.productID);
        const userID = parseInt(req.params.userID);
        const currentUser = req.currentUser;
        let pictureData;

        if (!req.files) {
            pictureData = null;
        } else {
            pictureData = req.files.picture
        }

        await productModel.updateProduct(req.body, productID, pictureData);
        res.redirect(`/profile/${userID}/myproducts`);
    } catch (error) {
        res.status(404)
    }
}

async function deleteProduct(req, res, next) {
    productModel.deleteProduct(parseInt(req.params.productID))
        .then(() => {
            res.redirect('/logout');
        }).catch((err) => {
        res.status(404)
        next(err);
    })
}


module.exports = {
    getProducts,
    getProductByProductID,
    getProductsByUserID,
    createProduct,
    editProduct,
    updateProduct,
    deleteProduct
}
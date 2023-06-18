const productModel = require('../models/productModel');
const fs = require("fs");

async function getProducts(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const products = await productModel.getProducts();
        console.log(products);
        res.render('marketplace', {products, currentUser});

    } catch (error) {
        console.log(error);
        res.status(404)
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

async function createProduct(req, res, next) {
    try {
        const productData = req.body;
        const pictureData = req.files.picture;
        const currentUser = req.currentUser;
        await productModel.createProduct(productData, pictureData, currentUser);
        res.redirect('/');
    } catch (error) {
        console.log(error)
        res.status(404)
        next(err);
    }
}


module.exports = {
    getProducts,
    getProductByProductID,
    createProduct,
}
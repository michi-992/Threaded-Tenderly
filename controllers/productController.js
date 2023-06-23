const productModel = require('../models/productModel');
const fs = require("fs");
const userModel = require("../models/userModel");

async function getProducts(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const currentUserID = req.currentUser ? currentUser.id : '';
        const article = '';
        const products = await productModel.getProducts(article, currentUserID);

        res.render('marketplace', {products, currentUser, article });
    } catch (error) {
        next(error);
    }
}

async function filterProducts(req, res, next) {
    try {
        const article = req.query.article; // Get the article from the query parameter
        const currentUser = req.currentUser;
        const currentUserID = req.currentUser ? currentUser.id : '';
        const filteredProducts = await productModel.getProducts(article, currentUserID); // Pass the article to the model function
        res.render('marketplace', { products: filteredProducts, currentUser, article });
    } catch (error) {
        next(error);
    }
}

async function getBookmarkedProducts(req, res, next) {
    const currentUser = req.currentUser;
    const products = await productModel.getBookmarkedProducts(currentUser.id);
    res.render('userBookmarks', {currentUser, products});
}

async function getProductByProductID(req, res, next) {
    try {
        const currentUser = req.currentUser;
        let currentUserID = '';
        if(currentUser) {
            currentUserID = currentUser.id;
        }

        const productID = req.params.productID
        const product = await productModel.getProductByProductID(productID, currentUserID);
        res.render('product', {product, currentUser})
    } catch (error) {
        res.status(404)
        next(err);
    }
}

async function getProductsByUserID(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const products = await productModel.getProductsByUserID(currentUser.id);
        res.render('userProducts', {currentUser, products});
    } catch (err) {
        console.log(err);
        next(err);
    }
}

async function createProduct(req, res, next) {
    try {
        const productData = req.body;
        const pictureData = req.files.picture;
        const userID = req.params.userID;
        if(productData.craft === undefined) {
            productData.craft = '';
        }
        if(productData.season === undefined) {
            productData.season = '';
        }

        const currentUser = req.currentUser;
        await productModel.createProduct(productData, pictureData, currentUser);
        res.redirect(`/profile/${userID}/myproducts`);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function editProduct(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const userID = parseInt(req.params.userID);
        const productID = parseInt(req.params.productID)
        const currentUserID = parseInt(req.currentUser.id);
        const product = await productModel.getProductByProductID(productID, currentUser.id);

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

async function toggleBookmark(req, res, next) {
    try {
        const productId = req.params.productId;
        const userId = req.currentUser.id;

        // Check if the product is already bookmarked by the user
        const isBookmarked = await productModel.isProductBookmarked(userId, productId);

        if (isBookmarked) {
            // If already bookmarked, remove the bookmark
            await productModel.removeBookmark(userId, productId);
        } else {
            // If not bookmarked, add the bookmark
            await productModel.addBookmark(userId, productId);
        }

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getProducts,
    filterProducts,
    getProductByProductID,
    getProductsByUserID,
    getBookmarkedProducts,
    createProduct,
    editProduct,
    updateProduct,
    deleteProduct,
    toggleBookmark
}
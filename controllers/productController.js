const productModel = require('../models/productModel');
const userModel = require("../models/userModel");

// I use async functions in my controllers to make sure the code is executed properly and have the possibility to await the models' response

// I use currentUser in my functions to talk about the logged in user
// it is handled that no product specific routes can be accessed from other users, even if they are logged in the authentication middleware (meaning the req.params.userId and req.currentUser.id are the same)

// used for getting all products
async function getProducts(req, res, next) {
    try {
        const currentUser = req.currentUser; // currentUser needed to be passed for (at least) the header in the view same as with all other functions
        const currentUserID = req.currentUser ? currentUser.id : ''; // setting the id to '' when there is no current User to be able to pass it to the view
        const article = ''; // default article - shows all products, and the ones that do not have an article assigned
        const products = await productModel.getProducts(article, currentUserID); // all products based on article and the user that is logged in (important for bookmarked products)

        res.render('marketplace', {products, currentUser, article });
    } catch (err) {
        next(err);
    }
}


// used for getting all products dependent on the filtered preference
async function filterProducts(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const article = req.query.article; // get the article from the query parameter
        const currentUserID = currentUser ? currentUser.id : '';
        const filteredProducts = await productModel.getProducts(article, currentUserID); // pass the article to the model function and the currentUserID (important for bookmarks) and get all matching products
        res.render('marketplace', { products: filteredProducts, currentUser, article }); // filtered products passed as products
    } catch (err) {
        next(err);
    }
}

// used for getting a product based on a product id
async function getProductByProductID(req, res, next) {
    try {
        const currentUser = req.currentUser;
        let currentUserID = currentUser ? currentUser.id : '';

        const productID = req.params.productID; // retrieving product id from request
        const product = await productModel.getProductByProductID(productID, currentUserID);
        res.render('product', {product, currentUser})
    } catch (err) {
        next(err);
    }
}

// used to get products based on a user id
async function getProductsByUserID(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const products = await productModel.getProductsByUserID(currentUser.id); // all products from the logged in user
        res.render('userProducts', {currentUser, products});
    } catch (err) {
        next(err);
    }
}

// used for creating products
async function createProduct(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const productData = req.body;
        const pictureData = req.files.picture;
        const userID = req.params.userID;

        // if the optional form inputs were not input by the user it makes them be an empty string to save in the database
        if(productData.craft === undefined) {
            productData.craft = '';
        }
        if(productData.season === undefined) {
            productData.season = '';
        }


        await productModel.createProduct(productData, pictureData, currentUser); // gives over the input and the user id for the data entry
        res.redirect(`/profile/${userID}/myproducts`); // redirects to show all products after product creation
    } catch (err) {
        next(err);
    }
}

// used for editing products
async function editProduct(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const userID = parseInt(req.params.userID);
        const productID = parseInt(req.params.productID);
        const product = await productModel.getProductByProductID(productID, currentUser.id); // current user for bookmarking functionality passed too

        // breaking up the price in before and after decimal points to be sble to display and change them in the form
        const digitsBeforeDecimal = Math.floor(product.price);
        const digitsAfterDecimal = Math.floor((product.price - digitsBeforeDecimal) * 100);
        product.digitsAfterDecimal = digitsAfterDecimal;
        product.digitsBeforeDecimal = digitsBeforeDecimal;


        res.render('editProduct', {product, productID, currentUser, userID})
    } catch(err) {
        next(err);
    }
}

// used for updating products
async function updateProduct(req, res, next) {
    try {
        const productID = parseInt(req.params.productID);
        const userID = parseInt(req.params.userID); // used once to showcase req.currentUser.id and req.params.userId are the same
        let pictureData;
        const productData = req.body;

        // optional form inputs were not input by the user it makes them be an empty string to save in the database
        if(productData.craft === undefined) {
            productData.craft = '';
        }
        if(productData.season === undefined) {
            productData.season = '';
        }

        // if there is a file it gives it to the pictureData variable
        if (!req.files) {
            pictureData = null;
        } else {
            pictureData = req.files.picture
        }

        await productModel.updateProduct(productData, productID, pictureData); // all data passed to update
        res.redirect(`/profile/${userID}/myproducts`); // redirect to show all user products
    } catch (err) {
        next(err);
    }
}

// used for deleting products
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
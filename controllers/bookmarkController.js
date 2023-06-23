const bookmarkModel = require('../models/bookmarkModel');

// I use async functions in my controllers to make sure the code is executed properly and have the possibility to await the models' response

// used to get all bookmarked products of one user
async function getBookmarkedProducts(req, res, next) {
    try{
        const currentUser = req.currentUser; // currentUser needed to be passed for (at least) the header in the view
        const products = await bookmarkModel.getBookmarkedProducts(currentUser.id); // all bookmarked products from the user
        res.render('userBookmarks', {currentUser, products});
    } catch (err) {
        next(err);
    }

}

// used to togggle between bookmarked or not
async function toggleBookmark(req, res, next) {
    try {
        const productId = req.params.productId; // the id of the bookmarked-clicked product
        const userId = req.currentUser.id; // the user that wants to bookmark/remove from bookmark

        const isBookmarked = await bookmarkModel.isProductBookmarked(userId, productId); // check if the product is already bookmarked by the user

        if (isBookmarked) {
            await bookmarkModel.removeBookmark(userId, productId); // if already bookmarked, remove the bookmark
        } else {
            await bookmarkModel.addBookmark(userId, productId); // if not bookmarked, add the bookmark
        }

        res.sendStatus(200); // response ok
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getBookmarkedProducts,
    toggleBookmark
}
const bookmarkModel = require('../models/bookmarkModel');

async function getBookmarkedProducts(req, res, next) {
    const currentUser = req.currentUser;
    const products = await bookmarkModel.getBookmarkedProducts(currentUser.id);
    res.render('userBookmarks', {currentUser, products});
}

async function toggleBookmark(req, res, next) {
    try {
        const productId = req.params.productId;
        const userId = req.currentUser.id;

        // Check if the product is already bookmarked by the user
        const isBookmarked = await bookmarkModel.isProductBookmarked(userId, productId);

        if (isBookmarked) {
            // If already bookmarked, remove the bookmark
            await bookmarkModel.removeBookmark(userId, productId);
        } else {
            // If not bookmarked, add the bookmark
            await bookmarkModel.addBookmark(userId, productId);
        }

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getBookmarkedProducts,
    toggleBookmark
}
// import the 'express' module and create an instance of the Express router
const express = require("express");
const router = express.Router();

// import all necessary files to be able to use its function - mostly as handler
const authService = require("../services/authentication");
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const bookmarkController = require('../controllers/bookmarkController');

// since the authenticateJWT function needs to retrieve the request's currentUser and the req.param.userID, it needs to be called as a middleware for every endpoint

// every route for the user's profile - all handlers are from the userController.js file
router.get('/:userID', authService.authenticateJWT, userController.getUserByID); // handle the GET request to '/:userID' endpoint
router.get('/:userID/edit', authService.authenticateJWT, userController.editUser); // handle the GET request to '/:userID/edit' endpoint
router.post('/:userID', authService.authenticateJWT, userController.updateUser); // handle the POST request to '/:userID' endpoint
router.delete('/:userID/delete', authService.authenticateJWT, userController.deleteUser); // handle the DELETE request to '/:userID/delete' endpoint


// every route for the user's products - all handlers are from the productController.js file
router.route('/:userID/myProducts')
    .get(authService.authenticateJWT, productController.getProductsByUserID) // handle the GET request to '/:userID/myProducts' endpoint
    .post(authService.authenticateJWT, productController.createProduct) // handle the Post request to '/:userID/myProducts' endpoint

router.get('/:userID/myProducts/:productID/edit', authService.authenticateJWT, productController.editProduct); // handle the GET request to '/:userID/myProducts' endpoint
router.post('/:userID/myProducts/:productID', authService.authenticateJWT, productController.updateProduct); // handle the POST request to '/:userID/myProducts/:productID' endpoint
router.delete('/:userID/myProducts/:productID/delete', authService.authenticateJWT, productController.deleteProduct); // handle the DELETE request to '/:userID/myProducts/:productID/delete' endpoint

// route for user's bookmarked products - handler from the bookmarkController.js file
router.get('/:userID/mybookmarks',authService.authenticateJWT, bookmarkController.getBookmarkedProducts); // handle the GET request to '/:userID/mybookmarks' endpoint

// exports router to use in app.js
module.exports = router;
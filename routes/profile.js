const express = require("express");
const router = express.Router();
const authService = require("../services/authentication");
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');

router.get('/:userID', authService.authenticateJWT, userController.getUserByID);
router.get('/:userID/edit', authService.authenticateJWT, userController.editUser);
router.post('/:userID', authService.authenticateJWT, userController.updateUser);
router.delete('/:userID/delete', authService.authenticateJWT, userController.deleteUser);

router.route('/:userID/myProducts')
    .get(authService.authenticateJWT, productController.getProductsByUserID)
    .post(authService.authenticateJWT, productController.createProduct)

router.get('/:userID/myProducts/:productID/edit', authService.authenticateJWT, productController.editProduct);
router.post('/:userID/myProducts/:productID', authService.authenticateJWT, productController.updateProduct);
router.delete('/:userID/myProducts/:productID/delete', authService.authenticateJWT, productController.deleteProduct);


router.get('/:userID/mybookmarks',authService.authenticateJWT, productController.getBookmarkedProducts);
module.exports = router;
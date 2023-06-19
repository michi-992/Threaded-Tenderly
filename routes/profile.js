const express = require("express");
const router = express.Router();
const authService = require("../services/authentication");
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const userModel = require('../models/userModel')

router.use(authService.authenticateJWT);
router.get('/:userID', userController.getUserByID);
router.get('/:userID/edit', userController.editUser);
router.post('/:userID', userController.updateUser);
router.delete('/:userID/delete', userController.deleteUser);

router.route('/:userID/myProducts')
    .get(productController.getProductsByUserID)
    .post(productController.createProduct)

router.get('/:userID/myProducts/:productID/edit', productController.editProduct);
router.post('/:userID/myProducts/:productID', productController.updateProduct);
router.delete('/:userID/myProducts/:productID/delete', productController.deleteProduct);

module.exports = router;
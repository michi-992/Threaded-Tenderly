const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const authService = require('../services/authentication');

router.get('/', (req, res) => {
    res.render('homepage');
})

router.route('/login')
    .get((req, res, next) => {
        res.render('login', {message: ''});
    })
    .post((req, res, next) => {
        userModel.getUsers()
            .then((users) => {
                authService.authenticateUser(req.body, users, res);
            })
            .catch((err) => {
                next(err);
            })
    });

router.get('/logout', (req, res, next) => {
    res.cookie('accessToken', '', {maxAge: 0});
    res.redirect('/marketplace')
})

router.route('/register')
    .get((req, res, next) => {
        const message = '';
        res.render('register', { message });
    })
    .post(userController.createUser);


router.use(authService.checkIfLoggedIn);

router.get('/marketplace', productController.getProducts)
router.get('/marketplace/filter', productController.filterProducts);
router.post('/marketplace/:productId/bookmark', productController.toggleBookmark);
router.get('/marketplace/:productID', productController.getProductByProductID)

router.get('/about', async (req, res, next) => {
    try {
        const currentUser = req.currentUser;
        res.render('about', { currentUser });
    } catch (err) {
        console.log(err);
    }

})


module.exports = router;
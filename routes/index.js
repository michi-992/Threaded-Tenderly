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
        res.render('login');
    })
    .post((req, res, next) => {
        userModel.getUsers()
            .then((users) => {
                authService.authenticateUser(req.body, users, res);
            })
            .catch((err) => {
                res.sendStatus(500)
            })
    });

router.get('/logout', (req, res, next) => {
    res.cookie('accessToken', '', {maxAge: 0});
    res.redirect('/marketplace')
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', userController.createUser);

router.get('/about', (req, res) => {
    const currentUser = req.currentUser;
    res.render('about', { currentUser });
})


router.use(authService.checkForUser);

router.get('/marketplace', productController.getProducts)

router.get('/marketplace/:productID', productController.getProductByProductID)

module.exports = router;
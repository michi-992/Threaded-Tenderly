// import the 'express' module and create an instance of the Express router
const express = require("express");
const router = express.Router();

// import all necessary files to be able to use its function - mostly as handler
const userModel = require('../models/userModel');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const bookmarkController = require('../controllers/bookmarkController');
const authService = require('../services/authentication');

// the landing page only has a http get method and as a response renders the file at /views/homepage (the landing page)
router.get('/', (req, res) => {
    res.render('homepage');
})

// handle GET and POST request to '/login' endpoint
router.route('/login')
    .get((req, res, next) => {
        res.render('login', {message: ''}); // render the 'login' view template with an optional 'message' parameter (message for notifying user of mistake)
    })
    .post((req, res, next) => {
        userModel.getUsers()  // first it get all the users by calling the getUsers function
            .then((users) => {
                authService.authenticateUser(req.body, users, res); // then it calls the authentication and passes the users and the req.body
            })
            .catch((err) => {
                next(err); // once an error occurs, it jumps to the error handling
            })
    });

// handle GET request to '/logout' endpoint
router.get('/logout', (req, res, next) => {
    res.cookie('accessToken', '', { maxAge: 0 }); // clear the 'accessToken' cookie by setting it to an empty value and setting its expiration to 0
    res.redirect('/marketplace'); // Redirect the user to '/marketplace' after logout
});

// handle GET and POST requests to '/register' endpoint
router.route('/register')
    .get((req, res, next) => {
        const message = '';
        res.render('register', { message }); // render the 'register' view template with an optional 'message' parameter
    })
    .post(userController.createUser); // handle the POST request to '/register'


// apply authentication middleware (checkIfLoggedIn) to all routes defined after this point
router.use(authService.checkIfLoggedIn);

router.get('/marketplace', productController.getProducts) // handle the GET request to '/marketplace' endpoint
router.get('/marketplace/filter', productController.filterProducts); // handle the GET request to '/marketplace/filter' endpoint
router.get('/marketplace/:productID', productController.getProductByProductID) // handle the GET request to '/marketplace/:productID' endpoint

router.post('/marketplace/:productId/bookmark', bookmarkController.toggleBookmark); // handle POST request to '/marketplace/:productId/bookmark' endpoint


router.get('/about', async (req, res, next) => {
    try {
        // retrieving the request's currentUser that is set in the checkedIfLoggedIn to pass it to the rendered view (necessary for header)
        const currentUser = req.currentUser;
        res.render('about', { currentUser });
    } catch (err) {
        next(err); // goes to error handling in case of an error
    }

})

// exports router to use in app.js
module.exports = router;
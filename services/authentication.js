const jwt = require('jsonwebtoken'); // import the 'jsonwebtoken' module
const bcrypt = require('bcrypt'); // import the 'bcrypt' module
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET; // retrieve the value of the 'ACCESS_TOKEN_SECRET' environment variable

// used in login process
async function authenticateUser({username, password}, users, res) { // the function gets passed the req.body as {username and password}, the users from userModel.getUsers and res
    const user = users.find(u => {
        return u.username === username; // it looks for whether there is a user with the input username
    });

    if (user && await checkPassword(password, user.password)) {
        // if there is a user's username that matches the input and if the password is correct the accessToken is created by signing the JWT with the user data as the payload, the secret and an expiration
        const accessToken = jwt.sign({
                    id: user.id,
                    username: user.username,
                    email: user.email
                }, ACCESS_TOKEN_SECRET, {
                    expiresIn: '2h'
                }
            )
        ;
        res.cookie('accessToken', accessToken); // sets the signed JWT as the accessToken cookie
        res.redirect('/marketplace');
    } else {
        res.render('login', {message: 'Username or password false'}); // if the username or password are false it notifies the user on the login page
    }
}

// used as a middleware in the indexRouter
function checkIfLoggedIn(req, res, next) {
    const token = req.cookies['accessToken']; // it retrieves the accessToken cookie from the request
    // the request's currentUser default is undefined (changes in header depending on whether there is a currentUser or not)
    let currentUser = undefined;
    req.currentUser = currentUser;

    if (token) {
        // if there is a token (example user logged in) it verifies the JWT and the verified user gets set as the currentUser
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                next(); // goes to error handling if there is an error
            } else {
                currentUser = user;
                req.currentUser = currentUser;
                next(); // goes to the next function (the handler in the routes)
            }
        });
    } else {
        next(); // goes to the next function (the handler in the routes)
    }
}

// used as a middleware in the profileRouter
function authenticateJWT(req, res, next) {
    const token = req.cookies['accessToken']; // it retrieves the accessToken cookie from the request
    // the request's currentUser default is undefined (changes in header depending on whether there is a currentUser or not)
    let currentUser = undefined;
    req.currentUser = currentUser;
    const userID = parseInt(req.params.userID); // the userID equals the route's parameter userID

    if (token) {
        // if there is a token (example user logged in) it verifies the JWT and the verified user gets set as the currentUser
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.redirect('/login'); // if there is an error in the verifying (example JWT expired) the user gets redirected to the login page
            } else {
                req.user = user;
                currentUser = req.user;
                req.currentUser = currentUser;


                const currentUserID = parseInt(req.currentUser.id);
                if (userID !== currentUserID) {
                    // if the currentUser tries to access another users profile/etc. it renders the 404 page
                    res.render('404');
                } else {
                    next(); // goes to the next function (the handler in the routes)
                }
            }
        });
    } else {
        res.redirect('/login');  // rif the user is not logged in, it redirects them to the login page
    }
}


async function checkPassword(password, hash) {
    let pw = await bcrypt.compare(password, hash); // it compares the input password with the decrypted user (the same username) password
    return pw;
}

module.exports = {
    authenticateUser,
    checkIfLoggedIn,
    authenticateJWT,
}
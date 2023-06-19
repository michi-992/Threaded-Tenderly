const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const bcrypt = require('bcrypt');
const productModel = require("../models/productModel");

async function authenticateUser({email, password}, users, res) {
    const user = users.find(u => {
        return u.email === email;
    });

    if (user && await checkPassword(password, user.password)) {
        const accessToken = jwt.sign({
                    id: user.id,
                    username: user.username,
                    email: user.email
                }, ACCESS_TOKEN_SECRET, {
                    expiresIn: '2h'
                }
            )
        ;
        res.cookie('accessToken', accessToken);
        res.redirect('/marketplace');
    } else {
        res.render('login', {message: 'Username or password false'});
    }
}

function checkIfLoggedIn(req, res, next) {
    const token = req.cookies['accessToken'];
    let currentUser = undefined;
    req.currentUser = currentUser;

    if (token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                next();
            } else {
                currentUser = user;
                req.currentUser = currentUser;
                next();
            }
        });
    } else {
        next();
    }
}

function authenticateJWT(req, res, next) {
    const token = req.cookies['accessToken'];
    let currentUser = undefined;
    req.currentUser = currentUser;
    const userID = parseInt(req.params.userID);
    if (token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.redirect('/login');
            } else {
                req.user = user;
                currentUser = req.user;
                req.currentUser = currentUser;

                const currentUserID = parseInt(req.currentUser.id);
                console.log(userID)
                console.log(currentUserID)
                if (userID !== currentUserID) {
                    console.log('404');
                    res.render('404');
                } else {
                    console.log('next');
                    next();
                }
            }
        });
    } else {
        res.redirect('/login');
    }


}


async function checkPassword(password, hash) {
    let pw = await bcrypt.compare(password, hash)
    return pw;
}

module.exports = {
    authenticateUser,
    checkIfLoggedIn,
    authenticateJWT,
}
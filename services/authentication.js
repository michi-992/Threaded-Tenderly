const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const bcrypt = require('bcrypt');

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
                    expiresIn: 60
                }
            )
        ;
        res.cookie('accessToken', accessToken);
        res.redirect('/marketplace');
    } else {
        res.send('Username or password incorrect');
    }
}

function checkForUser(req, res, next) {
    const token = req.cookies['accessToken'];
    let currentUser = undefined;
    req.currentUser = currentUser;

    if (token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                req.currentUser = undefined;
                console.log('hello');
                console.log(req.currentUser);
                return next();
            } else {
                currentUser = user;
                req.currentUser = currentUser;
                next();
            }
        });
    } else {
        req.currentUser = currentUser;
        next();
    }
}

function authenticateJWT(req, res, next) {
    const token = req.cookies['accessToken'];
    let currentUser = undefined;
    req.currentUser = currentUser;

    if (token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            currentUser = req.user;
            req.currentUser = currentUser;
            next();
        })
    } else {
        req.currentUser = currentUser;
        res.sendStatus(401);
    }
}


async function checkPassword(password, hash) {
    let pw = await bcrypt.compare(password, hash)
    return pw;
}

module.exports = {
    authenticateUser,
    checkForUser,
    authenticateJWT,
}
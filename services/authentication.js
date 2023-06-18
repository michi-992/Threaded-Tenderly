const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const bcrypt = require('bcrypt');

async function authenticateUser({email, password}, users, res) {
    const user = users.find(u => {
        return u.email === email;
    });

    if (user && await checkPassword(password, user.password)) {
        const accessToken = jwt.sign({id: user.id, email: user.email, expiresIn: '2h' }, ACCESS_TOKEN_SECRET);
        res.cookie('accessToken', accessToken);
        res.redirect('/register');
    } else {
        res.send('Username or password incorrect');
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
            currentUser = user;
            req.currentUser = currentUser;

            next();
        });
    } else {
        next();
    }
}


async function checkPassword(password, hash){
    let pw = await bcrypt.compare(password, hash)
    return pw;
}

module.exports = {
    authenticateUser,
    authenticateJWT,
}
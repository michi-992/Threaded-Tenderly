const userModel = require('../models/userModel');
const productModel = require('../models/productModel.js');
const fs = require("fs");

async function getUsers(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const users = await userModel.getUsers();
        res.send(users);
    } catch (err) {
        next(err);
    }
}

async function getUserByID(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const user = await userModel.getUserByID(currentUser.id);
        res.render('profile', {user, currentUser});
    } catch (err) {
        next(err);
    }
}

async function editUser(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const user = await userModel.getUserByID(currentUser.id);

        res.render('editUser', {user, currentUser})

    } catch(err) {
        next(err);
    }
}

async function updateUser(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const userData = req.body;
        if(userData.craft === undefined) {
            userData.craft = '';
        }
        if(userData.incentive === undefined) {
            userData.incentive = '';
        }
        await userModel.updateUser(userData, currentUser.id);
        const user = await userModel.getUserByID(currentUser.id);
        res.render('profile', {user, currentUser});
    } catch (err) {
        next(err)
    }
}


async function createUser(req, res, next) {
    try {
        const userData = req.body;
        const users = await userModel.getUsers();
        const user = users.find(u => {
            return u.username === userData.username;
        });

        if(user) {
            const message = 'This username is already taken.'
            res.render('register', { message })
        } else {
            if(userData.craft === undefined) {
                userData.craft = '';
            }
            if(userData.incentive === undefined) {
                userData.incentive = '';
            }

            await userModel.createUser(userData);
            res.redirect('/login');
        }
    } catch (err) {
        next(err);
    }
}

async function deleteUser(req, res, next) {
    userModel.deleteUser(parseInt(req.params.userID))
        .then(() => { // already handled in the profile.ejs file, just for completion purposes
            res.redirect(`/logout`);
        }).catch((err) => {
        next(err);
    })
}

module.exports = {
    getUserByID,
    editUser,
    updateUser,
    createUser,
    deleteUser
}
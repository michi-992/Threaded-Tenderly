const userModel = require('../models/userModel');
const productModel = require('../models/productModel.js');
const fs = require("fs");

async function getUsers(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const users = await userModel.getUsers();
        res.send(users);
    } catch (error) {
        console.log(error);
        res.status(404)
        next(err);
    }
}

async function getUserByID(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const userID = parseInt(req.params.userID);
        const currentUserID = parseInt(req.currentUser.id);

        if (userID !== currentUserID) {
            res.render('404')
        } else {
            const user = await userModel.getUserByID(userID);
            res.render('profile', {user, currentUser});
        }
    } catch
        (error) {
        console.log(error);
    }
}

async function editUser(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const userID = parseInt(req.params.userID);
        const currentUserID = parseInt(req.currentUser.id);
        const user = await userModel.getUserByID(userID);

        if (userID !== currentUserID) {
            res.render('404')
        } else {
            res.render('editUser', {user, userID, currentUser})
        }
    } catch
        (error) {
        res.status(404)
        next(err);
    }
}

async function updateUser(req, res, next) {
    try {
        const userID = parseInt(req.params.userID)
        const currentUser = req.currentUser;
        await userModel.updateUser(req.body, userID);
        const user = await userModel.getUserByID(userID);
        res.render('profile', {user, currentUser});
    } catch (error) {
        res.status(404)
    }
}


async function createUser(req, res, next) {
    try {
        const userData = req.body;
        const user = await userModel.createUser(userData);
        res.redirect('/login');
    } catch (error) {
        res.status(404)
        next(err);
    }
}

async function deleteUser(req, res, next) {
    userModel.deleteUser(parseInt(req.params.userID))
        .then(() => {
            const userID = req.params.userID;
            res.redirect(`/profile/${userID}/myproducts`);
        }).catch((err) => {
        res.status(404)
        next(err);
    })
}

module.exports = {
    getUsers,
    getUserByID,
    editUser,
    updateUser,
    createUser,
    deleteUser
}
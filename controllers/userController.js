const userModel = require('../models/userModel');
const productModel = require('../models/productModel.js');
const fs = require("fs");

async function getUsers(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const users = await userModel.getUsers();
        res.send(users);
    } catch (error) {
        next(error);
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

    } catch
        (error) {
        next(error);
    }
}

async function updateUser(req, res, next) {
    try {
        const currentUser = req.currentUser;
        await userModel.updateUser(req.body, currentUser.id);
        const user = await userModel.getUserByID(currentUser.id);
        res.render('profile', {user, currentUser});
    } catch (error) {
        next(error)
    }
}


async function createUser(req, res, next) {
    try {
        console.log(req.body);
        const userData = req.body;
        await userModel.createUser(userData);
        res.redirect('/login');
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    userModel.deleteUser(parseInt(req.params.userID))
        .then(() => {
            const userID = req.params.userID;
            res.redirect(`/profile/${userID}/myproducts`);
        }).catch((err) => {
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
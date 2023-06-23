const userModel = require('../models/userModel');
const productModel = require('../models/productModel.js');
const fs = require("fs");

// function only retrieves all users - used in register and update user to check for username duplicates

// used for getting all users
async function getUsers(req, res, next) {
    try {
        const users = await userModel.getUsers();
        res.send(users);
    } catch (err) {
        next(err);
    }
}

// used for getting one user based on an id
async function getUserByID(req, res, next) {
    try {
        const currentUser = req.currentUser; // currentUser needed to be passed for (at least) the header in the view
        const user = await userModel.getUserByID(currentUser.id);
        res.render('profile', {user, currentUser}); // renders the profile
    } catch (err) {
        next(err);
    }
}

// used for creating a new user
async function createUser(req, res, next) {
    try {
        const userData = req.body;
        const users = await userModel.getUsers();
        const user = users.find(u => {
            return u.username === userData.username;
        });

        if(user) { // message if a username is input that already exists for another user
            const message = 'This username is already taken.'
            res.render('register', { message })
        } else {
            // puts not input optional data to empty string
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

// used for editing user information
async function editUser(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const user = await userModel.getUserByID(currentUser.id); //all user information
        const message = ''; // default message is none - on update with a username that already exists, there will be a pointer for the user

        res.render('editUser', {message, user, currentUser})

    } catch(err) {
        next(err);
    }
}

// used for updating user information
async function updateUser(req, res, next) {
    try {
        const currentUser = req.currentUser;
        const userData = req.body;
        const user = await userModel.getUserByID(currentUser.id); // user data from the one to update

        // it checks whether the input username exists already for another user
        const users = await userModel.getUsers();
        const checkIfExistingUsername = users.find(u => {
            if(user.username === u.username) {
                return;
            } else {
                return u.username === userData.username;
            }
        });

        if(checkIfExistingUsername) { // if username exists except for other user there is a message for the suer letting them know
            const message = 'The input username has already been taken.'
            res.render('editUser', { message, user, currentUser });
        } else {
            // not input data gets set to an empty string to be input in the database
            if(userData.craft === undefined) {
                userData.craft = '';
            }
            if(userData.incentive === undefined) {
                userData.incentive = '';
            }
            await userModel.updateUser(userData, currentUser.id);
            const user = await userModel.getUserByID(currentUser.id);
            res.render('profile', {user, currentUser}); // renders updated user data in profile
        }
    } catch (err) {
        next(err)
    }
}


// used for deleting a user
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
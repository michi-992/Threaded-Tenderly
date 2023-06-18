const userModel = require('../models/userModel');

async function getUsers(req, res, next) {
    try {
        const currentUser = req.currentUser;
        await userModel.getUsers();
    } catch (error) {
        console.log(error);
        res.status(404)
        next(err);
    }
}


async function createUser(req, res, next) {
    try {
        const userData = req.body;
        const user = await userModel.createUser(userData);
        res.redirect('/');
    } catch (error) {
        res.status(404)
        next(err);
    }
}

module.exports = {
    getUsers,
    createUser,
}
const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello Private World!');
})

router.get('/my_products', (req, res) => {
    res.render('addProduct')
})

router.post('/my_products', (req, res) => {
    console.log(req.body);
    res.render('addProduct');
})

module.exports = router;
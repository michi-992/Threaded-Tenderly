const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel');
const userController = require('../controllers/userController');

router.get('/', (req, res) => {
    res.render('homepage');
})

const products = [
    {
        'productID': '1',
        'productName': 'red washed-out hoodie',
        'username': 'craftyCeline',
        'productPrice': 21.43 + "€",
        'picture': 'washedOutHoodie',
        'article': 'top-wear',
        'productCraft': 'sewing',
        'description': `This hoodie is sown by hand and washed out using a special technique. It takes 30 hours to create and 2 meters of fabric. It has a front pocket as well as adjustable strings.`,
        'material': `cotton`,
        'sizing': `EU MEN LARGE`,
        'season': 'autumn, winter',
        'color': 'red'
    },
    {
        'productID': '2',
        'productName': 'green halter top',
        'productPrice': 30.24 + "€",
        'picture': 'greenHalterTop'
    },
    {
        'productID': '3',
        'productName': 'orange skirt',
        'productPrice': 15.65 + "€",
        'picture': 'orangeSkirt'
    },
    {
        'productID': '4',
        'productName': 'wide leg jeans',
        'productPrice': 45.78 + "€",
        'picture': 'jeans'
    },
    {
        'productID': '5',
        'productName': 'pink ruffle dress',
        'productPrice': 27.13 + "€",
        'picture': 'dress'
    },
    {
        'productID': '6',
        'productName': 'Blue off-shoulder cardigan',
        'productPrice': 10.43 + "€",
        'picture': 'jeans'
    },
    {
        'productID': '7',
        'productName': 'green halter top',
        'productPrice': 5.43 + "€",
        'picture': 'jeans'
    },
    {
        'productID': '8',
        'productName': 'orange skirt',
        'productPrice': 50.43 + "€",
        'picture': 'jeans'
    },
    {
        'productID': '9',
        'productName': 'Blue off-shoulder cardigan',
        'productPrice': 10.43 + "€",
        'picture': 'jeans'
    },
    {
        'productID': '10',
        'productName': 'green halter top',
        'productPrice': 5.43 + "€",
        'picture': 'jeans'
    },
    {
        'productID': '11',
        'productName': 'Blue off-shoulder cardigan',
        'productPrice': 10.43 + "€",
        'picture': 'jeans'
    },
    {
        'productID': '12',
        'productName': 'green halter top',
        'productPrice': 5.43 + "€",
        'picture': 'jeans'
    },
    {
        'productID': '13',
        'productName': 'orange skirt',
        'productPrice': 50.43 + "€",
        'picture': 'jeans'
    },
    {
        'productID': '14',
        'productName': 'Blue off-shoulder cardigan',
        'productPrice': 10. + "€",
        'picture': 'jeans'
    },
    {
        'productID': '15',
        'productName': 'green halter top',
        'productPrice': 5.43 + "€",
        'picture': 'dress'
    },
    {
        'productID': '16',
        'productName': 'Blue off-shoulder cardigan',
        'productPrice': 10. + "€",
        'picture': 'jeans'
    },
]
const user = {
    'id': 1,
    'name': 'Celine',
    'surname': 'Smith',
    'username': 'craftyCeline',
    'email': 'celine.s1997@hotmail.com',
    'craft': 'sewing',
    'incentive': 'selling',
}

router.get('/marketplace', async (req, res) => {
    res.render('marketplace', { products });
})


router.get('/marketplace/:productID', async (req, res) => {
    const id = (req.params.productID - 1)
    const product = products[id];
    res.render('product', { product });
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', (req, res) => {
    console.log(req.body);
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', (req, res) => {
    console.log(req.body);
    // userModel.createUser(req.body);
});


router.get('/profile', (req, res) => {
    res.render('profile', { user });
})

router.get('/myproducts', (req, res) => {
    const product1 = products[0];
    const product2 = products[1];
    res.render('addProduct', { user, product1, product2 });
})

module.exports = router;
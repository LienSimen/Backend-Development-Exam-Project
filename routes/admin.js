var express = require('express');
var { authMiddleware, adminOnly } = require('../middlewares/roleMiddleware');
var router = express.Router();

// Admin routes for the front end

router.get('/', function(req, res) {
    // #swagger.tags = ['Admin Front End']
    // #swagger.description = 'Admin login page'
    // #swagger.produces = ['text/html']
    res.render('adminPanel');
});

router.get('/products', authMiddleware, adminOnly, (req, res) => {
    // #swagger.tags = ['Admin Front End']
    // #swagger.description = 'Admin products page'
    // #swagger.produces = ['text/html']
    res.render('products');
});

router.get('/orders', authMiddleware, adminOnly, (req, res) => {
    // #swagger.tags = ['Admin Front End']
    // #swagger.description = 'Admin orders page'
    // #swagger.produces = ['text/html']
    res.render('orders');
});

router.get('/brands', authMiddleware, adminOnly, (req, res) => {
    // #swagger.tags = ['Admin Front End']
    // #swagger.description = 'Admin brands page'
    // #swagger.produces = ['text/html']
    res.render('brands');
});

router.get('/categories', authMiddleware, adminOnly, (req, res) => {
    // #swagger.tags = ['Admin Front End']
    // #swagger.description = 'Admin categories page'
    // #swagger.produces = ['text/html']
    res.render('categories');
});

router.get('/roles', authMiddleware, adminOnly, (req, res) => {
    // #swagger.tags = ['Admin Front End']
    // #swagger.description = 'Admin roles page'
    // #swagger.produces = ['text/html']
    res.render('roles');
});

router.get('/users', authMiddleware, adminOnly, (req, res) => {
    // #swagger.tags = ['Admin Front End']
    // #swagger.description = 'Admin users page'
    // #swagger.produces = ['text/html']
    res.render('users');
});

module.exports = router;
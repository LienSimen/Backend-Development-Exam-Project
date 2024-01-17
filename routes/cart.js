const express = require('express');
const { authMiddleware } = require('../middlewares/roleMiddleware');
const CartService = require('../services/cartService');
const db = require('../models');
const cartService = new CartService(db);
const router = express.Router();

// Get the cart for the logged in user
router.get('/', authMiddleware, async (req, res) => {
    // #swagger.tags = ['Cart']
    // #swagger.description = 'Get the cart for the logged in user'
    // #swagger.produces = ['application/json']
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const cart = await cartService.getCartByUserId(req.user.id);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get cart " + error.message
        });
    }
});

// Add an item to the cart
router.post('/add', authMiddleware, async (req, res) => {
    // #swagger.tags = ['Cart']
    // #swagger.description = 'Add an item to the cart'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Item details to add to the cart',
        required: true,
        schema: { $ref: '#/definitions/Cart' }
    } */
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        const updatedCart = await cartService.addToCart(userId, productId, quantity);
        res.status(201).json(updatedCart);
    } catch (error) {
        if (error && error.statusCode === 404) {
            res.status(404).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: "Failed to add items to cart: " + error.message
            });
        }
    }
});

// Update the quantity of an item in the cart
router.patch('/update/:cartItemId', authMiddleware, async (req, res) => {
    // #swagger.tags = ['Cart']
    // #swagger.description = 'Update the quantity of an item in the cart'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated quantity of the item.',
        required: true,
        schema: { $ref: '#/definitions/UpdateCart' }
    } */
    // #swagger.parameters['cartItemId'] = { description: 'Cart Item ID' }
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const userId = req.user.id;
        const cart = await cartService.getCartByUserId(userId);
        const { cartItemId } = req.params;
        const { quantity } = req.body;
        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found for user'
            });
        }
        const newCart = await cartService.updateCartItem(cart.id, cartItemId, quantity);
        res.status(200).json(newCart);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update quantity: " + error.message
        });
    }
});

// Remove an item from the cart with a soft delete
router.delete('/remove/:cartItemId', authMiddleware, async (req, res) => {
    // #swagger.tags = ['Cart']
    // #swagger.description = 'Remove an item from the cart with a soft delete'
    // #swagger.security = [{ "Bearer": [] }]
    // #swagger.parameters['cartItemId'] = { description: 'Cart Item ID' }
    try {
        const {
            cartItemId
        } = req.params;
        const message = await cartService.softDeleteCartItem(cartItemId);
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({
            message: "Failed to remove item from cart: " + error.message
        });
    }
});

// Checkout the cart
router.post('/checkout/now', authMiddleware, async (req, res) => {
    // #swagger.tags = ['Cart']
    // #swagger.description = 'Checkout the cart'
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const userId = req.user.id;
        const message = await cartService.checkout(userId);
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({
            message: "Failed to checkout cart: " + error.message
        });
    }
});

module.exports = router;
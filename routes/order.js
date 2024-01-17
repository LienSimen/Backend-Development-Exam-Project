const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middlewares/roleMiddleware');
const OrderService = require('../services/orderService');
const db = require('../models');
const orderService = new OrderService(db);

// Get all orders for a user
router.get('/', authMiddleware, async (req, res) => {
    // #swagger.tags = ['Order']
    // #swagger.description = 'Get all orders for a user'
    // #swagger.produces = ['application/json']
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const orders = await orderService.getOrdersByUserId(req.user.id);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get all orders for a user: " + error.message
        });
    }
});

// Admin route to retrieve all orders
router.get('/all', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Order']
    // #swagger.description = 'Get all orders (Admin only)'
    // #swagger.produces = ['application/json']
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const allOrders = await orderService.getAllOrders();
        res.status(200).json(allOrders);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get all orders: " + error.message
        });
    }
});

// Admin route to update the status of an order
router.put('/status/:orderId', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Order']
    // #swagger.description = 'Update the status of an order (Admin only)'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated status of the order.',
        required: true,
        schema: { $ref: '#/definitions/Order' }
    } */
    // #swagger.parameters['orderId'] = { description: 'Order ID' } 
    // #swagger.security = [{ "Bearer": [] }]
    const { status } = req.body;
    const { orderId } = req.params;

    try {
        const updatedOrder = await orderService.updateOrderStatus(orderId, status);
        res.status(200).json({
            message: 'Order status updated successfully',
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update status: " + error.message
        });
    }
});


module.exports = router;
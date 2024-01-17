const express = require('express');
const router = express.Router();
const ProductService = require('../services/productService');
const { adminOnly, authMiddleware } = require('../middlewares/roleMiddleware');
const db = require('../models');
const productService = new ProductService(db);

// Get all products
router.get('/', async (req, res) => {
    // #swagger.tags = ['Product']
    // #swagger.description = 'Get all products'
    // #swagger.produces = ['application/json']
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get all products: " + error.message
        });
    }
});

// Create a product (Admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Product']
    // #swagger.description = 'Creates a new product (Admin only)'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Product details for new product',
        required: true,
        schema: { $ref: '#/definitions/Product' }
    } */
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create product: " + error.message
        });
    }
});


// Get a single product
router.get('/:id', async (req, res) => {
    // #swagger.tags = ['Product']
    // #swagger.description = 'Get a single product'
    // #swagger.produces = ['application/json']
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get product: " + error.message
        });
    }
});

// Update a product (Admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Product']
    // #swagger.description = 'Updating a product (Admin only)'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated details of the product.',
        required: true,
        schema: { $ref: '#/definitions/UpdateProduct' }
    } */
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const productId = req.params.id;
        const updateData = req.body;
        const product = await productService.updateProduct(productId, updateData);
        res.status(200).json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: "Failed to update product: " + error.message
        });
    }
});
// Soft Delete Product (Admin Only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Product']
    // #swagger.description = 'Deleting a product (Admin only)'
    // #swagger.parameters['id'] = { description: 'Product ID' }
    // #swagger.security = [{ "Bearer": [] }]
    try {
        await productService.softDeleteProduct(req.params.id);
        res.status(200).json({
            message: 'Product soft deleted successfully'
        });
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: "Failed to delete product: " + error.message
        });
    }
});

module.exports = router;
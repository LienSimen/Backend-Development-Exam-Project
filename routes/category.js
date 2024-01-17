const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middlewares/roleMiddleware');
const CategoryService = require('../services/categoryService');
const db = require('../models');
const categoryService = new CategoryService(db);


// Get all categories
router.get('/', async (req, res) => {
    // #swagger.tags = ['Category']
    // #swagger.description = 'Get all categories'
    // #swagger.produces = ['application/json']
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get all categories: " + error.message
        });
    }
});

// Create a category - Admin only
router.post('/', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Category']
    // #swagger.description = 'Creates a new category (Admin only)'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Category details for new category',
        required: true,
        schema: { $ref: '#/definitions/Category' }
    } */
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create category: " + error.message
        });
    }
});

// Update a category - Admin only
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Category']
    // #swagger.description = 'Updating a category (Admin only)'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated details of the category.',
        required: true,
        schema: { $ref: '#/definitions/UpdateCategory' }
    } */
    // #swagger.parameters['id'] = { description: 'Category ID' }
    // #swagger.security = [{ "Bearer": [] }]
    try {
        await categoryService.updateCategory(req.params.id, req.body);
        res.status(200).json({
            message: 'Category updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update category: " + error.message
        });
    }
});

// Delete a category - Admin only
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Category']
    // #swagger.description = 'Deleting a category (Admin only)'
    // #swagger.parameters['id'] = { description: 'Category ID' }
    // #swagger.security = [{ "Bearer": [] }]
    try {
        await categoryService.deleteCategory(req.params.id);
        res.status(200).json({
            message: 'Category deleted successfully'
        });
    } catch (error) {
        if (error.message === 'Cant delete category with products assigned to it') {
            return res.status(400).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: "Failed to delete category: " + error.message
            });
        }
    }
});

module.exports = router;
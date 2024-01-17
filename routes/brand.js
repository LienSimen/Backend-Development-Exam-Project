const express = require('express');
const { authMiddleware, adminOnly } = require('../middlewares/roleMiddleware');
const BrandService = require('../services/brandService');
const db = require('../models');
const brandService = new BrandService(db);
const router = express.Router();

// Get all brands
router.get('/', async (req, res) => {
    // #swagger.tags = ['Brand']
    // #swagger.description = 'Get all brands'
    // #swagger.produces = ['application/json']
    try {
        const brands = await brandService.getAllBrands();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get all brands: " + error.message
        });
    }
});

// Create a brand - Admin only
router.post('/', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Brand']
    // #swagger.description = 'Creates a new brand (Admin only)'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Brand details for new brand',
        required: true,
        schema: { $ref: '#/definitions/Brand' }
    } */
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const brand = await brandService.createBrand(req.body);
        res.status(201).json(brand);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create brand: " + error.message
        });
    }
});

// Update a brand - Admin only
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Brand']
    // #swagger.description = 'Updating a brand (Admin only)'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated details of the brand.',
        required: true,
        schema: { $ref: '#/definitions/UpdateBrand' }
    } */
    // #swagger.parameters['id'] = { description: 'Brand ID' }
    // #swagger.security = [{ "Bearer": [] }]
    try {
        await brandService.updateBrand(req.params.id, req.body);
        res.status(200).json({
            message: 'Brand updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update brand: " + error.message
        });
    }
});

// Delete a brand - Admin only
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Brand']
    // #swagger.description = 'Deleting brand (Admin only)'
    // #swagger.parameters['id'] = { description: 'Brand ID' }
    // #swagger.security = [{ "Bearer": [] }]
    try {
        await brandService.deleteBrand(req.params.id);
        res.status(200).json({
            message: 'Brand deleted successfully'
        });
    } catch (error) {
        if (error.message === 'Cant delete brand with products assigned to it') {
            res.status(400).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: "Failed to delete brand: " + error.message
            });
        }
    }
});

module.exports = router;
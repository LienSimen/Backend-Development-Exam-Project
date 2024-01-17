const express = require('express');
const { authMiddleware, adminOnly } = require('../middlewares/roleMiddleware');
const MembershipService = require('../services/membershipService');
const db = require('../models');
const membershipService = new MembershipService(db);
const router = express.Router();

// Get all membership statuses
router.get('/', authMiddleware, async (req, res) => {
    // #swagger.tags = ['Membership']
    // #swagger.description = 'Get all membership statuses'
    // #swagger.produces = ['application/json']
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const statuses = await membershipService.getStatuses();
        res.status(200).json(statuses);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get memberships statuses: " + error.message
        });
    }
});


// Create a membership status - Admin only
router.post('/', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Membership']
    // #swagger.description = 'Creates a new membership status (Admin only)'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Membership status details for new status',
        required: true,
        schema: { $ref: '#/definitions/Membership' }
    } */
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const status = await membershipService.createStatus(req.body);
        res.status(201).json(status);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create membership status: " + error.message
        });
    }
});

// Update a membership status - Admin only
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Membership']
    // #swagger.description = 'Updating a membership status (Admin only)'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated details of the membership status.',
        required: true,
        schema: { $ref: '#/definitions/UpdateMembership' }
    } */
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const status = await membershipService.updateStatus(req.params.id, req.body);
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update membership status: " + error.message
        });
    }
});

// Delete a membership status - Admin only
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Membership']
    // #swagger.description = 'Deleting a membership status (Admin only)'
    // #swagger.security = [{ "Bearer": [] }]
    // #swagger.parameters['id'] = { description: 'Membership ID' } 
    try {
        await membershipService.deleteStatus(req.params.id);
        res.status(200).json({
            message: 'Membership status deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
          message: "Failed to delete membership status: " + error.message
        });
    }
});

module.exports = router;
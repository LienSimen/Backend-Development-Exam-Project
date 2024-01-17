var express = require('express');
var router = express.Router();
const UserService = require('../services/userService');
const { authMiddleware, adminOnly } = require('../middlewares/roleMiddleware');
const db = require('../models');
const userService = new UserService(db);

const Role = db.Role;
const MembershipStatus = db.MembershipStatus;

// Get all users
router.get('/', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Get all users'
    // #swagger.produces = ['application/json']
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const users = await userService.getAllUsers({
            include: [Role, MembershipStatus]
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get all users: " + error.message
        });
    }
});

// Get a single user - Admin only
router.get('/:userId', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Get a single user'
    // #swagger.produces = ['application/json']
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const {
            userId
        } = req.params;
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get user: " + error.message
        });
    }
});

// Update a user - Admin only
router.put('/:userId', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Update a user'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated user details.',
        required: true,
        schema: { $ref: '#/definitions/Register' }
    } */
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const {
            userId
        } = req.params;
        const userDetails = req.body;

        await userService.updateUserDetails(userId, userDetails);
        res.status(200).json({
            message: 'User updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update user: " + error.message
        });
    }
});

module.exports = router;
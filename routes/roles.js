const express = require('express');
const router = express.Router();
const RoleService = require('../services/roleService');
const { authMiddleware, adminOnly } = require('../middlewares/roleMiddleware');
const db = require('../models');
const roleService = new RoleService(db);


// Get all roles
router.get('/', authMiddleware, adminOnly, async (req, res) => {
    // #swagger.tags = ['Role']
    // #swagger.description = 'Get all roles'
    // #swagger.produces = ['application/json']
    // #swagger.security = [{ "Bearer": [] }]
    try {
        const roles = await roleService.getAllRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get all roles: " + error.message
        });
    }
});

module.exports = router;
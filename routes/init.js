const express = require('express');
const router = express.Router();
const InitService = require('../services/initService');
const db = require('../models');
const initService = new InitService(db);

// For initializing the database
router.post('/', async (req, res) => {
    // #swagger.tags = ['Init']
    // #swagger.description = 'Initialize the database'
    try {
        const dbPopulate = await initService.initializeDatabase();
        const productPopulate = await initService.initializeProducts();
        let initMessage = dbPopulate.message + " " + productPopulate.message;
        res.status(201).json({
            message: initMessage
        });
    } catch (error) {
        res.status(500).json({
            message: 'Could not initialize database: ' + error.message
        });
    }
});

module.exports = router;
const express = require('express');
const db = require('../models');
const router = express.Router();

// Search for products
router.post('/', async (req, res) => {
    // #swagger.tags = ['Search']
    // #swagger.description = 'Search for products, brands or categories'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Search criteria, use productName, categoryName or brandName',
        required: true,
        schema: { $ref: '#/definitions/Search' }
    } */

    // Deconstructing the request body
    const {
        productName,
        brandName,
        categoryName
    } = req.body;
    // An array to store the conditions for the query. Using array as you can have multiple conditions like phone category with the apple brand
    let conditions = [];
    // An object to store values for the queries like productName, brandName, categoryName
    let replacements = {};

    if (productName) {
        conditions.push("p.name LIKE :productName");
        replacements.productName = `%${productName}%`;
    }

    if (brandName) {
        conditions.push("b.name LIKE :brandName");
        replacements.brandName = `%${brandName}%`;
    }

    if (categoryName) {
        conditions.push("c.name LIKE :categoryName");
        replacements.categoryName = `%${categoryName}%`;
    }

    // Building query
    let sql = `SELECT p.*, b.name as brandName, c.name as categoryName 
               FROM products p
               JOIN brands b ON p.brandId = b.id
               JOIN categories c ON p.categoryId = c.id`;

    // Adding conditions if any exists
    if (conditions.length > 0) {
        sql += ` WHERE ` + conditions.join(' AND ');
    }
    // Executing query
    try {
        const results = await db.sequelize.query(sql, {
            replacements: replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        res.status(200).json({
            items: results,
            count: results.length
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to search: " + error.message
        });
    }
});

module.exports = router;
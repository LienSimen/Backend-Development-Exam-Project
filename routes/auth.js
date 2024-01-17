var express = require('express');
var db = require("../models");
var UserService = require("../services/userService");
var userService = new UserService(db);
var { hashPassword, generateSalt } = require('../utils/cryptoUtils');
var jwt = require('jsonwebtoken');
require('dotenv').config();

var router = express.Router();

// Checking if email does not start with whitespace, has one @ and one period and has atleast one character before and after the period
const validateEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(String(email).toLowerCase());
};

router.post('/register', async (req, res) => {
    // #swagger.tags = ['Register']
    // #swagger.description = 'Register new user'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'User information for registering',
        required: true,
        schema: { $ref: '#/definitions/Register' }
    } */
    const {
        firstName,
        lastName,
        username,
        email,
        password,
        address,
        telephoneNumber
    } = req.body;

    if (!firstName || !lastName || !username || !email || !password || !address || !telephoneNumber) {
        return res.status(400).json({
            message: 'All fields are required.'
        });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({
            message: 'Invalid email format.'
        });
    }

    // Hash password
    const salt = generateSalt();
    const hashedPassword = await hashPassword(req.body.password, salt);

    try {
        const role = await db.Role.findOne({
            where: {
                name: 'User'
            }
        });
        if (!role) {
            return res.status(500).json({
                message: 'User role not found'
            });
        }

        const newUser = await userService.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            salt,
            roleId: 2, // Default user role
            address,
            telephoneNumber,
            membershipStatusId: 1 // Default bronze membership
        });
        res.status(201).json({
            message: 'User successfully registered',
            userId: newUser.UserId
        });
    } catch (error) {
        // Checking for the sequelize validation errors that were added in the model
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Mapping what error messages to send back to the client
            const messages = error.errors.map(err => err.message);
            return res.status(400).json({
                messages: messages
            });
        }
        return res.status(500).json({
            message: 'Registration failed'
        });
    }
});


router.post('/login', async (req, res) => {
    // #swagger.tags = ['Login']
    // #swagger.description = 'Login user'
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'User credentials',
        required: true,
        schema: { $ref: '#/definitions/Login' }
    } */
    try {
        // Identifier is for the frontend admin panel to use eighter email or username and the email and username is for postman / swagger
        const identifier = req.body.identifier || req.body.email || req.body.username;
        const user = await userService.getOneByIdentifier(identifier);
        if (!user) {
            return res.status(401).json({
                message: 'Wrong credentials'
            });
        }
        const hashedPassword = await hashPassword(req.body.password, user.salt);
        if (hashedPassword !== user.password) {
            return res.status(401).json({
                message: 'Wrong credentials'
            });
        }
        // Simple check for admin role for the front end login. Should not tamper with security as server side checks are done for the endpoints with middleware
        isAdmin = user.roleId === 1;
        const token = jwt.sign({
            id: user.userId,
            roleId: user.roleId
        }, process.env.JWT_SECRET, {
            expiresIn: '2h'
        });
        // Setting token as a cookie
        res.cookie('jwt', token, {
            httpOnly: true, // Protection vs client-side scripts. So only the server can access it
            maxAge: 2 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: 'Logged in successfully',
            token: token,
            isAdmin: isAdmin
        });
    } catch (error) {
        res.status(500).json({
            message: 'Login failed'
        });
    }
});

module.exports = router;
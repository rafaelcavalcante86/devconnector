const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const UserController = require('../../controllers/user.controller');


/**
 * @route POST api/users
 * @desc Register user
 * @access Public
 */
router.post(
    '/', 
    [
        check('name', 'Name is required.').not().isEmpty(),
        check('email', 'Please enter a valid email.').isEmail(),
        check('password', 'Please enter a password with 6 or more characters.').isLength({min: 6})
    ],
    UserController.register
);

module.exports = router;

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');

const AuthController = require('../../controllers/auth.controller');

const User = require('../../models/User');

/**
 * @route GET api/auth
 * @desc Test route
 * @access Public
 */
router.get('/', auth, async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error.');
    }

});


/**
 * @route POST api/auth
 * @desc Authenticate user and get token
 * @access Public
 */
router.post(
    '/', 
    [
        check('email', 'Please enter a valid email.').isEmail(),
        check('password', 'Password is required.').exists()
    ],
    AuthController.login
);

module.exports = router;

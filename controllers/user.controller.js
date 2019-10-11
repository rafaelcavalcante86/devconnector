const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');

const User = require('../models/User');

class UserController {

    static async register(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { name, email, password } = req.body;
    
        try {
    
            // Check if user exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors:  [{msg: 'User already exists'}] });
            }
    
            // Get user gravatar if it exists
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
    
            user = new User({
                name,
                email,
                password,
                avatar
            });
    
            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
    
            await user.save();
    
            // Get a JWT
            const payload = {
                user: {
                    id: user.id
                }
            };
    
            jwt.sign(
                payload, 
                config.get('jwtSecretKey'),
                { expiresIn: /*3600*/ 360000 },
                (err, token) => {
                    if (err) throw err;
    
                    res.json({ token });
                }
            );
    
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    
    }
    

}

module.exports = UserController;
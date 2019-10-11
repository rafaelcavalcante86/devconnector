const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');

const User = require('../models/User');

class AuthController {

    static async login(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { email, password } = req.body;
    
        try {
    
            // Check if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors:  [{msg: 'Invalid credentials.'}] });
            }
    
            // Check is password match
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors:  [{msg: 'Invalid credentials.'}] });
            }
    
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

module.exports = AuthController;
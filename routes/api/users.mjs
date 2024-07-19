import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../../models/User.mjs';

const router = express.Router();

router.get('/', (req, res) => res.send('User Route'));

// @route:   GET api/users
// @desc:    Test route
// @access:  Public

// @route:   POST api/users
// @desc:    Create User
// @access:  Public

router.get('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email.').isEmail(),
    check('password', 'Please enter a password with six or more characters.').isLength({min: 6})
], async (req, res) => {});
    // Check if any validation errors
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure ou req
    const { name, email, password } = req.body

    try {
        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'User Already Exists'}] })
        }

        // create a user
        user = new User({
            name,
            email,
            password,
        })

        // Encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

    } catch (err) {
        console.error(err)
        res.status(500).json([{ msg: "Server Error"}])
    }
export default router;

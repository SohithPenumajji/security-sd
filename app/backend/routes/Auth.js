const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
require('dotenv').config();

const router = express.Router();



// Signup Route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const user = new User({
            username,
            password: hashedPassword,
        });

        // Save the new user
        await user.save();

        res.status(200).json({ message: 'Signup successful' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error creating user', error: err.message });
    }
});

const MAX_FAILED_ATTEMPTS = 3;
const LOCK_TIME = 3 * 60 * 1000; // 3 minutes in milliseconds

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the user is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000);
            return res.status(403).json({
                message: `Account is locked. Try again after ${remainingTime} seconds.`
            });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.failedAttempts += 1;

            if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
                user.lockUntil = new Date(Date.now() + LOCK_TIME);
                user.failedAttempts = 0; // Reset attempts after locking
            }

            await user.save();
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Reset failed attempts on successful login
        user.failedAttempts = 0;
        user.lockUntil = null;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authLayout = '../views/layouts/auth';

// GET /auth/login
router.get('/login', (req, res) => {
    res.render('admin/login', { locals: { title: 'Login' }, layout: authLayout });
});

// GET /auth/register
router.get('/register', (req, res) => {
    res.render('admin/register', { locals: { title: 'Register' }, layout: authLayout });
});

// POST /auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Simple check if user exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).send('User already exists');
        }

        const user = await User.create({ username, password });
        res.redirect('/auth/login');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET /auth/logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;

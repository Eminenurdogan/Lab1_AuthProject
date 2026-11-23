const express = require('express');
const register = require('../controllers/register');
const login = require('../controllers/login');
const { forgotPassword, resetPassword } = require('../controllers/password');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;

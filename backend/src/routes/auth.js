const express = require('express');
const register = require('../controllers/register');
const login = require('../controllers/login');
const { forgotPassword, resetPassword } = require('../controllers/password');
const requireAuth = require('../middleware/auth');
const db = require('../db');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/me', requireAuth, (req, res) => {
  const user = db.findUserById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
  }
  res.json({ id: user.id, name: user.name, email: user.email });
});

module.exports = router;

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { isValidEmail, isStrongPassword } = require('../utils/validators');

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 dakika

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function forgotPassword(req, res) {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Geçerli bir e-posta girin' });
  }

  const message = 'Bu e-posta kayıtlıysa sıfırlama bağlantısı gönderildi';
  const user = db.findUserByEmail(email.trim());
  if (!user) {
    return res.json({ message });
  }

  const token = crypto.randomBytes(24).toString('hex');
  db.updateUser(user.id, {
    resetTokenHash: hashToken(token),
    resetTokenExpires: Date.now() + TOKEN_TTL_MS,
  });

  // mail servisi yok, bağlantıyı konsola yazıyoruz
  const link = `http://localhost:5173/reset-password?email=${encodeURIComponent(user.email)}&token=${token}`;
  console.log(`[şifre sıfırlama] ${link}`);

  // testlerde token'a erişebilmek için
  if (process.env.NODE_ENV === 'test') {
    return res.json({ message, resetToken: token });
  }
  res.json({ message });
}

async function resetPassword(req, res, next) {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({ message: 'E-posta, token ve yeni şifre zorunlu' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: 'Şifre en az 8 karakter olmalı, harf ve rakam içermeli' });
    }

    const user = db.findUserByEmail(email.trim());
    if (!user || !user.resetTokenHash || user.resetTokenHash !== hashToken(token)) {
      return res.status(400).json({ message: 'Sıfırlama bağlantısı geçersiz' });
    }
    if (Date.now() > user.resetTokenExpires) {
      return res.status(400).json({ message: 'Sıfırlama bağlantısının süresi dolmuş, tekrar isteyin' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    db.updateUser(user.id, { passwordHash, resetTokenHash: null, resetTokenExpires: null });

    res.json({ message: 'Şifren güncellendi, yeni şifrenle giriş yapabilirsin' });
  } catch (err) {
    next(err);
  }
}

module.exports = { forgotPassword, resetPassword };

const crypto = require('crypto');
const db = require('../db');
const { isValidEmail } = require('../utils/validators');

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
  db.updateUser(user.id, { resetTokenHash: hashToken(token) });

  // mail servisi yok, bağlantıyı konsola yazıyoruz
  console.log(`[şifre sıfırlama] ${user.email}: http://localhost:5173/reset-password?token=${token}`);

  res.json({ message });
}

function resetPassword(req, res) {
  res.status(501).json({ message: 'Henüz hazır değil' });
}

module.exports = { forgotPassword, resetPassword };

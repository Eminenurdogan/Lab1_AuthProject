const crypto = require('crypto');
const db = require('../db');
const { isValidEmail, isStrongPassword } = require('../utils/validators');

module.exports = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Ad, e-posta ve şifre zorunlu' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Geçerli bir e-posta girin' });
  }
  if (!isStrongPassword(password)) {
    return res.status(400).json({ message: 'Şifre en az 8 karakter olmalı, harf ve rakam içermeli' });
  }

  const user = db.addUser({
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({ id: user.id, name: user.name, email: user.email });
};

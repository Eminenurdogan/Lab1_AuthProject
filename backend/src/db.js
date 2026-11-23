// Basit JSON dosyası tabanlı veri katmanı. Ders projesi için yeterli,
// gerçek projede yerine bir veritabanı gelmeli.
const fs = require('fs');
const path = require('path');

const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'db.json');

function read() {
  if (!fs.existsSync(DB_FILE)) {
    return { users: [] };
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function write(data) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function findUserByEmail(email) {
  return read().users.find((u) => u.email === email.toLowerCase());
}

function findUserById(id) {
  return read().users.find((u) => u.id === id);
}

function addUser(user) {
  const data = read();
  data.users.push(user);
  write(data);
  return user;
}

function updateUser(id, changes) {
  const data = read();
  const user = data.users.find((u) => u.id === id);
  if (!user) return null;
  Object.assign(user, changes);
  write(data);
  return user;
}

module.exports = { findUserByEmail, findUserById, addUser, updateUser };

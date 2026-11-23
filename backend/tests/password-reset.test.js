const { test, after } = require('node:test');
const assert = require('node:assert');
const { useTempDb } = require('./helpers');

const cleanup = useTempDb();
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

const user = { name: 'Ayşe', email: 'ayse@ornek.com', password: 'eskiSifre1' };
const newPassword = 'yeniSifre2';

after(cleanup);

async function requestToken(email) {
  const res = await request(app).post('/api/auth/forgot-password').send({ email });
  assert.strictEqual(res.status, 200);
  return res.body.resetToken;
}

test('kullanıcı oluşturuluyor', async () => {
  const res = await request(app).post('/api/auth/register').send(user);
  assert.strictEqual(res.status, 201);
});

test('kayıtlı olmayan e-posta için de aynı cevap dönüyor', async () => {
  const res = await request(app).post('/api/auth/forgot-password').send({ email: 'kimse@ornek.com' });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.resetToken, undefined);
});

test('yanlış token ile şifre değiştirilemiyor', async () => {
  await requestToken(user.email);
  const res = await request(app)
    .post('/api/auth/reset-password')
    .send({ email: user.email, token: 'uydurma-token', password: newPassword });
  assert.strictEqual(res.status, 400);
});

test('süresi dolmuş token reddediliyor', async () => {
  const token = await requestToken(user.email);
  const stored = db.findUserByEmail(user.email);
  db.updateUser(stored.id, { resetTokenExpires: Date.now() - 1000 });

  const res = await request(app)
    .post('/api/auth/reset-password')
    .send({ email: user.email, token, password: newPassword });
  assert.strictEqual(res.status, 400);
});

test('tam akış: token al, şifreyi değiştir, yeni şifreyle giriş yap', async () => {
  const token = await requestToken(user.email);

  const reset = await request(app)
    .post('/api/auth/reset-password')
    .send({ email: user.email, token, password: newPassword });
  assert.strictEqual(reset.status, 200);

  const oldLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: user.email, password: user.password });
  assert.strictEqual(oldLogin.status, 401);

  const newLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: user.email, password: newPassword });
  assert.strictEqual(newLogin.status, 200);

  // aynı token ikinci kez kullanılamamalı
  const again = await request(app)
    .post('/api/auth/reset-password')
    .send({ email: user.email, token, password: 'baskaSifre3' });
  assert.strictEqual(again.status, 400);
});

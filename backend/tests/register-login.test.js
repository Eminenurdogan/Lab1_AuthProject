const { test, after } = require('node:test');
const assert = require('node:assert');
const { useTempDb } = require('./helpers');

const cleanup = useTempDb();
const request = require('supertest');
const app = require('../src/app');

const user = { name: 'Test Kullanıcı', email: 'test@ornek.com', password: 'sifre1234' };

after(cleanup);

test('geçerli bilgilerle kayıt olunabiliyor', async () => {
  const res = await request(app).post('/api/auth/register').send(user);
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.email, user.email);
  assert.ok(!('passwordHash' in res.body), 'şifre hash cevapta dönmemeli');
});

test('aynı e-posta ile ikinci kayıt reddediliyor', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ ...user, email: 'TEST@ornek.com' });
  assert.strictEqual(res.status, 409);
});

test('eksik veya hatalı alanlarla kayıt reddediliyor', async () => {
  let res = await request(app).post('/api/auth/register').send({ email: 'a@b.com' });
  assert.strictEqual(res.status, 400);

  res = await request(app).post('/api/auth/register').send({ ...user, email: 'gecersiz-mail' });
  assert.strictEqual(res.status, 400);

  res = await request(app).post('/api/auth/register').send({ ...user, email: 'x@y.com', password: '123' });
  assert.strictEqual(res.status, 400);
});

test('doğru şifreyle giriş yapılıp token alınıyor', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: user.email, password: user.password });
  assert.strictEqual(res.status, 200);
  assert.ok(res.body.token);
  assert.strictEqual(res.body.user.name, user.name);
});

test('yanlış şifreyle giriş reddediliyor', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: user.email, password: 'yanlis1234' });
  assert.strictEqual(res.status, 401);
});

test('kayıtlı olmayan kullanıcı giriş yapamıyor', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'yok@ornek.com', password: 'sifre1234' });
  assert.strictEqual(res.status, 401);
});

test('token ile /me bilgisi alınıyor, token olmadan alınamıyor', async () => {
  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: user.email, password: user.password });

  const ok = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${login.body.token}`);
  assert.strictEqual(ok.status, 200);
  assert.strictEqual(ok.body.email, user.email);

  const fail = await request(app).get('/api/auth/me');
  assert.strictEqual(fail.status, 401);
});

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../api';

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Ad soyad boş bırakılamaz';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Geçerli bir e-posta adresi girin';
  }
  if (form.password.length < 8) {
    errors.password = 'Şifre en az 8 karakter olmalı';
  } else if (!/[a-zA-Z]/.test(form.password) || !/\d/.test(form.password)) {
    errors.password = 'Şifre hem harf hem rakam içermeli';
  }
  if (form.password !== form.passwordAgain) {
    errors.passwordAgain = 'Şifreler eşleşmiyor';
  }

  return errors;
}

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordAgain: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const result = validate(form);
    setErrors(result);
    if (Object.keys(result).length > 0) return;

    setLoading(true);
    try {
      await post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <form className="card" onSubmit={handleSubmit} noValidate>
        <h2>Kayıt Ol</h2>

        {serverError && <div className="alert error">{serverError}</div>}

        <div className="field">
          <label htmlFor="name">Ad Soyad</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>

        <div className="field">
          <label htmlFor="email">E-posta</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="field">
          <label htmlFor="password">Şifre</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        <div className="field">
          <label htmlFor="passwordAgain">Şifre (tekrar)</label>
          <input
            id="passwordAgain"
            name="passwordAgain"
            type="password"
            value={form.passwordAgain}
            onChange={handleChange}
          />
          {errors.passwordAgain && <div className="error">{errors.passwordAgain}</div>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
        </button>

        <div className="links">
          Hesabın var mı? <Link to="/login">Giriş yap</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;

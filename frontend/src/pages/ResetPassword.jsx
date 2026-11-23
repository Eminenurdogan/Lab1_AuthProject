import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { post } from '../api';

function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get('email') || '';
  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!email || !token) {
    return (
      <div className="page">
        <div className="card">
          <h2>Geçersiz bağlantı</h2>
          <p>Şifre sıfırlama bağlantısı eksik ya da hatalı.</p>
          <div className="links">
            <Link to="/forgot-password">Yeni bağlantı iste</Link>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError('Şifre en az 8 karakter olmalı, harf ve rakam içermeli');
      return;
    }
    if (password !== passwordAgain) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);
    try {
      const data = await post('/auth/reset-password', { email, token, password });
      setSuccess(data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <form className="card" onSubmit={handleSubmit} noValidate>
        <h2>Yeni Şifre Belirle</h2>
        <p style={{ fontSize: 14, color: '#555', marginTop: -8 }}>{email}</p>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <div className="field">
          <label htmlFor="password">Yeni şifre</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="passwordAgain">Yeni şifre (tekrar)</label>
          <input
            id="passwordAgain"
            type="password"
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading || !!success}>
          {loading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;

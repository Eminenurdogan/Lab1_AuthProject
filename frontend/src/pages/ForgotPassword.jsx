import { useState } from 'react';
import { Link } from 'react-router-dom';
import { post } from '../api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Geçerli bir e-posta adresi girin');
      return;
    }

    setLoading(true);
    try {
      const data = await post('/auth/forgot-password', { email });
      setInfo(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <form className="card" onSubmit={handleSubmit} noValidate>
        <h2>Şifremi Unuttum</h2>
        <p className="hint">
          Kayıtlı e-posta adresini gir, sana şifre sıfırlama bağlantısı gönderelim.
        </p>

        {error && <div className="alert error">{error}</div>}
        {info && <div className="alert success">{info}</div>}

        <div className="field">
          <label htmlFor="email">E-posta</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Gönderiliyor...' : 'Bağlantı Gönder'}
        </button>

        <div className="links">
          <Link to="/login">Giriş ekranına dön</Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;

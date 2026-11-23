import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Login() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('E-posta ve şifre alanları boş bırakılamaz');
      return;
    }
  }

  return (
    <div className="page">
      <form className="card" onSubmit={handleSubmit} noValidate>
        <h2>Giriş Yap</h2>

        {location.state?.registered && (
          <div className="alert success">Kayıt başarılı, şimdi giriş yapabilirsin.</div>
        )}
        {error && <div className="alert error">{error}</div>}

        <div className="field">
          <label htmlFor="email">E-posta</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="password">Şifre</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button type="submit">Giriş Yap</button>

        <div className="links">
          <Link to="/forgot-password">Şifremi unuttum</Link>
          <br />
          Hesabın yok mu? <Link to="/register">Kayıt ol</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;

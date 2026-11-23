import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordAgain: '' });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(form);
  }

  return (
    <div className="page">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Kayıt Ol</h2>

        <div className="field">
          <label htmlFor="name">Ad Soyad</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="email">E-posta</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="password">Şifre</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
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
        </div>

        <button type="submit">Kayıt Ol</button>

        <div className="links">
          Hesabın var mı? <Link to="/login">Giriş yap</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;

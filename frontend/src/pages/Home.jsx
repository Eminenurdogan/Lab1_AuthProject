import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    return (
      <div className="page">
        <div className="card">
          <p>Önce giriş yapmalısın.</p>
          <button onClick={() => navigate('/login')}>Giriş sayfasına git</button>
        </div>
      </div>
    );
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div className="page">
      <div className="card">
        <h2>Hoş geldin, {user.name}</h2>
        <p>{user.email} hesabıyla giriş yaptın.</p>
        <button onClick={logout}>Çıkış yap</button>
      </div>
    </div>
  );
}

export default Home;

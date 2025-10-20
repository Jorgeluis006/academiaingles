import React, { useState } from 'react';

function Login() {
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/php/login.php', {
        method: 'POST',
        body: new URLSearchParams({ nombre, codigo }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/admin';
      } else {
        setError(data.msg || 'Error de login');
      }
    } catch {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="login-container">
      <h2>Login Admin</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label>Nombre</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Código</label>
          <input type="password" value={codigo} onChange={e => setCodigo(e.target.value)} required />
        </div>
        {error && <div className="login-error">{error}</div>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;

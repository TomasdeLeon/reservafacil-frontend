import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { UserContext } from '../context/UserContext'; // 👈 Importamos el contexto

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const { login } = useContext(UserContext); // 👈 Obtenemos la función login del contexto

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios/login`, form);
      const usuario = response.data;

      login(usuario); // ✅ Llama al login del contexto, guarda localStorage y actualiza estado

      setMensaje('✅ Sesión iniciada');
      navigate('/');
    } catch (error) {
      setMensaje('❌ Email o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <img
        src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
        alt="Login"
        className="login-icono"
      />
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}

      <Link to="/" className="volver-inicio">← Volver al inicio</Link>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        ¿No tenés cuenta? <Link to="/registro" className="link-formulario">Registrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;

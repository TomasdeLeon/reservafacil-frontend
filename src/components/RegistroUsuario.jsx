import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './RegistroUsuario.css';
import { UserContext } from '../context/UserContext'; // 👈 Importamos el contexto

const RegistroUsuario = () => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const { login } = useContext(UserContext); // 👈 Obtenemos login del contexto
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'Nombre requerido';
    if (!form.apellido.trim()) errs.apellido = 'Apellido requerido';
    if (!form.email.includes('@')) errs.email = 'Email inválido';
    if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = validar();
    if (Object.keys(val).length > 0) {
      setErrores(val);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios/registro`, form);
      const nuevoUsuario = response.data;

      login(nuevoUsuario); // ✅ guarda el usuario en contexto + localStorage
      setMensaje('✅ Usuario registrado correctamente');
      navigate('/'); // Redirigimos al home
    } catch (err) {
      setMensaje('❌ Error al registrar: ' + err.response?.data?.message);
    }
  };

  return (
    <div className="registro-container">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png"
        alt="Registro"
        className="registro-icono"
      />
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="agregar-producto-form">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        {errores.nombre && <span>{errores.nombre}</span>}

        <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} />
        {errores.apellido && <span>{errores.apellido}</span>}

        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        {errores.email && <span>{errores.email}</span>}

        <input name="password" placeholder="Contraseña" type="password" value={form.password} onChange={handleChange} />
        {errores.password && <span>{errores.password}</span>}

        <button type="submit">Registrarse</button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <Link to="/" className="volver-inicio">← Volver al inicio</Link>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        ¿Ya tenés cuenta? <Link to="/login" className="link-formulario">Iniciá sesión aquí</Link>
      </p>
    </div>
  );
};

export default RegistroUsuario;

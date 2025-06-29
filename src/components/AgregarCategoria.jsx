import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './AgregarCategoria.css';

const AgregarCategoria = () => {
  const { usuario } = useContext(UserContext);

  const [categoria, setCategoria] = useState({
    titulo: '',
    descripcion: '',
    imagenUrl: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    setCategoria({ ...categoria, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const err = {};
    if (!categoria.titulo.trim()) err.titulo = '⚠️ El título es obligatorio.';
    if (!categoria.descripcion.trim()) err.descripcion = '⚠️ La descripción es obligatoria.';
    if (categoria.imagenUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/.test(categoria.imagenUrl)) {
      err.imagenUrl = '⚠️ La URL de imagen no es válida.';
    }
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const val = validar();
    if (Object.keys(val).length > 0) {
      setErrores(val);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/categorias`, categoria);
      setMensaje('✅ Categoría agregada correctamente');
      setCategoria({ titulo: '', descripcion: '', imagenUrl: '' });
      setErrores({});
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      setMensaje('❌ Error al agregar categoría');
    }
  };

  // 🔒 Si no hay usuario logueado
  if (!usuario) {
    return (
      <div className="agregar-categoria-container">
        <div className="agregar-categoria-card">
          <p>⚠️ Iniciá sesión para agregar categorías.</p>
          <Link to="/login" className="volver-inicio">Iniciar sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="agregar-categoria-container">
      <div className="agregar-categoria-card">
        <h2>Agregar Categoría</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={categoria.titulo}
            onChange={handleChange}
            required
          />
          {errores.titulo && <span className="error-text">{errores.titulo}</span>}

          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={categoria.descripcion}
            onChange={handleChange}
            required
          />
          {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}

          <input
            type="text"
            name="imagenUrl"
            placeholder="URL de imagen"
            value={categoria.imagenUrl}
            onChange={handleChange}
          />
          {errores.imagenUrl && <span className="error-text">{errores.imagenUrl}</span>}

          <button type="submit">Guardar categoría</button>
        </form>
        {mensaje && <p className="agregar-categoria-mensaje">{mensaje}</p>}
        <Link to="/" className="volver-inicio">← Volver al inicio</Link>
      </div>
    </div>
  );
};

export default AgregarCategoria;

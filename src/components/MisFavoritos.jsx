import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import './MisFavoritos.css'; // Podés copiar estilos de MisProductos.css o ProductList.css

const MisFavoritos = () => {
  const { usuario } = useContext(UserContext);
  const [favoritos, setFavoritos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (usuario) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/favoritos/${usuario.id}`)
        .then((res) => {
          const productos = res.data.map((f) => f.producto);
          setFavoritos(productos);
        })
        .catch((err) => console.error('Error al obtener favoritos:', err));
    }
  }, [usuario]);

  const quitarFavorito = async (productoId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/favoritos`, {
        params: { usuarioId: usuario.id, productoId },
      });
      setFavoritos((prev) => prev.filter((p) => p.id !== productoId));
      setMensaje('✅ Producto eliminado de favoritos');
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error al quitar favorito:', err);
      setMensaje('❌ No se pudo quitar el favorito');
    }
  };

  if (!usuario) {
    return (
      <div className="mis-favoritos-container">
        <p>⚠️ Iniciá sesión para ver tus favoritos.</p>
        <Link to="/login" className="btn-volver">Iniciar sesión</Link>
      </div>
    );
  }

  return (
    <div className="mis-favoritos-container">
      <h2>⭐ Mis Favoritos</h2>
      {mensaje && <p className="mensaje-favorito">{mensaje}</p>}

      {favoritos.length === 0 ? (
        <p>No tenés productos marcados como favoritos.</p>
      ) : (
        <div className="favoritos-grid">
          {favoritos.map((p) => (
            <div key={p.id} className="favorito-card">
              <img src={p.imagenUrl} alt={p.nombre} />
              <h3>{p.nombre}</h3>
              <p>{p.descripcion}</p>
              <button onClick={() => quitarFavorito(p.id)}>Quitar favorito</button>
              <Link to={`/producto/${p.id}`}>
                <button className="btn-detalle">Ver detalle</button>
              </Link>
            </div>
          ))}
        </div>
      )}

      <Link to="/" className="btn-volver">← Volver al inicio</Link>
    </div>
  );
};

export default MisFavoritos;

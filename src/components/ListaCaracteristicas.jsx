import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListaCaracteristicas.css';

const ListaCaracteristicas = () => {
  const [caracteristicas, setCaracteristicas] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/caracteristicas`)
      .then((res) => setCaracteristicas(res.data))
      .catch((err) => console.error('Error al cargar características:', err));
  }, []);

  return (
    <div className="caracteristicas-lista">
      <h2>Características registradas</h2>
      <div className="grid-caracteristicas">
        {caracteristicas.map((c) => (
          <div key={c.id} className="caracteristica-card">
            <span className="caracteristica-icono">{c.icono}</span>
            <span>{c.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaCaracteristicas;

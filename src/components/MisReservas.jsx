import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './MisReservas.css';
import { UserContext } from '../context/UserContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const MisReservas = () => {
  const { usuario } = useContext(UserContext);
  const [reservas, setReservas] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (usuario) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/reservas/usuario/${usuario.id}`)
        .then((res) => setReservas(res.data))
        .catch((err) => console.error('Error al obtener reservas:', err));
    }
  }, [usuario]);

  const cancelarReserva = async (id) => {
    const confirmar = window.confirm('¿Seguro que querés cancelar esta reserva?');
    if (!confirmar) return;
  
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/reservas/${id}`);
      setReservas((prev) => prev.filter((r) => r.id !== id));
      setMensaje('✅ Reserva cancelada correctamente');
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error al cancelar reserva:', err);
      setMensaje('❌ No se pudo cancelar la reserva');
    }
  };

  if (!usuario) {
    return (
      <div className="mis-reservas-container">
        <p>⚠️ Debés iniciar sesión para ver tus reservas.</p>
        <Link to="/login" className="btn-volver">Iniciar sesión</Link>
      </div>
    );
  }

  return (
    <div className="mis-reservas-container">
      <h2>Mis reservas</h2>
  
      {mensaje && <p className="mensaje-reserva">{mensaje}</p>}
  
      {reservas.length === 0 ? (
        <p>No tenés reservas registradas.</p>
      ) : (
        <ul className="lista-reservas">
          {reservas.map((r) => {
            const fechaInicio = new Date(r.fechaInicio);
            fechaInicio.setHours(0, 0, 0, 0);
  
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
  
            const sePuedeCancelar = fechaInicio >= hoy;
  
            return (
              <li key={r.id} className="reserva-item">
                <h3>{r.producto.nombre}</h3>
                <p>{r.producto.descripcion}</p>
                <img src={r.producto.imagenUrl} alt={r.producto.nombre} />
                <p>
                  🗓️ {format(new Date(r.fechaInicio), 'dd/MM/yyyy')} → {format(new Date(r.fechaFin), 'dd/MM/yyyy')}
                </p>
                {sePuedeCancelar ? (
                  <button onClick={() => cancelarReserva(r.id)} className="btn-cancelar">
                    Cancelar reserva
                  </button>
                ) : (
                  <p className="no-cancelable">
                    ⚠️ Esta reserva ya comenzó y no se puede cancelar.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
  
      <Link to="/" className="btn-volver">← Volver al inicio</Link>
    </div>
  );

};

export default MisReservas;

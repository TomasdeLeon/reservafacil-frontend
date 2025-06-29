import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ReservasPorProducto.css';

const ReservasPorProducto = () => {
  const { id } = useParams(); // ID del producto desde la URL
  const [reservas, setReservas] = useState([]);
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resReservas, resProducto] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/reservas/producto/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/productos/${id}`)
        ]);
        setReservas(resReservas.data);
        setProducto(resProducto.data);
        setCargando(false);
      } catch (error) {
        console.error('Error al obtener reservas o producto:', error);
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  if (cargando) return <p>Cargando reservas...</p>;

  return (
    <div className="reservas-producto-container">
      <h2>Reservas de: {producto?.nombre}</h2>

      {reservas.length === 0 ? (
        <p>No hay reservas para este producto.</p>
      ) : (
        <ul className="reservas-lista">
          {reservas.map((reserva) => (
            <li key={reserva.id} className="reserva-item">
              <p><strong>Desde:</strong> {reserva.fechaInicio}</p>
              <p><strong>Hasta:</strong> {reserva.fechaFin}</p>
              <p><strong>Reservado por:</strong> {reserva.usuario?.nombre} ({reserva.usuario?.email})</p>
            </li>
          ))}
        </ul>
      )}

      <Link to="/" className="btn-volver">← Volver al inicio</Link>
    </div>
  );
};

export default ReservasPorProducto;

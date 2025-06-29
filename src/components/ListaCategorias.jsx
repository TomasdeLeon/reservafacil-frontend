import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './ListaCategorias.css';

const ListaCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const { usuario } = useContext(UserContext);

  const cargarCategorias = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categorias`);
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  return (
    <div className="categorias-container">
      <h2>Categorías disponibles</h2>

      {usuario && (
        <Link to="/categorias/nueva" className="boton-agregar">
          ➕ Agregar categoría
        </Link>
      )}

      <div className="categorias-grid">
        {categorias.length > 0 ? (
          categorias.map((cat) => (
            <div key={cat.id} className="categoria-card">
                <Link to={`/categorias/${cat.id}/productos`} className="categoria-card">
                  <img src={cat.imagenUrl} alt={cat.titulo} />
                  <h3>{cat.titulo}</h3>
                  <p>{cat.descripcion}</p>
                </Link>
            </div>
          ))
        ) : (
          <p>No hay categorías disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default ListaCategorias;

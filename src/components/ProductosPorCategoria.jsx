import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './ProductList.css'; // reutiliza el estilo

const ProductosPorCategoria = () => {
  const { categoriaId } = useParams();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/productos/categoria/${categoriaId}`)
      .then((res) => setProductos(res.data))
      .catch((err) => console.error('Error al cargar productos:', err));
  }, [categoriaId]);

  return (
    <div className="producto-listado">
      <h2>Productos por Categoría</h2>
      <Link to="/categorias" className="volver-inicio">← Volver a categorías</Link>
      <div className="producto-grid">
        {productos.length > 0 ? (
          productos.map((p) => (
            <div key={p.id} className="producto-card">
              <h3>{p.nombre}</h3>
              <p>{p.descripcion}</p>
              {p.imagenUrl && <img src={p.imagenUrl} alt={p.nombre} />}
            </div>
          ))
        ) : (
          <p>No hay productos en esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default ProductosPorCategoria;

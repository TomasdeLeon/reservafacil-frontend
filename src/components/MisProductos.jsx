import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './MisProductos.css';

const MisProductos = () => {
  const { usuario } = useContext(UserContext);
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (usuario) {
      cargarMisProductos();
    }
  }, [usuario]);

  const cargarMisProductos = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/productos`)
      .then(res => {
        const productosUsuario = res.data.filter(
          (p) => p.usuario?.email === usuario.email
        );
        setProductos(productosUsuario);
      })
      .catch(err => console.error('Error al cargar productos:', err));
  };

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm('¿Seguro que querés eliminar este producto?');
    if (!confirmar) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/productos/${id}`);
      setMensaje('✅ Producto eliminado correctamente');
      cargarMisProductos();
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('❌ No se pudo eliminar el producto');
    }
  };

  if (!usuario) {
    return <p>⚠️ Tenés que iniciar sesión para ver tus productos.</p>;
  }

  return (
    <div className="mis-productos-container">
      <h2>🛎️ Mis Productos</h2>
      {mensaje && <p className="mensaje-producto">{mensaje}</p>}
      {productos.length > 0 ? (
        <div className="mis-productos-grid">
          {productos.map((producto) => (
            <div key={producto.id} className="mis-producto-card">
              <img src={producto.imagenUrl} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <div className="botones-producto">
                <Link to={`/producto/editar/${producto.id}`}>
                  <button className="btn-editar">Editar</button>
                </Link>
                <button className="btn-eliminar" onClick={() => eliminarProducto(producto.id)}>
                  Eliminar
                </button>
                <Link to={`/producto/${producto.id}`}>
                  <button className="btn-detalle">Ver detalle</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No tenés productos publicados aún.</p>
      )}
    </div>
  );
};

export default MisProductos;



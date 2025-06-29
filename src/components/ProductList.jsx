import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import './ProductList.css';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProductList = ({ filtro = '', productosProp = null }) => {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const { usuario } = useContext(UserContext);
  const [favoritos, setFavoritos] = useState([])

  // Cargar productos
  useEffect(() => {
    if (Array.isArray(productosProp) && productosProp.length > 0) {
      setProductos(productosProp);
    } else {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/productos`)
        .then((response) => {
          setProductos(response.data || []);
        })
        .catch((error) => {
          console.error('Error al cargar productos:', error);
          setProductos([]);
        });
    }
  
    // Si hay usuario, cargamos sus favoritos
    if (usuario) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/favoritos/${usuario.id}`)
        .then((res) => {
          const ids = res.data.map((f) => f.producto.id);
          setFavoritos(ids);
        })
        .catch((err) => console.error('Error al cargar favoritos:', err));
    }
  }, [productosProp, usuario]);

  const eliminarProducto = (id) => {
    const confirmar = window.confirm('¿Estás seguro de que querés eliminar este producto?');
    if (!confirmar) return;

    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/productos/${id}`)
      .then(() => {
        setProductos((prev) => prev.filter((p) => p.id !== id));
        setMensaje('✅ Producto eliminado correctamente');
        setTimeout(() => setMensaje(''), 3000);
      })
      .catch((error) => {
        console.error('Error al eliminar producto:', error);
        alert('❌ No se pudo eliminar el producto');
      });
  };

  const obtenerAleatorios = (lista, max) => {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia.slice(0, max);
  };


  // Filtrar por texto solo si viene desde la API
  const productosFiltrados = !filtro
  ? productos // sin filtro, mostrar todos
  : productos.filter((p) =>
      (p.nombre?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
      (p.descripcion?.toLowerCase() || '').includes(filtro.toLowerCase())
    );

  const toggleFavorito = async (productoId) => {
    if (!usuario) return;
  
    const yaEsFavorito = favoritos.includes(productoId);
  
    try {
      if (yaEsFavorito) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/favoritos`, {
          params: { usuarioId: usuario.id, productoId },
        });
        setFavoritos((prev) => prev.filter((id) => id !== productoId));
      } else {
        console.log("Intentando agregar favorito:", {
          usuario: { id: usuario?.id },
          producto: { id: productoId },
        });
        await axios.post(`${import.meta.env.VITE_API_URL}/api/favoritos`, {
          usuario: { id: usuario.id },
          producto: { id: productoId },
        });
        setFavoritos((prev) => [...prev, productoId]);
      }
    } catch (err) {
      console.error("Error al modificar favorito:", err);
    }
  };

  return (
    <div>
      <h2>Productos disponibles</h2>
      <br />
      {mensaje && <p className="mensaje-producto">{mensaje}</p>}

      {productosFiltrados.length > 0 ? (
        <div className="producto-grid">
          {obtenerAleatorios(productosFiltrados, 20).map((producto) => (
            <div key={producto.id} className="producto-card">
              <Link
                to={`/producto/${producto.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <h3>
                  {producto.nombre}{' '}
                  {usuario && (
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Evita que se dispare el Link
                        toggleFavorito(producto.id);
                      }}
                      className="btn-fav"
                    >
                      {favoritos.includes(producto.id) ? '⭐' : '☆'}
                    </button>
                  )}
                </h3>
                <p>{producto.descripcion}</p>
                <img
                  src={producto.imagenUrl || '/no-image.png'}
                  alt={producto.nombre}
                  className={`producto-img ${producto.imagenUrl ? "" : "placeholder"}`}
                />
                {producto.usuario && (
                  <p className="creado-por">
                    Creado por: <strong>{producto.usuario.nombre}</strong>
                  </p>
                )}
              </Link>

              {usuario && (usuario.id === producto.usuario?.id || usuario.rol === 'ADMIN') && (
                <div className="botones-producto">
                  <Link to={`/producto/editar/${producto.id}`}>
                    <button className="btn-editar">Editar</button>
                  </Link>
                  <button className="btn-eliminar" onClick={() => eliminarProducto(producto.id)}>
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No hay productos que coincidan con la búsqueda.</p>
      )}
    </div>
  );
};

export default ProductList;



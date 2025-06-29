import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AgregarProducto.css';
import { UserContext } from '../context/UserContext';

const AgregarProducto = () => {
  const { usuario } = useContext(UserContext);

  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    imagenUrl: '',
    categoriaId: '',
  });

  const [categorias, setCategorias] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState([]);

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  /* ---------- Cargar data ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, caracts] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/categorias`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/caracteristicas`),
        ]);
        setCategorias(cats.data);
        setCaracteristicas(caracts.data);
      } catch (err) {
        console.error('Error al cargar catálogo:', err);
      }
    };
    fetchData();
  }, []);

  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const toggleCaracteristica = (id) => {
    setCaracteristicasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  /* ---------- Validaciones ---------- */
  const validar = () => {
    const err = {};
    if (!producto.nombre.trim() || producto.nombre.length < 3)
      err.nombre = '⚠️ Ingresá al menos 3 caracteres.';
    if (!producto.descripcion.trim() || producto.descripcion.length < 10)
      err.descripcion = '⚠️ Ingresá al menos 10 caracteres.';
    if (!producto.categoriaId) err.categoriaId = '⚠️ Seleccioná una categoría.';

    if (producto.imagenUrl) {
      const regex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i;
      if (!regex.test(producto.imagenUrl))
        err.imagenUrl = '⚠️ URL de imagen inválida.';
    }

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validar();
    setErrores(err);

    if (Object.keys(err).length > 0) return;

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/productos`,
        {
          nombre: producto.nombre.trim(),
          descripcion: producto.descripcion.trim(),
          imagenUrl: producto.imagenUrl.trim() || null, // ← null = imagen por defecto
          categoria: { id: parseInt(producto.categoriaId) },
          caracteristicas: caracteristicasSeleccionadas.map((id) => ({ id })),
        },
        { headers: { 'X-User-Email': usuario.email } }
      );

      setMensaje('✅ Producto agregado correctamente');
      setProducto({ nombre: '', descripcion: '', imagenUrl: '', categoriaId: '' });
      setCaracteristicasSeleccionadas([]);
    } catch (err) {
      console.error('Error al agregar:', err);
      setMensaje('❌ No se pudo guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Render ---------- */
  if (!usuario) {
    return (
      <div className="agregar-producto-container">
        <div className="agregar-producto-card">
          <p>⚠️ Debés iniciar sesión para agregar productos.</p>
          <Link to="/login" className="volver-inicio">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="agregar-producto-container">
      <div className="agregar-producto-card">
        <h2>Agregar Producto</h2>

        <form onSubmit={handleSubmit} className="agregar-producto-form" noValidate>
          {/* Nombre */}
          <input
            name="nombre"
            placeholder="Nombre"
            value={producto.nombre}
            onChange={handleChange}
            className={errores.nombre ? 'error' : ''}
          />
          {errores.nombre && <span className="error-text">{errores.nombre}</span>}

          {/* Descripción */}
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={producto.descripcion}
            onChange={handleChange}
            className={errores.descripcion ? 'error' : ''}
          />
          {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}

          {/* Imagen */}
          <input
            name="imagenUrl"
            placeholder="URL de imagen (opcional)"
            value={producto.imagenUrl}
            onChange={handleChange}
            className={errores.imagenUrl ? 'error' : ''}
          />
          {errores.imagenUrl && <span className="error-text">{errores.imagenUrl}</span>}

          {/* Categoría */}
          <select
            name="categoriaId"
            value={producto.categoriaId}
            onChange={handleChange}
            className={errores.categoriaId ? 'error' : ''}
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.titulo}
              </option>
            ))}
          </select>
          {errores.categoriaId && <span className="error-text">{errores.categoriaId}</span>}

          {/* Características */}
          <div className="caracteristicas-checkboxes">
            <h4>Características:</h4>
            {caracteristicas.map((c) => (
              <label key={c.id}>
                <input
                  type="checkbox"
                  value={c.id}
                  checked={caracteristicasSeleccionadas.includes(c.id)}
                  onChange={() => toggleCaracteristica(c.id)}
                />
                {c.icono} {c.nombre}
              </label>
            ))}
          </div>

          <button type="submit" disabled={loading || Object.keys(errores).length > 0}>
            {loading ? 'Guardando…' : 'Guardar producto'}
          </button>
        </form>

        {mensaje && <p className="agregar-producto-mensaje">{mensaje}</p>}
      </div>
    </div>
  );
};

export default AgregarProducto;


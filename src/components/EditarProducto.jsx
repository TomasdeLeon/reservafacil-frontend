import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditarProducto.css';
import { UserContext } from '../context/UserContext';

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(UserContext);

  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    imagenUrl: '',
    categoria: { id: '' },
    caracteristicas: []
  });

  const [categorias, setCategorias] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Cargar datos del producto
    axios.get(`${import.meta.env.VITE_API_URL}/api/productos/${id}`)
      .then(res => {
        setProducto(res.data);
      });

    // Cargar categorías y características
    axios.get(`${import.meta.env.VITE_API_URL}/api/categorias`)
      .then(res => setCategorias(res.data));

    axios.get(`${import.meta.env.VITE_API_URL}/api/caracteristicas`)
      .then(res => setCaracteristicas(res.data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categoria') {
      setProducto({ ...producto, categoria: { id: value } });
    } else {
      setProducto({ ...producto, [name]: value });
    }
  };

  const handleCheckbox = (e) => {
    const idCaracteristica = parseInt(e.target.value);
    const yaMarcado = Array.isArray(producto.caracteristicas) && producto.caracteristicas.some(c => c.id === idCaracteristica);

    if (yaMarcado) {
      setProducto({
        ...producto,
        caracteristicas: producto.caracteristicas.filter(c => c.id !== idCaracteristica)
      });
    } else {
      setProducto({
        ...producto,
        caracteristicas: [ ...(producto.caracteristicas || []), { id: idCaracteristica } ]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/productos/${id}`, producto);
      setMensaje('✅ Producto actualizado');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al actualizar producto');
    }
  };

  return (
    <div className="editar-producto-container">
      <div className="editar-producto-card">
        <h2>Editar Producto</h2>
        <form onSubmit={handleSubmit} className="editar-producto-form">
          <input type="text" name="nombre" value={producto.nombre} onChange={handleChange} placeholder="Nombre" />
          <textarea name="descripcion" value={producto.descripcion} onChange={handleChange} placeholder="Descripción" />
          <input type="text" name="imagenUrl" value={producto.imagenUrl} onChange={handleChange} placeholder="Imagen URL" />

          <select name="categoria" value={producto.categoria.id} onChange={handleChange}>
            <option value="">Seleccionar categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.titulo}</option>
            ))}
          </select>

          <div className="caracteristicas-checkboxes">
            <p>Características:</p>
            {caracteristicas.map((c) => (
              <label key={c.id}>
                <input
                  type="checkbox"
                  value={c.id}
                  checked={producto.caracteristicas?.some((carac) => carac.id === c.id) || false}
                  onChange={handleCheckbox}
                />
                {c.icono} {c.nombre}
              </label>
            ))}
          </div>

          <button type="submit">Guardar Cambios</button>
        </form>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
};

export default EditarProducto;

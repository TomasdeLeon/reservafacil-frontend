import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './GestionUsuarios.css';
import { UserContext } from '../context/UserContext';

const GestionUsuarios = () => {
  const { usuario } = useContext(UserContext);
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (usuario?.rol === 'ADMIN') {
      cargarUsuarios();
    }
  }, [usuario]);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`);
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  };

  const cambiarRol = async (id, nuevoRol) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}/rol`, { rol: nuevoRol });
      setMensaje(`✅ Rol actualizado a ${nuevoRol}`);
      cargarUsuarios();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error al cambiar rol:', err);
      setMensaje('❌ No se pudo actualizar el rol');
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombre} ${u.apellido}`.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  if (!usuario || usuario.rol !== 'ADMIN') {
    return <p className="acceso-denegado">Acceso denegado ⛔</p>;
  }

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este usuario?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}`);
      setUsuarios(prev => prev.filter(u => u.id !== id));
      setMensaje('✅ Usuario eliminado');
    } catch (err) {
      if (err.response?.status === 409) {
        setMensaje('⚠️ El usuario tiene reservas/productos y no se puede eliminar.');
      } else {
        setMensaje('❌ Error inesperado al eliminar');
      }
    } finally {
      setTimeout(() => setMensaje(''), 4000);
    }
  };

  return (
    <div className="gestion-usuarios-container">
      <h2>Gestión de Usuarios</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="input-busqueda"
      />

      {mensaje && <p className="mensaje-usuarios">{mensaje}</p>}

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre} {u.apellido}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
              <td>
                {u.rol === 'USUARIO' ? (
                  <button className="btn-asignar" onClick={() => cambiarRol(u.id, 'ADMIN')}>
                    Hacer admin
                  </button>
                ) : (
                  <button className="btn-quitar" onClick={() => cambiarRol(u.id, 'USUARIO')}>
                    Quitar admin
                  </button>
                )}
                <button
                    className="btn-eliminar"
                    onClick={() => eliminarUsuario(u.id)}
                  >
                    Eliminar
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionUsuarios;


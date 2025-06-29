import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { UserContext } from '../context/UserContext'; // ✅ Importás el contexto

const Header = () => {
  const { usuario, logout } = useContext(UserContext); // ✅ Usás usuario global y logout
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();       // ✅ limpia localStorage y estado
    navigate('/');  // ✅ redirige sin F5
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
        >
          <img src="/logo.svg" alt="Logo" className="logo" />
          <span className="site-name">ReservaFácil</span>
        </Link>
      </div>

      <div className="header-right">
        {usuario ? (
          <>
            <span>👋 Hola, {usuario.nombre}</span>
            <Link to="/mis-productos">
              <button className="btn-mis-productos">Mis productos</button>
            </Link>
            <Link to="/mis-reservas">
              <button className="btn-header">Mis reservas</button>
            </Link>
            <Link to="/mis-favoritos">
              <button className="btn-header">⭐ Mis favoritos</button>
            </Link>
            {usuario.rol === "ADMIN" && (
              <Link to="/admin/usuarios">
                <button className="btn-admin">Usuarios</button>
              </Link>
            )}
            <button onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/categorias"><button>Ver categorías</button></Link>
            <Link to="/registro"><button>Crear cuenta</button></Link>
            <Link to="/login"><button>Iniciar sesión</button></Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/Main';
import DetalleProducto from './components/DetalleProducto';
import Footer from './components/Footer';
import Login from './components/Login';
import RegistroUsuario from './components/RegistroUsuario';
import AgregarCategoria from './components/AgregarCategoria';
import ListaCategorias from './components/ListaCategorias';
import ProductosPorCategoria from './components/ProductosPorCategoria';
import EditarProducto from './components/EditarProducto';
import GestionUsuarios from './components/GestionUsuarios';
import MisProductos from './components/MisProductos';
import MisReservas from './components/MisReservas';
import ReservasPorProducto from './components/ReservasPorProducto';
import MisFavoritos from './components/MisFavoritos';
import FloatingWhatsapp from "./components/FloatingWhatsapp";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/registro" element={<RegistroUsuario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/categorias/nueva" element={<AgregarCategoria />} />
        <Route path="/categorias" element={<ListaCategorias />} />
        <Route path="/categorias/:categoriaId/productos" element={<ProductosPorCategoria />} />
        <Route path="/producto/editar/:id" element={<EditarProducto />} />
        <Route path="/admin/usuarios" element={<GestionUsuarios />} />
        <Route path="/mis-productos" element={<MisProductos />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/producto/:id/reservas" element={<ReservasPorProducto />} />
        <Route path="/mis-favoritos" element={<MisFavoritos />} />
      </Routes>
      <Footer />
      <FloatingWhatsapp />
    </Router>
  );
}

export default App;

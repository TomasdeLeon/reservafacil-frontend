import './Main.css';
import AgregarProducto from './AgregarProducto';
import ProductList from './ProductList';
import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Main = () => {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [productosFiltrados, setProductosFiltrados] = useState(null);

  const [rangoFechas, setRangoFechas] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const manejarSeleccionFechas = (rango) => {
    setRangoFechas([rango.selection]);
    setMostrarCalendario(false);
  };

  const handleBusqueda = async () => {
    try {
      const desde = rangoFechas[0].startDate.toISOString().split('T')[0];
      const hasta = rangoFechas[0].endDate.toISOString().split('T')[0];

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/productos/disponibles`, {
        params: {
          texto: busqueda,
          desde,
          hasta,
        },
      });

      setProductosFiltrados(response.data);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  };

  return (
    <main className="main-content">
      <h1>Tu lugar ideal para reservas</h1>

      <div className="busqueda-container">
        <form className="buscador-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <div
            className="selector-fecha"
            onClick={() => setMostrarCalendario(!mostrarCalendario)}
          >
            📅 {format(rangoFechas[0].startDate, 'dd/MM/yyyy')} - {format(rangoFechas[0].endDate, 'dd/MM/yyyy')}
          </div>

          {mostrarCalendario && (
            <div className="calendario-popup">
              <DateRange
                editableDateInputs={true}
                onChange={manejarSeleccionFechas}
                moveRangeOnFirstSelection={false}
                ranges={rangoFechas}
                locale={es}
              />
            </div>
          )}

          <button type="button" onClick={handleBusqueda}>
            Buscar
          </button>
        </form>
      </div>

      <section className="seccion-agregar">
        <AgregarProducto />
      </section>

      <section className="seccion-productos">
        <ProductList
          filtro={busqueda}
          productosProp={productosFiltrados?.length > 0 ? productosFiltrados : null}
        />
      </section>
    </main>
  );
};

export default Main;


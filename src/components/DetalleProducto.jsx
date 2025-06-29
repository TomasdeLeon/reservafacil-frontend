import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./DetalleProducto.css";
import { UserContext } from "../context/UserContext";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { eachDayOfInterval } from "date-fns";

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(UserContext);

  /* ---------- Estados ---------- */
  const [producto, setProducto] = useState(null);

  const [reservasOcupadas, setReservasOcupadas] = useState([]);
  const [disponible, setDisponible]   = useState(null);

  const [rango, setRango] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [mensajeReserva, setMensajeReserva] = useState("");

  const [resenas, setResenas] = useState([]);
  const [nuevaResena, setNuevaResena] = useState({
    comentario: "",
    puntaje: 5,
  });
  const [mensajeResena, setMensajeResena] = useState("");

  /* ---------- Carga de datos ---------- */
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/productos/${id}`)
      .then((res) => setProducto(res.data))
      .catch(() => navigate("/"));

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/reservas/producto/${id}`)
      .then((res) => setReservasOcupadas(res.data))
      .catch((err) => console.error("Error al obtener reservas:", err));
  }, [id, navigate]);

  /* Cargar reseñas del producto */
  useEffect(() => {
    if (producto?.id) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/resenas/${producto.id}`)
        .then((res) => setResenas(res.data))
        .catch((err) => console.error("Error al cargar reseñas:", err));
    }
  }, [producto]);

  /* ---------- Disponibilidad ---------- */
  useEffect(() => {
    if (reservasOcupadas.length > 0) validarDisponibilidad();
  }, [rango, reservasOcupadas]);

  const validarDisponibilidad = () => {
    const { startDate, endDate } = rango[0];

    const hayChoque = reservasOcupadas.some((r) => {
      const ini = new Date(r.fechaInicio);
      const fin = new Date(r.fechaFin);
      return (
        (startDate >= ini && startDate <= fin) ||
        (endDate >= ini && endDate <= fin) ||
        (ini >= startDate && fin <= endDate)
      );
    });

    setDisponible(!hayChoque);
  };

  const obtenerFechasDeshabilitadas = () =>
    reservasOcupadas.flatMap(({ fechaInicio, fechaFin }) =>
      eachDayOfInterval({
        start: new Date(fechaInicio),
        end: new Date(fechaFin),
      })
    );

  /* ---------- Permiso para dejar reseña ---------- */
  const puedeOpinar = useMemo(
    () =>
      reservasOcupadas.some(
        (r) =>
          r.usuario?.id === usuario?.id &&
          new Date(r.fechaFin) < new Date() // reserva finalizada
      ),
    [reservasOcupadas, usuario]
  );

  /* ---------- Acciones ---------- */
  const reservar = async () => {
    const { startDate, endDate } = rango[0];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
  
    /* 1 ▸ Validaciones de frontend  ----------------------------- */
    if (!disponible) {
      setMensajeReserva("⚠️ Ese rango ya está reservado.");
      return;                             // 🚫 no disparamos el POST
    }
    if (startDate < hoy) {
      setMensajeReserva("⚠️ No podés reservar una fecha pasada.");
      return;
    }
    if (endDate < startDate) {
      setMensajeReserva(
        "⚠️ La fecha de fin no puede ser anterior a la de inicio."
      );
      return;
    }
  
    /* 2 ▸ Llamada al backend  ---------------------------------- */
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/reservas`, {
        producto: { id: producto.id },
        usuario: { id: usuario.id },
        fechaInicio: startDate.toISOString().split("T")[0],
        fechaFin: endDate.toISOString().split("T")[0],
      });
  
      // ✔️ Éxito
      setMensajeReserva("✅ Reserva realizada con éxito");
    } catch (err) {
      console.error(err);
  
      /* 3 ▸ Manejo de errores HTTP ----------------------------- */
      const status = err.response?.status;
      if (status === 400) {
        // Mensaje específico que entrega el backend, ej.: "Ya existe una reserva en esas fechas."
        setMensajeReserva(`⚠️ ${err.response.data}`);
      } else {
        // Cualquier otro error (500, red, etc.)
        setMensajeReserva("❌ Error inesperado, intentá de nuevo más tarde.");
      }
    }
  };


  const eliminarProducto = async () => {
    if (!window.confirm("¿Querés eliminar este producto?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/productos/${id}`);
      navigate("/");
    } catch {
      alert("❌ Error al eliminar el producto");
    }
  };

  const enviarResena = async (e) => {
    e.preventDefault();
    if (!nuevaResena.comentario.trim() || !nuevaResena.puntaje) {
      setMensajeResena("⚠️ Todos los campos son obligatorios");
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/resenas`, {
        comentario: nuevaResena.comentario,
        puntaje: parseInt(nuevaResena.puntaje),
        usuario: { id: usuario.id },
        producto: { id: producto.id },
      });
      setMensajeResena("✅ Reseña guardada correctamente");
      setNuevaResena({ comentario: "", puntaje: 5 });

      // recargar reseñas
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/resenas/${producto.id}`
      );
      setResenas(data);
    } catch (err) {
      console.error("Error al enviar reseña:", err);
      setMensajeResena("❌ Error al enviar la reseña");
    }
  };

  /* ---------- Render ---------- */
  if (!producto) return <p>Cargando…</p>;

  const promedio =
    resenas.length > 0
      ? (resenas.reduce((acc, r) => acc + r.puntaje, 0) / resenas.length).toFixed(
          1
        )
      : null;

  return (
    <div className="detalle-container">
      <div className="detalle-card">
        <img
          src={producto.imagenUrl || '/no-image.png'}
          alt={producto.nombre}
          className="producto-img"
        />
        <h2>{producto.nombre}</h2>

        {/* Compartir */}
        <div className="compartir-redes">
          <h4>📣 Compartir este producto:</h4>
          <a
            href={`https://wa.me/?text=Mirá este producto en ReservaFácil: ${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="btn-whatsapp">WhatsApp</button>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="btn-facebook">Facebook</button>
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=Mirá este producto en ReservaFácil: ${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="btn-twitter">X (Twitter)</button>
          </a>
        </div>

        {promedio && (
          <p className="promedio-puntaje">
            ⭐ Promedio: <strong>{promedio}</strong> / 5
          </p>
        )}

        <p>{producto.descripcion}</p>

        {producto.usuario && (
          <p className="creado-por">
            Publicado por: <strong>{producto.usuario.nombre}</strong>
          </p>
        )}

        {/* Características */}
        {producto.caracteristicas?.length > 0 && (
          <section className="detalle-caracteristicas">
            <h4>Características:</h4>
            <ul>
              {producto.caracteristicas.map((c) => (
                <li key={c.id}>
                  {c.icono} {c.nombre}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Reserva */}
        {usuario && (
          <section className="reserva-box">
            <h4>Seleccioná fechas para reservar:</h4>
            <DateRange
              editableDateInputs
              onChange={(item) => setRango([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={rango}
              minDate={new Date()}
              disabledDates={obtenerFechasDeshabilitadas()}
            />
            {disponible !== null && (
              <p className={disponible ? "disponible" : "no-disponible"}>
                {disponible
                  ? "✅ Este producto está disponible"
                  : "❌ Este producto ya está reservado en esas fechas"}
              </p>
            )}
            <button className="btn-reservar" onClick={reservar}>
              Reservar
            </button>
            {mensajeReserva && (
              <p
                className={
                  mensajeReserva.includes("✅")
                    ? "reserva-mensaje"
                    : "reserva-error"
                }
              >
                {mensajeReserva}
              </p>
            )}
          </section>
        )}

        {/* Controles de administración / autor */}
        {usuario && (
          <div className="botones-producto">
            <Link to={`/producto/editar/${producto.id}`}>
              <button className="btn-editar">Editar</button>
            </Link>
            <button onClick={eliminarProducto} className="btn-eliminar">
              Eliminar
            </button>
            {usuario.rol === "ADMIN" && (
              <Link to={`/producto/${producto.id}/reservas`}>
                <button className="btn-ver-reservas">Ver reservas</button>
              </Link>
            )}
          </div>
        )}

        <Link to="/" className="btn-volver">
          ← Volver al inicio
        </Link>
      </div>


      <aside className="politicas-producto">
        {/* Reseñas */}
        <section className="detalle-resenas">
          <h4>⭐ Reseñas:</h4>
          {resenas.length === 0 ? (
            <p>Aún no hay reseñas para este producto.</p>
          ) : (
            <ul>
              {resenas.map((r) => (
                <li key={r.id}>
                  <strong>{r.usuario?.nombre}</strong> – {r.puntaje}/5
                  <br />
                  <em>{r.comentario}</em>
                </li>
              ))}
            </ul>
          )}

          {usuario && puedeOpinar && (
            <form onSubmit={enviarResena} className="form-resena">
              {mensajeResena && <p>{mensajeResena}</p>}
              <label htmlFor="puntaje">Puntaje</label>
              <select
                id="puntaje"
                aria-label="Puntaje"
                value={nuevaResena.puntaje}
                onChange={(e) =>
                  setNuevaResena({ ...nuevaResena, puntaje: e.target.value })
                }
              >
                {[1, 2, 3, 4, 5].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <label htmlFor="comentario">Comentario</label>
              <textarea
                id="comentario"
                aria-label="Comentario"
                placeholder="Tu comentario"
                value={nuevaResena.comentario}
                onChange={(e) =>
                  setNuevaResena({ ...nuevaResena, comentario: e.target.value })
                }
              />
              <button type="submit">Enviar reseña</button>
            </form>
          )}
        </section>
        {/* Políticas */}
        <h3>¿Qué necesitás saber?</h3>
        <div className="politicas-grid">
          <div className="bloque-politica">
            <h4>📋 Normas de la casa</h4>
            <ul>
              <li>No se permite fumar.</li>
              <li>No se permiten mascotas.</li>
              <li>No se permiten fiestas.</li>
            </ul>
          </div>
          <div className="bloque-politica">
            <h4>🕒 Horarios</h4>
            <ul>
              <li>Check‑in: 14:00 hs</li>
              <li>Check‑out: 11:00 hs</li>
            </ul>
          </div>
          <div className="bloque-politica">
            <h4>🔒 Seguridad</h4>
            <ul>
              <li>Detector de humo</li>
              <li>Extintor de incendios</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DetalleProducto;



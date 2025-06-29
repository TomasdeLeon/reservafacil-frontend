import React from "react";
import "./FloatingWhatsapp.css";

const phone = import.meta.env.VITE_WA_NUMBER;          // ← poné aquí el número del negocio (solo dígitos)
const defaultMsg = encodeURIComponent(
  "¡Hola! Tengo una consulta sobre un producto que vi en ReservaFácil."
);

const FloatingWhatsapp = () => (
  <a
    href={`https://wa.me/${phone}?text=${defaultMsg}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chatea por WhatsApp"
    className="whatsapp-float"
  >
    {/* Ícono puro SVG (evita carga extra) */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 440 512"
      className="wa-icon"
    >
      <path
        fill="currentColor"
        d="M380.9 97.1C339-8 212.3-32.5 119.6 29.6c-87.1 58-110.8 171-57.4 257.1L7.7 469.6c-4.6 12 7.5 23.4 19.5 18.9l182.7-73.3c77.9 41.1 175.6 8.4 217.5-69.3 41.4-77.5 18.7-174.6-46.5-248.8zm-53.3 230.7c-6.4 17.4-32.3 32.9-45.3 35-12.1 1.9-26.4 2.8-42.5-2.6-9.8-3.1-22.3-7.2-38.5-14.3-67.7-29.2-111.7-97.5-115.3-101.9-3.4-4.5-27.6-36.8-27.6-70.2 0-33.4 17.4-49.7 23.7-56.5 6.4-6.9 14.1-8.6 18.9-8.6h14.1c4.5 0 10.6-.7 16.1 12.4 6.4 15.3 21.8 52.9 23.8 56.7 1.9 3.8 3.2 8.2 0.6 13.2-2.6 5.1-3.8 8.2-7.5 12.6-3.8 4.5-7.9 10.1-11.3 13.6-3.6 3.8-7.4 7.9-3 15.7 4.3 7.7 19.3 31.9 41.3 51.5 28.4 25.4 52.1 33.4 59.8 37.1 7.7 3.6 12.1 3 16.1-1.8 4.1-4.8 18.5-21.6 23.4-29.1 4.8-7.4 9.6-6.1 16.1-3.6 6.4 2.6 41 19.4 48 22.9 7.1 3.6 11.8 5.3 13.4 8.2 1.3 3 1.3 17.1-5.1 34.5z"
      />
    </svg>
  </a>
);

export default FloatingWhatsapp;

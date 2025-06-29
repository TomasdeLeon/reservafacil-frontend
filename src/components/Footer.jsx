import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; 2025 ReservaFácil. Todos los derechos reservados.</p>
        <div className="footer-socials">
          <a href="#">📘 Facebook</a>
          <a href="#">🐦 Twitter</a>
          <a href="#">📸 Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

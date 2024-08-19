import React from 'react';

const Home = () => {
  return (
    <div className="home-container">
      <h2>Bienvenido a la aplicación médica</h2>
      <div className="content-section">
        <h3>Acerca de Nosotros</h3>
        <p>
          Somos una aplicación dedicada a proporcionar las mejores herramientas para la gestión médica.
          Nuestra misión es mejorar la eficiencia y la calidad de la atención médica mediante el uso de la
          tecnología.
        </p>
      </div>
      <div className="content-section">
        <h3>Servicios</h3>
        <ul>
          <li>Gestión de Notas Médicas</li>
          <li>Historial Médico de Pacientes</li>
          <li>Consultas y Recordatorios</li>
        </ul>
      </div>
      <div className="content-section">
        <h3>Contacto</h3>
        <p>Correo electrónico: contacto@aplicacionmedica.com</p>
        <p>Teléfono: +52 123 456 7890</p>
      </div>
    </div>
  );
};

export default Home;

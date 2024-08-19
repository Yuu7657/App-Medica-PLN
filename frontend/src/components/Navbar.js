import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/notes" className={({ isActive }) => (isActive ? 'active' : '')}>
            Notas Médicas
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : '')}>
            Historial Médico
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

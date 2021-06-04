import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiSettings} from "react-icons/fi";
import './header.css'

export default function Header() {
  return (
    <div className="sidebar">
      <Link to="/dashboard"><FiHome color="#FFF" size={24} /> Chamados</Link>
      <Link to="/profile"><FiSettings color="#FFF" size={24} /> Configurações</Link>
    </div>
  );
}
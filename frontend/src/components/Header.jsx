import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Header() {
  const { isAdmin, logout } = useContext(AuthContext)
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <h1 className="site-brand mb-0">
            <Link to="/" className="site-brand-link">Atisbe</Link>
          </h1>
        </div>

        <nav className="main-nav">
          <button className="btn btn-sm d-md-none" aria-expanded={mobileOpen} onClick={() => setMobileOpen(s => !s)}>
            {mobileOpen ? 'Cerrar' : 'Menu'}
          </button>
          <ul className={`nav-list ${mobileOpen ? 'open' : ''}`}>
            <li><Link to="/" className="nav-link">Inicio</Link></li>
            <li><Link to="/quienes" className="nav-link">Quiénes somos</Link></li>
            <li><Link to="/cursos" className="nav-link nav-cta">Nuestros cursos</Link></li>
            <li><Link to="/testimonios" className="nav-link">Testimonios</Link></li>
            {!isAdmin && <li><Link to="/login" className="nav-link">Login</Link></li>}
            {isAdmin && <li><button className="nav-link" onClick={() => {logout(); window.location.href = '/'}}>Cerrar sesión</button></li>}
          </ul>
        </nav>
      </div>
    </header>
  )
}

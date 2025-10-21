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
          <Link to="/" className="site-brand d-flex align-items-center gap-2" aria-label="Atisbe - Inicio">
            <img src="/logo192.png" alt="logo" width="36" height="36" style={{borderRadius:8,objectFit:'cover'}} />
            <span className="site-brand-text">Atisbe</span>
          </Link>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <button className="menu-toggle d-md-none" aria-controls="main-nav-list" aria-expanded={mobileOpen} onClick={() => setMobileOpen(s => !s)}>
            <span className="sr-only">{mobileOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M3 6h18M3 12h18M3 18h18'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <ul id="main-nav-list" className={`nav-list ${mobileOpen ? 'open' : ''}`}>
            <li><Link to="/" className="nav-link">Inicio</Link></li>
            <li><Link to="/quienes" className="nav-link">Quiénes somos</Link></li>
            <li><Link to="/cursos" className="nav-link nav-cta">Nuestros cursos</Link></li>
            <li><Link to="/testimonios" className="nav-link">Testimonios</Link></li>
            {!isAdmin && <li><Link to="/login" className="nav-link nav-login">Login</Link></li>}
            {isAdmin && <li><button className="nav-link" onClick={() => {logout(); window.location.href = '/'}}>Cerrar sesión</button></li>}
          </ul>
        </nav>
      </div>
    </header>
  )
}

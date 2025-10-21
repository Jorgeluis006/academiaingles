import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Header() {
  const { isAdmin, logout } = useContext(AuthContext)
  const [open, setOpen] = useState(false)
  return (
    <header className="py-3 site-header">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h4 mb-0 site-brand">
          <Link to="/" className="site-brand-link">Atisbe</Link>
        </h1>
        <button className="btn btn-sm d-md-none" aria-expanded={open} aria-controls="nav-main" onClick={() => setOpen((s) => !s)}>
          {open ? 'Cerrar' : 'Menu'}
        </button>
        <nav id="nav-main" className={`${open ? 'd-block' : 'd-none'} d-md-block` }>
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/quienes" className="nav-link">Quiénes somos</Link>
          <Link to="/cursos" className="btn btn-accent">Nuestros cursos</Link>
          <Link to="/testimonios" className="btn btn-accent">Testimonios</Link>
          {!isAdmin && <Link to="/login" className="btn btn-outline-login">Login</Link>}
          {isAdmin && <button className="btn btn-outline-secondary" onClick={() => { logout(); window.location.href = '/' }}>Cerrar sesión</button>}
        </nav>
      </div>
    </header>
  )
}

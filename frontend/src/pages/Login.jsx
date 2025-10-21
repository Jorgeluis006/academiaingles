import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'

export default function Login() {
  const [form, setForm] = useState({ nombre: '', codigo: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { loginAdmin } = useContext(AuthContext)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const body = new URLSearchParams(form)
    try {
      const res = await fetch('/php/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      const data = await res.json()
      if (data.success) {
        if (data.admin == 1 || data.admin === '1' || data.admin === true) {
          loginAdmin()
          const from = location.state?.from?.pathname || '/admin'
          navigate(from)
        } else {
          alert('Bienvenido')
          navigate('/')
        }
      } else {
        alert(data.msg || 'Error en login')
      }
    } catch (err) {
      console.error(err)
      alert('Error de red')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <main>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h2 className="mb-4 text-center text-primary">Iniciar Sesión</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre</label>
                      <input id="nombre" name="nombre" className="form-control" required autoComplete="username" value={form.nombre} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="codigo" className="form-label">Código</label>
                      <input id="codigo" name="codigo" type="password" className="form-control" required autoComplete="current-password" value={form.codigo} onChange={handleChange} />
                    </div>
                    <div id="login-error" className="alert alert-danger d-none" role="alert"></div>
                    <button type="submit" className="btn btn-warning w-100">{loading ? 'Iniciando...' : 'Entrar'}</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import Header from '../components/Header'

export default function Testimonios() {
  const [testimonios, setTestimonios] = useState([])
  const [form, setForm] = useState({ nombre: '', contenido: '', video_url: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/php/testimonios.php?action=listar')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTestimonios(data.testimonios)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const body = new URLSearchParams(form)
    try {
      const res = await fetch('/php/testimonios.php?action=agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      const data = await res.json()
      if (data.success) {
        setTestimonios((t) => [{ id: data.id, ...form, creado_at: new Date().toISOString() }, ...t])
        setForm({ nombre: '', contenido: '', video_url: '' })
      } else {
        alert(data.msg || 'Error al agregar')
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
  <main className="container testimonios section">
  <h2 className="mb-4">Testimonios</h2>
  <form onSubmit={handleSubmit} className="mb-3">
          <div>
            <input name="nombre" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} />
          </div>
          <div>
            <textarea name="contenido" placeholder="Tu testimonio" value={form.contenido} onChange={handleChange} />
          </div>
          <div>
            <input name="video_url" placeholder="URL del video (opcional)" value={form.video_url} onChange={handleChange} />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Agregar testimonio'}</button>
        </form>

        <section id="testimonios-list">
          <div className="text-center mb-3" id="testimonios-spinner">
            {loading && (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            )}
          </div>
          <div className="row">
            {testimonios.map((t) => (
              <div key={t.id} className="col-12 col-md-6 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{t.nombre}</h5>
                    <p className="card-text">{t.contenido}</p>
                    {t.video_url && (
                      <div className="ratio ratio-16x9">
                        <iframe src={t.video_url} title={`video-${t.id}`} allowFullScreen />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {(!loading && testimonios.length === 0) && <div className="text-center mt-3" id="testimonios-empty">No hay testimonios disponibles.</div>}
        </section>
      </main>
    </div>
  )
}

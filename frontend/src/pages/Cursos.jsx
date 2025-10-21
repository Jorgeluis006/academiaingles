import React, { useEffect, useState } from 'react'
import Header from '../components/Header'

export default function Cursos() {
  const [cursos, setCursos] = useState([])

  useEffect(() => {
    fetch('/php/cursos.php?action=listar')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCursos(d.cursos) })
      .catch(console.error)
  }, [])

  return (
    <div>
      <Header />
      <main>
        <div className="container cursos section py-5">
          <h2 className="text-center">Nuestros Cursos</h2>
          <div id="cursosCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {/* If cursos is empty, show three default items */}
              {(cursos.length === 0 ? [
                { id: '1', titulo: 'Inglés', descripcion: 'Aprende inglés con un enfoque práctico, divertido y personalizado.', imagen: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&w=800&q=80' },
                { id: '2', titulo: 'Francés', descripcion: 'Descubre la lengua y cultura francesa con clases dinámicas.', imagen: 'https://images.pexels.com/photos/196652/pexels-photo-196652.jpeg?auto=compress&w=800&q=80' },
                { id: '3', titulo: 'Español para extranjeros', descripcion: 'Vive el español como una experiencia cultural y comunicativa.', imagen: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=800&q=80' }
              ] : cursos).map((c, idx) => (
                <div key={c.id} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <img src={c.imagen} className="img-fluid rounded" alt={c.titulo} />
                    </div>
                    <div className="col-md-6">
                      <h3>{c.titulo}</h3>
                      <p>{c.descripcion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#cursosCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Anterior</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#cursosCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

import React from 'react'
import Header from '../components/Header'

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <section className="container hero section text-center" data-aos="fade-up">
          <div className="mb-4">
            <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Mascota Atisbe" className="img-fluid site-logo" />
          </div>
          <h1 className="mb-3">El mundo a través de los idiomas.</h1>
          <button className="btn btn-warning btn-lg cta" type="button">¿QUIERES SABER TU NIVEL TOTALMENTE GRATIS?</button>
        </section>
        <section className="container quienes section" id="quienes-somos" data-aos="fade-up" data-aos-delay="200">
          <h2 className="mb-4 text-center">Quiénes Somos</h2>
          <div className="mb-4">
            <h3 className="h5">Nuestra historia</h3>
            <p>Atisbe academia de idiomas nace como una propuesta educativa moderna, cercana y emocional, enfocada en romper las barreras del idioma a través de una enseñanza práctica, divertida y personalizada. Fundada por tres socias apasionadas por la educación y la multiculturalidad, Atisbe ha sido creada con el propósito de acompañar a niños, jóvenes y adultos en su camino hacia el dominio de nuevas lenguas, no solo como herramientas de comunicación, sino como una puerta hacia nuevas oportunidades personales, académicas y profesionales.</p>
          </div>
          <div className="mb-4">
            <h3 className="h5">Origen del nombre</h3>
            <p>El nombre Atisbe nace del verbo atisbar, que significa observar con atención y es una palabra común en Boyacá, región de origen de la socia mayoritaria. Este origen conecta profundamente con la misión de la academia: observar, guiar y acompañar de forma cercana el proceso de aprendizaje de cada estudiante.</p>
          </div>
          <div className="mb-4">
            <h3 className="h5">Método ATIKA</h3>
            <p>El método ATIKA es nuestro enfoque metodológico basado en el aprendizaje progresivo, activo y personalizado. Creemos en el poder de la constancia, la motivación y la flexibilidad para lograr avances sostenibles, paso a paso, adaptándonos a las necesidades reales de cada estudiante.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

import React, { useEffect, useState } from 'react';
import './Cursos.css';

function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/php/cursos.php?action=listar')
      .then(r => r.json())
      .then(data => {
        if (data.success) setCursos(data.cursos);
        setLoading(false);
      });
  }, []);

  return (
    <div className="cursos-container">
      <h2>Cursos</h2>
      {loading ? <p>Cargando...</p> : (
        cursos.length === 0 ? <p>No hay cursos disponibles.</p> : (
          <div className="courses-grid">
            {cursos.map(curso => (
              <div className="card" key={curso.id}>
                <img src={curso.imagen} alt={curso.titulo} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{curso.titulo}</h5>
                  <p className="card-text">{curso.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default Cursos;

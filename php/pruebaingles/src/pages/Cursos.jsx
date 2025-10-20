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
        <div className="cursos-list">
          {cursos.length === 0 ? <p>No hay cursos disponibles.</p> : (
            cursos.map(curso => (
              <div className="curso-card" key={curso.id}>
                <img src={curso.imagen} alt={curso.titulo} className="curso-img" />
                <h5>{curso.titulo}</h5>
                <p>{curso.descripcion}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Cursos;

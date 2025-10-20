import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(44, 41, 61, 0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 4px 32px rgba(44,41,61,0.18)', padding: '2rem', minWidth: 350, maxWidth: 420 }}>
        {children}
        <button style={{marginTop: '1rem'}} className="btn btn-warning" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

function Admin() {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: '', titulo: '', descripcion: '', imagen: '' });
  const [editando, setEditando] = useState(false);
  const [msg, setMsg] = useState('');

  const cargarCursos = () => {
    setLoading(true);
    fetch('/php/cursos.php?action=listar')
      .then(r => r.json())
      .then(data => {
        if (data.success) setCursos(data.cursos);
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  const handleForm = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarCurso = async e => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    fd.append('titulo', form.titulo);
    fd.append('descripcion', form.descripcion);
    fd.append('imagen', form.imagen);
    if (editando) fd.append('id', form.id);
    const res = await fetch('/php/cursos.php?action=' + (editando ? 'editar' : 'agregar'), {
      method: 'POST',
      body: fd
    });
    const data = await res.json();
    if (data.success) {
      setMsg(editando ? 'Curso editado correctamente' : 'Curso agregado correctamente');
      setForm({ id: '', titulo: '', descripcion: '', imagen: '' });
      setEditando(false);
      cargarCursos();
    } else {
      setMsg(data.msg || 'Error al guardar');
    }
  };

  const editarCurso = curso => {
    navigate('/editar-curso', { state: { curso } });
  };

  const eliminarCurso = async id => {
    if (!window.confirm('¿Seguro que deseas eliminar este curso?')) return;
    const fd = new FormData();
    fd.append('id', id);
    const res = await fetch('/php/cursos.php?action=eliminar', {
      method: 'POST',
      body: fd
    });
    const data = await res.json();
    if (data.success) {
      setMsg('Curso eliminado correctamente');
      cargarCursos();
    } else {
      setMsg(data.msg || 'Error al eliminar');
    }
  };

  return (
    <div className="admin-container">
      <h2>Panel de Administración</h2>
      <div className="admin-form">
        <h4>Agregar nuevo curso</h4>
        <form onSubmit={guardarCurso}>
          <input name="titulo" value={form.titulo} onChange={handleForm} placeholder="Título" required />
          <textarea name="descripcion" value={form.descripcion} onChange={handleForm} placeholder="Descripción" required />
          <input name="imagen" value={form.imagen} onChange={handleForm} placeholder="URL de imagen" required />
          <button type="submit">Agregar curso</button>
        </form>
        {msg && <div className="admin-msg">{msg}</div>}
      </div>
      <div className="admin-list">
        <h4>Cursos actuales</h4>
        {loading ? <p>Cargando...</p> : (
          cursos.length === 0 ? <p>No hay cursos.</p> : (
            <div className="courses-grid">
              {cursos.map(curso => (
                <div className="card" key={curso.id}>
                  <img src={curso.imagen} alt={curso.titulo} className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title">{curso.titulo}</h5>
                    <p className="card-text">{curso.descripcion}</p>
                    <button className="btn btn-primary" onClick={() => editarCurso(curso)}>Editar</button>
                    <button className="btn" style={{background: '#f87171', marginTop: '0.5rem'}} onClick={() => eliminarCurso(curso.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      {/* El formulario de edición ahora está en la página EditarCurso */}
    </div>
  );
}

export default Admin;

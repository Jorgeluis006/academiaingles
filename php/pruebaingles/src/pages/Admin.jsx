import React, { useEffect, useState } from 'react';

function Admin() {
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
    setForm(curso);
    setEditando(true);
    setMsg('');
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
        <h4>{editando ? 'Editar curso' : 'Agregar nuevo curso'}</h4>
        <form onSubmit={guardarCurso}>
          <input name="titulo" value={form.titulo} onChange={handleForm} placeholder="Título" required />
          <textarea name="descripcion" value={form.descripcion} onChange={handleForm} placeholder="Descripción" required />
          <input name="imagen" value={form.imagen} onChange={handleForm} placeholder="URL de imagen" required />
          <button type="submit">{editando ? 'Guardar cambios' : 'Agregar curso'}</button>
          {editando && <button type="button" onClick={() => { setEditando(false); setForm({ id: '', titulo: '', descripcion: '', imagen: '' }); }}>Cancelar</button>}
        </form>
        {msg && <div className="admin-msg">{msg}</div>}
      </div>
      <div className="admin-list">
        <h4>Cursos actuales</h4>
        {loading ? <p>Cargando...</p> : (
          cursos.length === 0 ? <p>No hay cursos.</p> : (
            cursos.map(curso => (
              <div className="admin-card" key={curso.id}>
                <img src={curso.imagen} alt={curso.titulo} style={{ width: '80px', borderRadius: '1rem' }} />
                <div>
                  <strong>{curso.titulo}</strong>
                  <p>{curso.descripcion}</p>
                </div>
                <button onClick={() => editarCurso(curso)}>Editar</button>
                <button onClick={() => eliminarCurso(curso.id)}>Eliminar</button>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

export default Admin;

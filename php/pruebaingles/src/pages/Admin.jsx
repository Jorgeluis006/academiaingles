import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal show d-block" style={{ background: 'rgba(44, 41, 61, 0.25)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            {children}
            <button className="btn btn-warning mt-3" onClick={onClose}>Cerrar</button>
          </div>
        </div>
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
    const res = await fetch('/php/cursos.php?action=guardar', {
      method: 'POST',
      body: fd
    });
    const data = await res.json();
    if (data.success) {
      setMsg('Curso guardado correctamente');
      cargarCursos();
      setEditando(false);
    } else {
      setMsg(data.msg || 'Error al guardar');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">Panel de Administración</h2>
      {msg && <div className="alert alert-info">{msg}</div>}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-secondary">Cursos actuales</h4>
        <button className="btn btn-success" onClick={() => setEditando(true)}>Agregar curso</button>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="row">
          {cursos.map(curso => (
            <div className="col-md-4 mb-3" key={curso.id}>
              <div className="card">
                <img src={curso.imagen} className="card-img-top" alt={curso.titulo} />
                <div className="card-body">
                  <h5 className="card-title">{curso.titulo}</h5>
                  <p className="card-text">{curso.descripcion}</p>
                  <button className="btn btn-primary me-2" onClick={() => navigate(`/editar-curso`, { state: { curso } })}>Editar</button>
                  <button className="btn btn-danger">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={editando} onClose={() => setEditando(false)}>
        <h5>Agregar nuevo curso</h5>
        <form onSubmit={guardarCurso}>
          <div className="mb-3">
            <label className="form-label">Título</label>
            <input name="titulo" value={form.titulo} onChange={handleForm} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleForm} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">URL de imagen</label>
            <input name="imagen" value={form.imagen} onChange={handleForm} className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary">Guardar</button>
        </form>
      </Modal>
    </div>
  );
}

export default Admin;

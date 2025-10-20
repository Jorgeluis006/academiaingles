import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function EditarCurso() {
  const navigate = useNavigate();
  const location = useLocation();
  const curso = location.state?.curso || { id: '', titulo: '', descripcion: '', imagen: '' };
  const [form, setForm] = useState(curso);
  const [msg, setMsg] = useState('');

  const handleForm = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarCurso = async e => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    fd.append('id', form.id);
    fd.append('titulo', form.titulo);
    fd.append('descripcion', form.descripcion);
    fd.append('imagen', form.imagen);
    const res = await fetch('/php/cursos.php?action=editar', {
      method: 'POST',
      body: fd
    });
    const data = await res.json();
    if (data.success) {
      setMsg('Curso editado correctamente');
      setTimeout(() => navigate(-1), 1200);
    } else {
      setMsg(data.msg || 'Error al guardar');
    }
  };

  return (
    <div className="admin-container">
      <h2>Editar curso</h2>
      <form onSubmit={guardarCurso}>
        <label>Título</label>
        <input name="titulo" value={form.titulo} onChange={handleForm} placeholder="Título" required />
        <label>Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleForm} placeholder="Descripción" required />
        <label>URL de imagen</label>
        <input name="imagen" value={form.imagen} onChange={handleForm} placeholder="URL de imagen" required />
        {form.imagen && <img src={form.imagen} alt="preview" style={{width:'100%',maxHeight:120,objectFit:'cover',borderRadius:'0.7rem',margin:'1rem 0'}} />}
        <button type="submit" className="btn btn-primary">Guardar cambios</button>
        <button type="button" className="btn btn-warning" style={{marginLeft:'1rem'}} onClick={() => navigate(-1)}>Cancelar</button>
      </form>
      {msg && <div className="admin-msg">{msg}</div>}
    </div>
  );
}

export default EditarCurso;

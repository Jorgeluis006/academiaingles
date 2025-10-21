import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'

export default function Admin() {
  const [testimonios, setTestimonios] = useState([])
  const [testimonioForm, setTestimonioForm] = useState({ nombre: '', contenido: '', video_url: '' })
  const [testimonioFile, setTestimonioFile] = useState(null)
  const [testimonioPreview, setTestimonioPreview] = useState(null)
  const [testimonioFileError, setTestimonioFileError] = useState(null)
  const [editingTestimonioId, setEditingTestimonioId] = useState(null)
  const [testimonioLoading, setTestimonioLoading] = useState(false)
  const [cursos, setCursos] = useState([])
  const [cursoForm, setCursoForm] = useState({ titulo: '', descripcion: '', imagen: '' })
  const [cursoFile, setCursoFile] = useState(null)
  const [cursoPreview, setCursoPreview] = useState(null)
  const [cursoFileError, setCursoFileError] = useState(null)
  const [editingCursoId, setEditingCursoId] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState(null) // {type:'curso'|'testimonio', id}
  const [toast, setToast] = useState({ show: false, message: '', trashUrl: '', type: '', id: null })

  useEffect(() => {
    fetch('/php/testimonios.php?action=listar')
      .then((r) => r.json())
      .then((d) => { if (d.success) setTestimonios(d.testimonios) })
      .catch(console.error)
    fetch('/php/cursos.php?action=listar')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCursos(d.cursos) })
      .catch(console.error)
    return () => {
      if (testimonioPreview && testimonioPreview.startsWith('blob:')) URL.revokeObjectURL(testimonioPreview)
      if (cursoPreview && cursoPreview.startsWith('blob:')) URL.revokeObjectURL(cursoPreview)
    }
  }, [])

  function requestDeleteImage(type, id) {
    setConfirmTarget({ type, id })
    setShowConfirm(true)
  }

  async function confirmDeleteImage() {
    if (!confirmTarget) return
    const { type, id } = confirmTarget
    const endpoint = type === 'curso' ? '/php/cursos.php?action=eliminar_imagen' : '/php/testimonios.php?action=eliminar_imagen'
    const body = new URLSearchParams({ id })
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
    const data = await res.json()
    if (data.success) {
      if (type === 'curso') {
        setCursos((c) => c.map((x) => x.id === id ? { ...x, imagen: '' } : x))
      } else {
        setTestimonios((t) => t.map((x) => x.id === id ? { ...x, imagen: '' } : x))
      }
      // show undo toast
      setToast({ show: true, message: 'Imagen eliminada', trashUrl: data.trash || '', type, id })
    } else {
      alert(data.msg || 'Error')
    }
    setShowConfirm(false)
    setConfirmTarget(null)
  }

  async function undoDeleteImage() {
    if (!toast.trashUrl || !toast.id) return
    const endpoint = toast.type === 'curso' ? '/php/cursos.php?action=restore_image' : '/php/testimonios.php?action=restore_image'
    const body = new URLSearchParams({ id: toast.id, trash_url: toast.trashUrl })
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
    const data = await res.json()
    if (data.success) {
      if (toast.type === 'curso') {
        setCursos((c) => c.map((x) => x.id === toast.id ? { ...x, imagen: data.url } : x))
      } else {
        setTestimonios((t) => t.map((x) => x.id === toast.id ? { ...x, imagen: data.url } : x))
      }
    } else {
      alert('No se pudo restaurar')
    }
    setToast({ show: false, message: '', trashUrl: '', type: '', id: null })
  }

  async function handleDeleteTestimonio(id) {
    if (!confirm('Eliminar testimonio?')) return
    const body = new URLSearchParams({ id })
    const res = await fetch('/php/testimonios.php?action=eliminar', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
    const data = await res.json()
    if (data.success) setTestimonios((t) => t.filter((x) => x.id !== id))
    else alert(data.msg || 'Error')
  }

  function handleTestimonioInputChange(e) {
    const { name, value } = e.target
    setTestimonioForm((s) => ({ ...s, [name]: value }))
  }

  function startEditTestimonio(t) {
    setEditingTestimonioId(t.id)
    setTestimonioForm({ nombre: t.nombre, contenido: t.contenido, video_url: t.video_url || '', imagen: t.imagen || '' })
    setTestimonioFile(null)
    setTestimonioPreview(t.imagen || null)
    setTestimonioFileError(null)
  }

  async function handleTestimonioSubmit(e) {
    e.preventDefault()
    setTestimonioLoading(true)
    const action = editingTestimonioId ? 'editar' : 'agregar'
    const body = new URLSearchParams({ nombre: testimonioForm.nombre, contenido: testimonioForm.contenido, video_url: testimonioForm.video_url, imagen: testimonioForm.imagen || '' })
    if (editingTestimonioId) body.append('id', editingTestimonioId)
    // If there's a file, upload it first
    if (testimonioFile) {
      const fd = new FormData()
      fd.append('file', testimonioFile)
      const up = await fetch('/php/upload_image.php?type=testimonios', { method: 'POST', body: fd })
      const upData = await up.json()
      if (upData.success) {
        body.set('imagen', upData.url)
      } else {
        alert(upData.msg || 'Error subiendo imagen')
        setTestimonioLoading(false)
        return
      }
    }
  try {
      const res = await fetch(`/php/testimonios.php?action=${action}`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
      const data = await res.json()
      if (data.success) {
        if (action === 'agregar') {
    setTestimonios((t) => [{ id: data.id, nombre: testimonioForm.nombre, contenido: testimonioForm.contenido, video_url: testimonioForm.video_url, imagen: body.get('imagen') || '', creado_at: new Date().toISOString() }, ...t])
        } else {
    setTestimonios((t) => t.map((item) => item.id === editingTestimonioId ? { ...item, nombre: testimonioForm.nombre, contenido: testimonioForm.contenido, video_url: testimonioForm.video_url, imagen: body.get('imagen') || item.imagen } : item))
        }
        setTestimonioForm({ nombre: '', contenido: '', video_url: '' })
        setTestimonioFile(null)
        if (testimonioPreview && testimonioPreview.startsWith('blob:')) {
          URL.revokeObjectURL(testimonioPreview)
        }
        setTestimonioPreview(null)
        setEditingTestimonioId(null)
      } else {
        alert(data.msg || 'Error')
      }
    } catch (err) {
      console.error(err)
      alert('Error de red')
    } finally {
      setTestimonioLoading(false)
    }
  }

  function handleTestimonioFileChange(e) {
    const f = e.target.files[0] || null
    if (!f) {
      setTestimonioFile(null)
      setTestimonioPreview(null)
      setTestimonioFileError(null)
      return
    }
    // validate file
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 5 * 1024 * 1024
    if (!allowed.includes(f.type)) {
      setTestimonioFileError('Tipo de archivo no permitido. Usa JPG/PNG/WebP/GIF.')
      setTestimonioFile(null)
      return
    }
    if (f.size > maxSize) {
      setTestimonioFileError('El archivo supera 5MB.')
      setTestimonioFile(null)
      return
    }
    setTestimonioFileError(null)
    setTestimonioFile(f)
    if (testimonioPreview && testimonioPreview.startsWith('blob:')) URL.revokeObjectURL(testimonioPreview)
    setTestimonioPreview(URL.createObjectURL(f))
  }

  async function handleDeleteCurso(id) {
    if (!confirm('Eliminar curso?')) return
    const body = new URLSearchParams({ id })
    const res = await fetch('/php/cursos.php?action=eliminar', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
    const data = await res.json()
    if (data.success) setCursos((c) => c.filter((x) => x.id !== id))
    else alert(data.msg || 'Error')
  }

  function handleCursoInputChange(e) {
    const { name, value } = e.target
    setCursoForm((s) => ({ ...s, [name]: value }))
  }

  function handleFileChange(e) {
    const f = e.target.files[0] || null
    if (!f) {
      setCursoFile(null)
      setCursoPreview(null)
      setCursoFileError(null)
      return
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 5 * 1024 * 1024
    if (!allowed.includes(f.type)) {
      setCursoFileError('Tipo de archivo no permitido. Usa JPG/PNG/WebP/GIF.')
      setCursoFile(null)
      return
    }
    if (f.size > maxSize) {
      setCursoFileError('El archivo supera 5MB.')
      setCursoFile(null)
      return
    }
    setCursoFileError(null)
    setCursoFile(f)
    if (cursoPreview && cursoPreview.startsWith('blob:')) URL.revokeObjectURL(cursoPreview)
    setCursoPreview(URL.createObjectURL(f))
  }

  async function uploadFile(type = 'courses') {
    if (!cursoFile) return ''
    const formData = new FormData()
    formData.append('file', cursoFile)
    const res = await fetch(`/php/upload_image.php?type=${encodeURIComponent(type)}`, { method: 'POST', body: formData })
    const data = await res.json()
    if (!data.success) {
      alert(data.msg || 'Error subiendo imagen')
      return ''
    }
    return data.url
  }

  async function handleCursoSubmit(e) {
    e.preventDefault()
    let imageUrl = cursoForm.imagen
    if (cursoFile) {
      imageUrl = await uploadFile('courses')
      if (!imageUrl) return
    }
    const body = new URLSearchParams({ titulo: cursoForm.titulo, descripcion: cursoForm.descripcion, imagen: imageUrl })
    const action = editingCursoId ? 'editar' : 'agregar'
    if (editingCursoId) body.append('id', editingCursoId)
    const res = await fetch(`/php/cursos.php?action=${action}`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
    const data = await res.json()
    if (data.success) {
      // refresh list
      const listRes = await fetch('/php/cursos.php?action=listar')
      const listData = await listRes.json()
      if (listData.success) setCursos(listData.cursos)
      setCursoForm({ titulo: '', descripcion: '', imagen: '' })
      setCursoFile(null)
      setEditingCursoId(null)
    } else {
      alert(data.msg || 'Error')
    }
  }

  function startEditCurso(c) {
    setEditingCursoId(c.id)
    setCursoForm({ titulo: c.titulo, descripcion: c.descripcion, imagen: c.imagen })
    setCursoFile(null)
  }

  return (
    <div>
      <Header />
  <main className="container admin section">
        <h2>Admin</h2>
        <section>
          <h3>Testimonios</h3>
          <form onSubmit={handleTestimonioSubmit} className="mb-3">
            <div className="mb-2">
              <input name="nombre" className="form-control" placeholder="Nombre" value={testimonioForm.nombre} onChange={handleTestimonioInputChange} required />
            </div>
            <div className="mb-2">
              <textarea name="contenido" className="form-control" placeholder="Contenido" value={testimonioForm.contenido} onChange={handleTestimonioInputChange} required />
            </div>
            <div className="mb-2">
              <input name="video_url" className="form-control" placeholder="URL del video (opcional)" value={testimonioForm.video_url} onChange={handleTestimonioInputChange} />
            </div>
            <div className="mb-2">
              <input type="file" accept="image/*" className="form-control" onChange={handleTestimonioFileChange} />
              {testimonioFileError && <div className="text-danger small mt-1">{testimonioFileError}</div>}
              {testimonioPreview && <div className="mt-2"><img src={testimonioPreview} alt="preview" className="preview-thumb" /></div>}
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" type="submit">{editingTestimonioId ? 'Guardar' : 'Agregar testimonio'}</button>
              {editingTestimonioId && <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditingTestimonioId(null); setTestimonioForm({ nombre: '', contenido: '', video_url: '' }) }}>Cancelar</button>}
            </div>
          </form>
          {testimonios.map((t) => (
            <div key={t.id} className="admin-item">
              {t.imagen ? <img src={t.imagen} alt="thumb" className="thumb" /> : <div className="thumb placeholder" />}
              <div className="admin-item-body">
                <strong>{t.nombre}</strong>
                <p>{t.contenido}</p>
              </div>
              <div className="admin-item-actions">
                {t.imagen && <button className="btn btn-sm btn-outline-warning" onClick={() => requestDeleteImage('testimonio', t.id)}>Eliminar imagen</button>}
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTestimonio(t.id)}>Eliminar</button>
                <button className="btn btn-sm btn-outline-primary" onClick={() => startEditTestimonio(t)}>Editar</button>
              </div>
            </div>
          ))}
        </section>
        <section>
          <h3>Cursos</h3>
          <form onSubmit={handleCursoSubmit} className="mb-3">
            <div className="mb-2">
              <input name="titulo" className="form-control" placeholder="Título" value={cursoForm.titulo} onChange={handleCursoInputChange} required />
            </div>
            <div className="mb-2">
              <textarea name="descripcion" className="form-control" placeholder="Descripción" value={cursoForm.descripcion} onChange={handleCursoInputChange} required />
            </div>
            <div className="mb-2">
              <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
              {cursoFileError && <div className="text-danger small mt-1">{cursoFileError}</div>}
              {cursoPreview && <div className="mt-2"><img src={cursoPreview} alt="preview" className="preview-thumb" /></div>}
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" type="submit">{editingCursoId ? 'Guardar cambios' : 'Agregar curso'}</button>
              {editingCursoId && <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditingCursoId(null); setCursoForm({ titulo: '', descripcion: '', imagen: '' }); setCursoFile(null) }}>Cancelar</button>}
            </div>
          </form>
          {cursos.map((c) => (
            <div key={c.id} className="admin-item">
              {c.imagen ? <img src={c.imagen} alt="thumb" className="thumb" /> : <div className="thumb placeholder" />}
              <div className="admin-item-body">
                <strong>{c.titulo}</strong>
                <p>{c.descripcion}</p>
              </div>
              <div className="admin-item-actions">
                {c.imagen && <button className="btn btn-sm btn-outline-warning" onClick={() => requestDeleteImage('curso', c.id)}>Eliminar imagen</button>}
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCurso(c.id)}>Eliminar</button>
                <button className="btn btn-sm btn-outline-primary" onClick={() => startEditCurso(c)}>Editar</button>
              </div>
            </div>
          ))}

          <ConfirmModal show={showConfirm} title="Eliminar imagen" message="¿Deseas eliminar la imagen asociada?" onConfirm={confirmDeleteImage} onCancel={() => { setShowConfirm(false); setConfirmTarget(null) }} />
          <Toast show={toast.show} message={toast.message} actionLabel="Deshacer" onAction={undoDeleteImage} onClose={() => setToast({ show: false, message: '', trashUrl: '', type: '', id: null })} />
        </section>
      </main>
    </div>
  )
}

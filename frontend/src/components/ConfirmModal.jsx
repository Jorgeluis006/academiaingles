import React from 'react'

export default function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null
  return (
    <div className="modal-backdrop-custom">
      <div className="card modal-card">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{message}</p>
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary me-2" onClick={onCancel}>Cancelar</button>
            <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

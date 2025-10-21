import React from 'react'

export default function Toast({ show, message, actionLabel, onAction, onClose }) {
  if (!show) return null
  return (
    <div className="toast-container">
      <div className="card">
        <div className="card-body d-flex align-items-center">
          <div className="flex-grow-1">{message}</div>
          {actionLabel && <button className="btn btn-link me-2" onClick={onAction}>{actionLabel}</button>}
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

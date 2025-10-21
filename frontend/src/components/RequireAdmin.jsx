import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function RequireAdmin({ children }) {
  const { isAdmin } = useContext(AuthContext)
  const location = useLocation()
  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cursos from './pages/Cursos'
import Login from './pages/Login'
import Quienes from './pages/Quienes'
import Testimonios from './pages/Testimonios'
import Admin from './pages/Admin'
import { AuthProvider } from './context/AuthContext'
import RequireAdmin from './components/RequireAdmin'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quienes" element={<Quienes />} />
        <Route path="/testimonios" element={<Testimonios />} />
        <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
      </Routes>
    </AuthProvider>
  )
}

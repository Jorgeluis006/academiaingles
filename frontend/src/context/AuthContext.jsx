import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const v = localStorage.getItem('atisbe_is_admin')
    setIsAdmin(v === '1' || v === 'true')
  }, [])

  function loginAdmin() { localStorage.setItem('atisbe_is_admin', '1'); setIsAdmin(true) }
  function logout() { localStorage.removeItem('atisbe_is_admin'); setIsAdmin(false) }

  return (
    <AuthContext.Provider value={{ isAdmin, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Cursos from './pages/Cursos';
import Admin from './pages/Admin';
import EditarCurso from './pages/EditarCurso';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/editar-curso" element={<EditarCurso />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

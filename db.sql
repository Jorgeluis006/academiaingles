-- Tabla de cursos para gestión desde admin
CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    imagen VARCHAR(255) NOT NULL
);

-- Ejemplo de cursos iniciales
INSERT INTO cursos (titulo, descripcion, imagen) VALUES
('Inglés', 'Aprende inglés con un enfoque práctico, divertido y personalizado para todas las edades y niveles.', 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&w=800&q=80'),
('Francés', 'Descubre la lengua y cultura francesa con clases dinámicas y adaptadas a tus objetivos.', 'https://images.pexels.com/photos/196652/pexels-photo-196652.jpeg?auto=compress&w=800&q=80'),
('Español para extranjeros', 'Vive el español como una experiencia cultural y comunicativa, con clases para todos los niveles.', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=800&q=80'),
('Club Conversacional', 'Mejora tu fluidez y confianza conversando en grupo, con temas actuales y actividades interactivas.', 'https://images.pexels.com/photos/1181355/pexels-photo-1181355.jpeg?auto=compress&w=800&q=80'),
('ConversArte', 'Aprende idiomas a través del arte, la música y la creatividad, en un ambiente inspirador y divertido.', 'https://images.pexels.com/photos/3808094/pexels-photo-3808094.jpeg?auto=compress&w=800&q=80'),
('Tour Cafetero', 'Vive una experiencia lingüística y cultural única, explorando el mundo del café y practicando idiomas.', 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&w=800&q=80'),
('Cursos para niños', 'Clases lúdicas y personalizadas para los más pequeños, fomentando el amor por los idiomas desde el inicio.', 'https://images.pexels.com/photos/861331/pexels-photo-861331.jpeg?auto=compress&w=800&q=80'),
('Clases personalizadas', 'Diseñamos un plan de estudio a tu medida, adaptándonos a tus metas, ritmo y necesidades específicas.', 'https://images.pexels.com/photos/4145196/pexels-photo-4145196.jpeg?auto=compress&w=800&q=80');
-- Script para crear la base de datos y tabla de usuarios/códigos
-- Ejecuta esto en el panel de MySQL de Hostinger

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    es_admin TINYINT(1) DEFAULT 0
);

-- Ejemplo: crear usuario admin
INSERT INTO usuarios (nombre, codigo, es_admin) VALUES ('admin', '1234', 1);

-- Tabla de testimonios para la sección pública y administración
CREATE TABLE IF NOT EXISTS testimonios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    video_url VARCHAR(255) DEFAULT NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejemplos de testimonios
INSERT INTO testimonios (nombre, contenido, video_url) VALUES
('María', 'Atisbe me ayudó a mejorar mi inglés rápidamente y con mucha confianza.', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
('Carlos', 'Las clases son amenas y los profesores muy profesionales.', NULL);

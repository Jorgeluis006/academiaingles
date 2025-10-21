# Atisbe Academy - Frontend

This is a React frontend scaffold (Vite) for the Atisbe Academy website.

Run:

- `npm install`
- `npm run dev`

Build:

- `npm run build`

Integration notes:

- The frontend calls PHP endpoints under `/php`:
	- `php/login.php` - login
	- `php/testimonios.php` - list/add/edit/delete testimonios
	- `php/cursos.php` - list/add/edit/delete cursos
	- `php/upload_image.php` - subir imágenes (guarda en `uploads/courses/`)
- Make sure the PHP backend is accessible from the deployed frontend and `uploads/courses/` is writable by PHP.

Deployment:

1. Build with `npm run build`.
2. Move `dist/` into your project or server's public folder together with `php/` and `uploads/`.
3. Ensure correct PHP configuration (`php/db.php` with database creds).

